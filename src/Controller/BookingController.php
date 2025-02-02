<?php

namespace App\Controller;

use App\Entity\Booking;
use App\Form\BookingType;
use App\Repository\BookingRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

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

    // #[Route(name: 'app_booking_index', methods: ['GET'])]
    // public function index(BookingRepository $bookingRepository): Response
    // {
    //     return $this->render('booking/index.html.twig', [
    //         'bookings' => $bookingRepository->findAll(),
    //     ]);
    // }

    // #[Route('/new', name: 'app_booking_new', methods: ['GET', 'POST'])]
    // public function new(Request $request, EntityManagerInterface $entityManager): Response
    // {
    //     $booking = new Booking();
    //     $form = $this->createForm(BookingType::class, $booking);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $entityManager->persist($booking);
    //         $entityManager->flush();

    //         return $this->redirectToRoute('app_booking_index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     return $this->render('booking/new.html.twig', [
    //         'booking' => $booking,
    //         'form' => $form,
    //     ]);
    // }

    // #[Route('/{id}', name: 'app_booking_show', methods: ['GET'])]
    // public function show(Booking $booking): Response
    // {
    //     return $this->render('booking/show.html.twig', [
    //         'booking' => $booking,
    //     ]);
    // }

    // #[Route('/{id}/edit', name: 'app_booking_edit', methods: ['GET', 'POST'])]
    // public function edit(Request $request, Booking $booking, EntityManagerInterface $entityManager): Response
    // {
    //     $form = $this->createForm(BookingType::class, $booking);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $entityManager->flush();

    //         return $this->redirectToRoute('app_booking_index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     return $this->render('booking/edit.html.twig', [
    //         'booking' => $booking,
    //         'form' => $form,
    //     ]);
    // }

    // #[Route('/{id}', name: 'app_booking_delete', methods: ['POST'])]
    // public function delete(Request $request, Booking $booking, EntityManagerInterface $entityManager): Response
    // {
    //     if ($this->isCsrfTokenValid('delete'.$booking->getId(), $request->getPayload()->getString('_token'))) {
    //         $entityManager->remove($booking);
    //         $entityManager->flush();
    //     }

    //     return $this->redirectToRoute('app_booking_index', [], Response::HTTP_SEE_OTHER);
    // }
}
