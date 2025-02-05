<?php

namespace App\Controller;

use App\Repository\PropertyRepository;
use App\Repository\BookingRepository;
use App\Repository\AmenityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/admin/dashboard', name: 'dashboard')]
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


    #[Route('/api/admin/property/trend', name: 'admin_property_trend', methods: ['GET'])]
    public function getTrend(PropertyRepository $propertyRepository): JsonResponse
    {
        
            $trend = $propertyRepository->getNewPropertiesTrend();
            $properties = $propertyRepository->findAll();
            
            return $this->json(['trend' => $trend, 'total' => count($properties)]);
        
    }

    #[Route('/api/admin/property/delete/{id}', name: 'admin_property_delete', methods: ['GET'])]
    public function deleteProperty(
        string $id, 
        PropertyRepository $propertyRepository,
        BookingRepository $bookingRepository,
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
        $bookings = $bookingRepository->findBy(['Property' => $property]);
        foreach ($bookings as $booking) {
            $entityManager->remove($booking);
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

}

