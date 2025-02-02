<?php

namespace App\Controller;

use App\Entity\Property;
use App\Repository\PropertyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

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

    #[Route('/bounds', name: 'api_properties_bounds', methods: ['GET'])]
    public function getPropertiesInBounds(Request $request, PropertyRepository $propertyRepository): JsonResponse
    {
        $properties = $propertyRepository->findInBounds(
            (float) $request->query->get('north'),
            (float) $request->query->get('south'),
            (float) $request->query->get('east'),
            (float) $request->query->get('west'),
            (int) $request->query->get('bedrooms', 0)
        );

        return $this->json(['properties' => $properties], 200, [], ['groups' => ['property:read']]);
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $properties = $this->propertyRepository->findAll();

        return $this->json([
            'properties' => $properties,
        ], 200, [], ['groups' => ['property:read']]);
    }

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

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Property $property, Request $request): Response
    {
        // Return JSON for API requests
        if ($request->headers->get('Accept') === 'application/json') {
            return $this->json([
                'property' => $property,
            ], 200, [], ['groups' => ['property:read', 'property:details']]);
        }

        // Return HTML for browser requests
        return $this->render('property/show.html.twig', [
            'property' => $property,
        ]);
    }

    #[Route('/average-price', name: 'average_price', methods: ['GET'])]
    public function getAveragePrice(Request $request): JsonResponse
    {
        $lat = $request->query->get('lat');
        $lng = $request->query->get('lng');
        $bedrooms = $request->query->get('bedrooms', 2);

        $averagePrice = $this->propertyRepository->getAveragePriceInArea(
            (float) $lat,
            (float) $lng,
            (int) $bedrooms
        );

        return $this->json([
            'averagePrice' => $averagePrice,
        ]);
    }
}
