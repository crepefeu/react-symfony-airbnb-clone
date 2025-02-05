<?php

namespace App\Controller;

use App\Enum\AmenityCategory;
use App\Entity\Amenity;
use App\Repository\AmenityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

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

    #[Route('/categories', name: 'categories', methods: ['GET'])]
    public function getCategories(): JsonResponse
    {
        $categories = array_map(
            fn (AmenityCategory $category) => [
                'name' => $category->name,
                'value' => $category->value,
                'icon' => $category->getIcon()
            ],
            AmenityCategory::cases()
        );
    
        return $this->json([
            'categories' => $categories
        ], 200);
    }

    #[Route('/add', name: 'create_amenity', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['name']) || empty($data['category'])) {
            return $this->json([
                'error' => 'Name and category are required fields'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $category = AmenityCategory::from($data['category']);
        } catch (\ValueError $e) {
            return $this->json([
                'error' => 'Invalid category.'
            ], Response::HTTP_BAD_REQUEST);
        }

        $amenity = new Amenity();
        $amenity->setName($data['name']);
        $amenity->setCategory($category);

        try {
            $entityManager->persist($amenity);
            $entityManager->flush();

            return $this->json([
                'message' => 'Amenity created successfully',
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Could not create amenity: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
