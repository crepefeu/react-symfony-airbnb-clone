<?php

namespace App\Controller;

use App\Repository\AmenityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/amenities', name: 'api_amenities_')]
class AmenityController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(AmenityRepository $amenityRepository): JsonResponse
    {
        $amenities = $amenityRepository->findAll();
        
        return $this->json([
            'amenities' => $amenities,
        ], 200, [], ['groups' => ['property:read']]);
    }
}
