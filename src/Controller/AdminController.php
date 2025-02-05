<?php

namespace App\Controller;

use App\Repository\PropertyRepository;
use App\Repository\BookingRepository;
use App\Repository\AmenityRepository;
use App\Repository\ReviewRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'dashboard')]
    public function dashboard(): Response
    {
        return $this->render('admin/dashboard.html.twig');
    }

    #[Route('/admin/properties', name: 'admin_properties')]
    public function properties(): Response
    {
        return $this->render('admin/properties.html.twig');
    }

    #[Route('/admin/amenities', name: 'admin_amenities')]
    public function amenities(): Response
    {
        return $this->render('admin/amenities.html.twig');
    }

    #[Route('/admin/users', name: 'admin_user')]
    public function users(): Response
    {
        return $this->render('admin/users.html.twig');
    }

    #[Route('api/admin/stats', name: 'stats', methods: ['GET'])]
    public function getStats(
        PropertyRepository $propertyRepository,
        UserRepository $userRepository,
        BookingRepository $bookingRepository,
        ReviewRepository $reviewRepository,
        AmenityRepository $amenityRepository
    ): JsonResponse
    {
        $propertiesTrend = $propertyRepository->getNewPropertiesTrend();
        $properties = $propertyRepository->findAll();

        $usersTrend = $userRepository->getNewUsersTrend();
        $users = $userRepository->findAll();

        $bookingsTrend = $bookingRepository->getNewBookingsTrend();
        $bookings = $bookingRepository->findAll();

        $reviewsTrend = $reviewRepository->getNewReviewsTrend();
        $reviews = $reviewRepository->findAll();
        $reviewsAvgRating = $reviewRepository->getAverageRating();

        $amenities = $amenityRepository->findAll();

        return $this->json([
            'properties' => [
                'trend' => $propertiesTrend['trend'],
                'current' => $propertiesTrend['current'],
                'total' => count($properties)
            ],
            'users' => [
                'trend' => $usersTrend['trend'],
                'current' => $usersTrend['current'],
                'total' => count($users)
            ],
            'bookings' => [
                'trend' => $bookingsTrend['trend'],
                'current' => $bookingsTrend['current'],
                'previous' => $bookingsTrend['previous'],
                'total' => count($bookings)
            ],
            'reviews' => [
                'trend' => $reviewsTrend['trend'],
                'current' => $reviewsTrend['current'],
                'total' => count($reviews),
                'avgRating' => $reviewsAvgRating
            ],
            'amenities' => [
                'total' => count($amenities)
            ]
        ]);
    }

    #[Route('/api/admin/users', name: 'admin_users', methods: ['GET'])]
    public function getUsers(UserRepository $userRepository): JsonResponse
    {
            $users = $userRepository->findAll();
            
            return $this->json(['users' => $users]);     
    }

    #[Route('/api/admin/property/delete/{id}', name: 'admin_property_delete', methods: ['GET'])]
    public function deleteProperty(
        string $id, 
        PropertyRepository $propertyRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $property = $propertyRepository->find($id);

        if (!$property) {
            return $this->json(
                ['error' => 'Property not found'], 
                Response::HTTP_NOT_FOUND
            );
        }

        $entityManager->remove($property);
        $entityManager->flush();

        return $this->json(
            ['message' => 'Property deleted successfully'],
            Response::HTTP_OK
        );
    }

    #[Route('/api/admin/amenity/delete/{id}', name: 'admin_amenity_delete', methods: ['GET'])]
    public function deleteAmenity(
        string $id, 
        AmenityRepository $amenityRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $amenity = $amenityRepository->find($id);

        if (!$amenity) {
            return $this->json(
                ['error' => 'Amenity not found'], 
                Response::HTTP_NOT_FOUND
            );
        }
        $entityManager->remove($amenity);
        $entityManager->flush();

        return $this->json(
            ['message' => 'Amenity deleted successfully'],
            Response::HTTP_OK
        );
    }

    #[Route('/api/admin/user/delete/{id}', name: 'admin_user_delete', methods: ['GET'])]
    public function deleteUser(
        string $id, 
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return $this->json(
                ['error' => 'Property not found'], 
                Response::HTTP_NOT_FOUND
            );
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(
            ['message' => 'User deleted successfully.'],
            Response::HTTP_OK
        );
    }
}

