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

#[Route('/property-drafts', name: 'property_drafts_')]
class PropertyDraftController extends AbstractController
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $em
    ) {}

    #[Route('/', name: 'menu', methods: ['GET'])]
    public function index(): Response
    {
        return $this->redirectToRoute('property_drafts_host_menu');
    }

    #[Route('/api/save', name: 'api_save', methods: ['POST'])]
    public function save(Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Ensure amenitiesData is preserved in the draft
        if (isset($data['formData']['amenities']) && !isset($data['formData']['amenitiesData'])) {
            $amenityRepo = $em->getRepository(Amenity::class);
            $amenities = $amenityRepo->findAll();
            $data['formData']['amenitiesData'] = array_map(function($amenity) {
                return [
                    'id' => $amenity->getId(),
                    'name' => $amenity->getName(),
                    'categoryName' => $amenity->getCategory()->getName(),
                    'categoryIcon' => $amenity->getCategory()->getIcon(),
                ];
            }, $amenities);
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
    }

    #[Route('/api/{id}', name: 'api_get', methods: ['GET'])]
    public function getDraft(PropertyDraft $draft): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user || $draft->getOwner() !== $user) {
            return $this->json(['error' => 'Not authorized'], 403);
        }

        return $this->json([
            'id' => $draft->getId(),
            'currentStep' => $draft->getCurrentStep(),
            'lastSaved' => $draft->getLastSaved()->format('c'),
            'data' => $draft->getData()
        ]);
    }

    #[Route('/api/{id}/publish', name: 'api_publish', methods: ['POST'])]
    public function publish(PropertyDraft $draft, EntityManagerInterface $em): JsonResponse
    {
        if ($draft->getOwner() !== $this->getUser()) {
            return $this->json(['error' => 'Not authorized'], 403);
        }

        try {
            $draftData = $draft->getData();
            $property = new Property();

            // Validate and cast numeric values
            if (!isset($draftData['price']) || !is_numeric($draftData['price'])) {
                throw new \InvalidArgumentException('Invalid price value');
            }
            if (!isset($draftData['guests']) || !is_numeric($draftData['guests'])) {
                throw new \InvalidArgumentException('Invalid guests value');
            }
            if (!isset($draftData['bedrooms']) || !is_numeric($draftData['bedrooms'])) {
                throw new \InvalidArgumentException('Invalid bedrooms value');
            }
            if (!isset($draftData['bathrooms']) || !is_numeric($draftData['bathrooms'])) {
                throw new \InvalidArgumentException('Invalid bathrooms value');
            }

            // Map draft data to property with proper type casting
            $property->setTitle($draftData['title']);
            $property->setDescription($draftData['description']);
            $property->setPrice((int)$draftData['price']);
            $property->setPropertyType($draftData['propertyType']);
            $property->setMaxGuests((int)$draftData['guests']);
            $property->setBedrooms((int)$draftData['bedrooms']);
            $property->setBathrooms((int)$draftData['bathrooms']);
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

            // Save property and remove draft
            $em->persist($property);
            $em->remove($draft);
            $em->flush();

            return $this->json([
                'message' => 'Property published successfully',
                'propertyId' => $property->getId()
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage(),
                'data' => $draftData ?? null
            ], 400);
        }
    }

    #[Route('/', name: 'list_page', methods: ['GET'])]
    public function listDraftsPage(): Response
    {
        return $this->render('property/drafts.html.twig', [
            'component_name' => 'PropertyDrafts'
        ]);
    }

    #[Route('/api', name: 'api_list', methods: ['GET'])]
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

    #[Route('/api/create', name: 'api_create', methods: ['POST'])]
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

    #[Route('/become-a-host', name: 'host_menu', methods: ['GET'])]
    public function hostMenu(): Response
    {
        return $this->render('property/host-menu.html.twig', [
            'component_name' => 'HostMenu'
        ]);
    }

    #[Route('/become-a-host/{id}', name: 'host_draft', methods: ['GET'])]
    public function hostDraft(PropertyDraft $draft): Response
    {
        return $this->render('property/host.html.twig', [
            'component_name' => 'BecomeHost',
        ]);
    }
}
