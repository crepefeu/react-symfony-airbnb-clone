<?php

namespace App\Controller;

use App\Repository\PropertyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{
    public function __construct(
        private PropertyRepository $propertyRepository
    ) {}

    #[Route('/search', name: 'app_search')]
    public function index(Request $request): Response
    {
        $searchParams = [
            'location' => $request->query->get('location'),
            'checkIn' => $request->query->get('checkIn'),
            'checkOut' => $request->query->get('checkOut'),
            'guests' => $request->query->get('guests'),
            'latitude' => $request->query->get('latitude'),
            'longitude' => $request->query->get('longitude'),
        ];

        return $this->render('search/index.html.twig', [
            'searchParams' => $searchParams,
        ]);
    }

    #[Route('/api/search', name: 'api_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        try {
            $location = $request->query->get('location');
            if (!$location) {
                throw new \InvalidArgumentException('Location parameter is required');
            }

            $guests = (int) $request->query->get('guests', 1);
            
            // Get coordinates directly from request parameters
            $coordinates = null;
            if ($request->query->has('latitude') && $request->query->has('longitude')) {
                $coordinates = [
                    'lat' => (float) $request->query->get('latitude'),
                    'lng' => (float) $request->query->get('longitude')
                ];
            }

            $properties = $this->propertyRepository->searchProperties(
                $location,
                $guests,
                $coordinates
            );

            return $this->json(['properties' => $properties], 200, [], ['groups' => ['property:read']]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Error searching properties: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
