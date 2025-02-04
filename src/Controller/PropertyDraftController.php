<?php

namespace App\Controller;

use App\Entity\PropertyDraft;
use App\Entity\Property;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Address;
use App\Entity\Amenity;
use App\Entity\PropertyMedia;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\SecurityBundle\Security;
use App\Entity\User;


#[Route('/', name: 'property_drafts_')]
class PropertyDraftController extends AbstractController
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $em
    ) {}

    #[Route('drafts', name: 'list_page', methods: ['GET'])]
    public function listDraftsPage(): Response
    {
        return $this->render('property/drafts.html.twig', [
            'component_name' => 'HostMenu'
        ]);
    }

    #[Route('drafts/{id}', name: 'host_draft', methods: ['GET'])]
    public function hostDraft(PropertyDraft $draft): Response
    {
        return $this->render('property/host.html.twig', [
            'component_name' => 'BecomeHost',
        ]);
    }

    #[Route('/api/drafts/save', name: 'api_save', methods: ['POST'])]
    public function save(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        try {
            $data = json_decode($request->getContent(), true);
            
            // Sanitize numeric values before saving
            if (isset($data['formData'])) {
                $numericFields = ['price', 'guests', 'bedrooms', 'bathrooms'];
                foreach ($numericFields as $field) {
                    if (isset($data['formData'][$field])) {
                        $value = $data['formData'][$field];
                        // Convert to integer or null if not valid
                        $data['formData'][$field] = is_numeric($value) ? (int)$value : null;
                    }
                }
            }

            $draft = new PropertyDraft();
            if (isset($data['draftId'])) {
                $draft = $em->getRepository(PropertyDraft::class)->find($data['draftId']);
                if (!$draft || $draft->getOwner() !== $user) {
                    return $this->json(['error' => 'Draft not found'], 404);
                }
            }

            $draft->setOwner($user);
            $draft->setData($data['formData']);
            $draft->setCurrentStep($data['currentStep']);
            $draft->setLastSaved(new \DateTimeImmutable());

            $em->persist($draft);
            $em->flush();

            return $this->json([
                'message' => 'Draft saved successfully',
                'draftId' => $draft->getId()
            ], 200, [], ['groups' => ['draft:read']]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Error saving draft: ' . $e->getMessage(),
                'data' => $data ?? null
            ], 400);
        }
    }

    #[Route('api/drafts/{id}', name: 'api_get', methods: ['GET'])]
    public function getDraft(PropertyDraft $draft): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user || $draft->getOwner() !== $user) {
            return $this->json(['error' => 'Not authorized'], 403);
        }

        $draftData = $draft->getData();
        
        // Ensure numeric values are properly formatted
        $numericFields = ['price', 'guests', 'bedrooms', 'bathrooms'];
        foreach ($numericFields as $field) {
            if (isset($draftData[$field])) {
                // Convert to integer or null if not valid
                $draftData[$field] = is_numeric($draftData[$field]) 
                    ? (int)$draftData[$field] 
                    : null;
            }
        }

        return $this->json([
            'id' => $draft->getId(),
            'currentStep' => $draft->getCurrentStep(),
            'lastSaved' => $draft->getLastSaved()->format('c'),
            'data' => $draftData
        ]);
    }

    #[Route('api/drafts/{id}/publish', name: 'api_publish', methods: ['POST'])]
    public function publish(PropertyDraft $draft, EntityManagerInterface $em): JsonResponse
    {
        if ($draft->getOwner() !== $this->getUser()) {
            return $this->json(['error' => 'Not authorized'], 403);
        }

        try {
            $draftData = $draft->getData();
            
            // Debug log
            error_log('Publishing draft with data: ' . json_encode($draftData));
            
            // Validate and sanitize numeric values
            $numericFields = [
                'price' => ['required' => true, 'min' => 0],
                'guests' => ['required' => true, 'min' => 1],
                'bedrooms' => ['required' => true, 'min' => 1],
                'bathrooms' => ['required' => true, 'min' => 1]
            ];

            // Sanitize numeric values
            foreach ($numericFields as $field => $rules) {
                if (!isset($draftData[$field]) || 
                    $draftData[$field] === '' || 
                    $draftData[$field] === 'undefined' || 
                    $draftData[$field] === null
                ) {
                    throw new \InvalidArgumentException("Missing {$field}");
                }

                $value = filter_var($draftData[$field], FILTER_VALIDATE_INT);
                if ($value === false || ($rules['min'] !== null && $value < $rules['min'])) {
                    throw new \InvalidArgumentException("Invalid {$field} value: {$draftData[$field]}");
                }

                $draftData[$field] = $value;
            }

            $property = new Property();
            
            // Now set the validated values
            $property->setPrice($draftData['price']);
            $property->setMaxGuests($draftData['guests']);
            $property->setBedrooms($draftData['bedrooms']);
            $property->setBathrooms($draftData['bathrooms']);
            
            // Map draft data to property with proper type casting
            $property->setTitle($draftData['title']);
            $property->setDescription($draftData['description']);
            $property->setPropertyType($draftData['propertyType']);
            $property->setLatitude((float)$draftData['latitude']);
            $property->setLongitude((float)$draftData['longitude']);
            $property->setOwner($this->getUser());

            // Create and set address
            $address = new Address();
            $address->setStreetName($draftData['address']['streetName']);
            $address->setStreetNumber($draftData['address']['streetNumber'] ?? '');
            $address->setCity($draftData['address']['city']);
            $address->setState($draftData['address']['state']);
            $address->setZipcode($draftData['address']['zipcode']);
            $address->setCountry($draftData['address']['country']);
            
            $address->setCoordinates($property->getLatitude(), $property->getLongitude());
            
            $em->persist($address);
            $property->setAddress($address);

            // Handle photos
            if (isset($draftData['photos'])) {
                foreach ($draftData['photos'] as $photoData) {
                    if (isset($photoData['preview']) && strpos($photoData['preview'], '/uploads/properties/') !== false) {
                        $media = new PropertyMedia();
                        $media->setProperty($property);
                        $media->setUrl($photoData['preview']);
                        $media->setType(\App\Enum\MediaType::IMAGE);
                        $em->persist($media);
                    }
                }
            }

            // Handle amenities
            if (isset($draftData['amenities'])) {
                $amenityRepo = $em->getRepository(Amenity::class);
                foreach ($draftData['amenities'] as $amenityId) {
                    $amenity = $amenityRepo->find($amenityId);
                    if ($amenity) {
                        $property->addAmenity($amenity);
                    }
                }
            }

            // Explicitly handle the draft deletion
            try {
                // Save property first
                $em->persist($property);
                $em->flush();

                // Then remove the draft
                $em->remove($draft);
                $em->flush();

                return $this->json([
                    'message' => 'Property published successfully',
                    'propertyId' => $property->getId()
                ]);
            } catch (\Exception $e) {
                // If something goes wrong during deletion, log it but don't fail the request
                error_log('Error removing draft: ' . $e->getMessage());
                return $this->json([
                    'message' => 'Property published successfully, but draft cleanup failed',
                    'propertyId' => $property->getId()
                ]);
            }
        } catch (\Exception $e) {
            error_log('Error publishing draft: ' . $e->getMessage());
            return $this->json([
                'error' => $e->getMessage(),
                'data' => $draftData ?? null
            ], 400);
        }
    }

    #[Route('api/drafts', name: 'api_list', methods: ['GET'])]
    public function listDraftsApi(): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->security->getUser();

            // Add debug logging
            error_log('Security context user: ' . ($user ? $user->getId() : 'null'));
            error_log('Token: ' . ($this->security->getToken() ? 'exists' : 'null'));

            if (!$user) {
                error_log('User not found in security context');
                return $this->json(['error' => 'User not authenticated'], 401);
            }

            $drafts = $this->em->getRepository(PropertyDraft::class)
                ->findBy(
                    ['owner' => $user],
                    ['lastSaved' => 'DESC']
                );

            $serializedDrafts = array_map(function ($draft) {
                return [
                    'id' => $draft->getId(),
                    'currentStep' => $draft->getCurrentStep(),
                    'lastSaved' => $draft->getLastSaved()->format('c'),
                    'data' => $draft->getData()
                ];
            }, $drafts);

            error_log('Found drafts for user ' . $user->getId() . ': ' . count($drafts));

            return $this->json(['drafts' => $serializedDrafts]);
        } catch (\Exception $e) {
            error_log('Error in listDraftsApi: ' . $e->getMessage());
            return $this->json(['error' => 'Internal server error'], 500);
        }
    }

    #[Route('api/drafts/create', name: 'api_create', methods: ['POST'])]
    public function createDraft(EntityManagerInterface $em): JsonResponse
    {
        $draft = new PropertyDraft();
        $draft->setOwner($this->getUser());
        $draft->setCurrentStep(1);
        $draft->setData([
            'propertyType' => '',
            'guests' => 1,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'amenities' => [],
            'photos' => [],
        ]);

        $em->persist($draft);
        $em->flush();

        return $this->json([
            'message' => 'Draft created successfully',
            'draftId' => $draft->getId()
        ]);
    }

    #[Route('api/drafts/{id}', name: 'api_delete', methods: ['DELETE'])]
    public function deleteDraft(PropertyDraft $draft): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user || $draft->getOwner() !== $user) {
            return $this->json(['error' => 'Not authorized'], 403);
        }

        try {
            $this->em->remove($draft);
            $this->em->flush();

            return $this->json(['message' => 'Draft deleted successfully']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error deleting draft'], 500);
        }
    }
}
