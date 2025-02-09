<?php

namespace App\Controller;

use App\Entity\Booking;
use App\Enum\BookingStatus;
use App\Form\BookingType;
use App\Repository\BookingRepository;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;


#[Route('/api/bookings')]
final class BookingController extends AbstractController
{    
    #[Route('/user', name: 'get-user-bookings', methods: ['GET'])]
    public function getUserBookings(Security $security, SerializerInterface $serializer, BookingRepository $bookingRepository): JsonResponse
    {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $bookings = $bookingRepository->findBy(['Guest' => $user]);
        return $this->json(['trips' => $bookings], 200, [], ['groups' => ['booking:read']]);
    }

    #[Route('/manage', name: 'get-host-bookings', methods: ['GET'])]
    public function getHostBookings(Security $security, SerializerInterface $serializer, BookingRepository $bookingRepository): JsonResponse
    {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $bookings = $bookingRepository->findBookingsByOwner($user->getId());
        return $this->json(['bookings' => $bookings], 200, [], ['groups' => ['booking:read']]);
    }

    #[Route('/confirm', name: 'confirm-booking', methods: ['POST'])]
    public function confirmBooking(
        Request $request,
        Security $security,
        BookingRepository $bookingRepository,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer
    ): JsonResponse {
        return $this->changeBookingStatus($request, $security, $bookingRepository, $entityManager, BookingStatus::VALIDATED, $mailer);
    }

    #[Route('/cancel', name: 'cancel-booking', methods: ['POST'])]
    public function cancelBooking(
        Request $request,
        Security $security,
        BookingRepository $bookingRepository,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer
    ): JsonResponse {
        return $this->changeBookingStatus($request, $security, $bookingRepository, $entityManager, BookingStatus::CANCELED, $mailer);
    }

    #[Route('/create', name: 'create-booking', methods: ['POST'])]
    public function createBooking(Request $request, Security $security, PropertyRepository $propertyRepository, BookingRepository $bookingRepository, EntityManagerInterface $entityManager, MailerInterface $mailer): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['checkInDate']) || empty($data['checkOutDate']) || empty($data['numberOfGuests']) || empty($data['totalPrice']) || empty($data['propertyId'])) {
            return new JsonResponse(['error' => 'Missing required fields'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $property = $propertyRepository->find($data['propertyId']);

        if (!$property) {
            return new JsonResponse(['error' => 'Property not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $checkInDate = new \DateTime($data['checkInDate']);
        $checkOutDate = new \DateTime($data['checkOutDate']);

        if ($checkInDate >= $checkOutDate) {
            return new JsonResponse(
                ['error' => 'Check-in date must be before check-out date'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        if ($checkInDate < new \DateTime('today')) {
            return new JsonResponse(
                ['error' => 'Check-in date cannot be in the past'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $existingBookings = $bookingRepository->getExistingBookingsForGivenDates($property, $checkInDate, $checkOutDate);
        if (!empty($existingBookings)) {
            return new JsonResponse(
                ['error' => 'Property is not available for the selected dates'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $booking = new Booking();
        $booking->setCheckInDate($checkInDate);
        $booking->setCheckOutDate($checkOutDate);
        $booking->setNumberOfGuests($data['numberOfGuests']);
        $booking->setTotalPrice($data['totalPrice']);
        $booking->setCreatedAt(new \DateTimeImmutable());
        $booking->setProperty($property);
        $booking->setGuest($user);
        $booking->setStatus(BookingStatus::PENDING);

        $entityManager->persist($booking);
        $entityManager->flush();

        $link = $this->generateUrl(
            'bookings',
            [],
            UrlGeneratorInterface::ABSOLUTE_URL
        );
    
        $emailMessage = (new TemplatedEmail())
            ->from('no-reply@hostme.com')
            ->to($booking->getProperty()->getOwner()->getEmail())
            ->subject("New booking to confirm")
            ->htmlTemplate("booking/new-booking-mail-template.html.twig")
            ->context([
                'link' => $link,
                'firstName' => $booking->getProperty()->getOwner()->getFirstName(),
                'propertyName' => $booking->getProperty()->getTitle(),
            ]);
    
        $mailer->send($emailMessage);

        return new JsonResponse([
            'message' => 'Booking created successfully',
        ], JsonResponse::HTTP_CREATED);
    }

    private function changeBookingStatus(Request $request, Security $security, BookingRepository $bookingRepository, EntityManagerInterface $entityManager, BookingStatus $status, MailerInterface $mailer) {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $bookingId = $data['bookingId'] ?? null;

        if (!$bookingId) {
            return new JsonResponse(['error' => 'Booking ID is required'], Response::HTTP_BAD_REQUEST);
        }

        $booking = $bookingRepository->find($bookingId);

        if (!$booking) {
            return new JsonResponse(['error' => 'Booking not found'], Response::HTTP_NOT_FOUND);
        }

        if (
            ($status == BookingStatus::CANCELED &&
                $booking->getProperty()->getOwner()->getId() !== $user->getId() &&
                $booking->getGuest()->getId() !== $user->getId()) 
            || ($status == BookingStatus::VALIDATED &&
                $booking->getProperty()->getOwner()->getId() !== $user->getId())
        ) {
            return new JsonResponse(['error' => 'You are not authorized to confirm this booking'], Response::HTTP_FORBIDDEN);
        }

        $booking->setStatus($status);
        
        $entityManager->persist($booking);
        $entityManager->flush();

        $statusMessage = "";
        $subject = "";
        $mailTemplate = "";

        if ($status == BookingStatus::CANCELED) {
            $statusMessage = "canceled";
            $subject = "Your booking has been canceled";
            $mailTemplate = "booking/canceled-booking-mail-template.html.twig";
        }
        if ($status == BookingStatus::VALIDATED) {
            $statusMessage = "validated";
            $subject = "Your booking has been validated";
            $mailTemplate = "booking/confirmed-booking-mail-template.html.twig";
        }

        $link = $this->generateUrl(
            'trips',
            [],
            UrlGeneratorInterface::ABSOLUTE_URL
        );
    
        $emailMessage = (new TemplatedEmail())
            ->from('no-reply@hostme.com')
            ->to($booking->getGuest()->getEmail())
            ->subject($subject)
            ->htmlTemplate($mailTemplate)
            ->context([
                'link' => $link,
                'firstName' => $booking->getGuest()->getFirstName(),
                'propertyName' => $booking->getProperty()->getTitle(),
            ]);
    
        $mailer->send($emailMessage);

        return new JsonResponse([
            'message' => 'Booking '. $statusMessage .' successfully',
        ], Response::HTTP_OK);

    }
}