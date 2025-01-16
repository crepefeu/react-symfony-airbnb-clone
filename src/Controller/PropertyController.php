<?php

namespace App\Controller;

use App\Entity\Property;
use App\Repository\PropertyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

#[Route('/api/properties', name: 'api_properties_')]
class PropertyController extends AbstractController
{
    public function __construct(
        private PropertyRepository $propertyRepository
    ) {}

    #[Route('/nearby', name: 'nearby', methods: ['GET'])]
    public function getNearbyProperties(Request $request): JsonResponse
    {
        $latitude = $request->query->get('lat');
        $longitude = $request->query->get('lng');
        $radius = $request->query->get('radius', 10); // Default 10km radius

        $properties = $this->propertyRepository->findNearby(
            (float) $latitude,
            (float) $longitude,
            (float) $radius
        );

        return $this->json([
            'properties' => $properties,
        ]);
    }

    // #[Route('/bounds', name: 'bounds', methods: ['GET'])]
    // public function getPropertiesInBounds(Request $request): JsonResponse
    // {
    //     $properties = $this->propertyRepository->findWithinBounds(
    //         (float) $request->query->get('south'),
    //         (float) $request->query->get('north'),
    //         (float) $request->query->get('west'),
    //         (float) $request->query->get('east')
    //     );

    //     return $this->json([
    //         'properties' => $properties,
    //     ], 200, [], ['groups' => ['property:read', 'address:read']]);
    // }

    #[Route('/{id}/distance', name: 'distance', methods: ['GET'])]
    public function getDistanceToProperty(Property $property, Request $request): JsonResponse
    {
        $latitude = (float) $request->query->get('lat');
        $longitude = (float) $request->query->get('lng');

        $distance = $this->propertyRepository->findByDistance(
            $latitude,
            $longitude,
            100 // Maximum distance to check, in kilometers
        );

        return $this->json([
            'distance' => $distance,
        ]);
    }

    #[Route('/bounds', name: 'api_properties_bounds', methods: ['GET'])]
    public function getPropertiesInBounds(Request $request, PropertyRepository $propertyRepository): JsonResponse
    {
        $properties = $propertyRepository->findInBounds(
            (float) $request->query->get('north'),
            (float) $request->query->get('south'),
            (float) $request->query->get('east'),
            (float) $request->query->get('west')
        );

        return $this->json(['properties' => $properties], context: ['groups' => ['property:read']]);
    }
}
