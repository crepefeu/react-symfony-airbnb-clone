<?php

namespace App\Controller;

use App\Entity\Property;
use App\Repository\PropertyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Address;
use App\Entity\PropertyMedia;
use App\Entity\Amenity;
use Symfony\Bundle\SecurityBundle\Security; // Change this line
use Doctrine\Common\Collections\ArrayCollection;

#[Route('/api/properties', name: 'app_properties_')]
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
        $bedrooms = $request->query->has('bedrooms') ? (int) $request->query->get('bedrooms') : null;
        
        $properties = $propertyRepository->findInBounds(
            (float) $request->query->get('north'),
            (float) $request->query->get('south'),
            (float) $request->query->get('east'),
            (float) $request->query->get('west'),
            $bedrooms
        );

        return $this->json(['properties' => $properties], 200, [], ['groups' => ['property:read']]);
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(Security $security): JsonResponse
    {
        $properties = $this->propertyRepository->findAll();
        $user = $security->getUser();

        return $this->json([
            'properties' => $properties
        ], 200, [], [
            'groups' => ['property:read'],
            'user' => $user
        ]);
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
    public function show(Property $property, Security $security): JsonResponse
    {
        return $this->json([
            'property' => $property
        ], 200, [], [
            'groups' => ['property:read', 'property:details'],
            'user' => $security->getUser()
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

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $user = $this->getUser();
            $propertyData = json_decode($request->request->get('property'), true);
            
            // Debug the received data
            error_log('Received property data: ' . print_r($propertyData, true));
            
            $property = new Property();
            $property->setTitle($propertyData['title']);
            $property->setDescription($propertyData['description']);
            $property->setPrice($propertyData['price']);
            $property->setPropertyType($propertyData['propertyType']);
            $property->setMaxGuests($propertyData['maxGuests']);
            $property->setBedrooms($propertyData['bedrooms']);
            $property->setBathrooms($propertyData['bathrooms']);
            $property->setLatitude($propertyData['latitude']);
            $property->setLongitude($propertyData['longitude']);
            $user->addProperty($property);

            // debug the address data
            error_log('Received address data: ' . print_r($propertyData['address'], true));

            // debug each address field
            error_log('Street Name: ' . $propertyData['address']['streetName']);
            error_log('Street Number: ' . $propertyData['address']['streetNumber']);
            error_log('City: ' . $propertyData['address']['city']);
            error_log('State: ' . $propertyData['address']['state']);
            error_log('Zipcode: ' . $propertyData['address']['zipcode']);
            error_log('Country: ' . $propertyData['address']['country']);

            $address = new Address();
            $address->setStreetName($propertyData['address']['streetName']);
            $address->setStreetNumber($propertyData['address']['streetNumber'] ?? '');
            $address->setCity($propertyData['address']['city']);
            $address->setState($propertyData['address']['state']);
            $address->setZipcode($propertyData['address']['zipcode']);
            $address->setCountry($propertyData['address']['country']);
            $address->setCoordinates($propertyData['latitude'], $propertyData['longitude']);
            
            $entityManager->persist($address);
            $property->setAddress($address);

            // Handle photo uploads
            $files = $request->files->get('photos');
            if ($files) {
                foreach ($files as $index => $file) {
                    $media = new PropertyMedia();
                    $media->setProperty($property);
                    
                    // Generate unique filename
                    $fileName = md5(uniqid()) . '.' . $file->guessExtension();
                    
                    // Move file to public directory
                    $file->move(
                        $this->getParameter('property_images_directory'),
                        $fileName
                    );
                    
                    // Set the URL (relative path to the file)
                    $media->setUrl('/uploads/properties/' . $fileName);
                    
                    $entityManager->persist($media);
                }
            }

            // Debug the amenities data
            error_log('Received amenities data: ' . print_r($propertyData['amenities'], true));

            // Handle amenities
            if (isset($propertyData['amenities']) && is_array($propertyData['amenities'])) {
                $amenityRepo = $entityManager->getRepository(Amenity::class);
                foreach ($propertyData['amenities'] as $amenityId) {
                    $amenity = $amenityRepo->find($amenityId);
                    if ($amenity) {
                        $property->addAmenity($amenity);
                        $entityManager->persist($amenity); // Explicitly persist each amenity
                    }
                }
            }

            $entityManager->persist($property);
            $entityManager->flush();            

            return $this->json([
                'message' => 'Property created successfully',
                'id' => $property->getId()
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'message' => 'Error creating property: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $propertyData ?? null
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['PUT'])]
    public function edit(Request $request, Property $property, EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        // Check if user is the owner
        if ($security->getUser() !== $property->getOwner()) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        try {
            $data = json_decode($request->getContent(), true);
            
            $property->setTitle($data['title']);
            $property->setDescription($data['description']);
            $property->setPrice($data['price']);
            $property->setMaxGuests($data['maxGuests']);
            $property->setBedrooms($data['bedrooms']);
            $property->setBathrooms($data['bathrooms']);

            // Update address
            $address = $property->getAddress();
            $address->setStreetName($data['address']['streetName']);
            $address->setStreetNumber($data['address']['streetNumber'] ?? '');
            $address->setCity($data['address']['city']);
            $address->setState($data['address']['state']);
            $address->setZipcode($data['address']['zipcode']);
            $address->setCountry($data['address']['country']);
            
            // Update amenities
            $property->getAmenities()->clear();
            if (isset($data['amenities']) && is_array($data['amenities'])) {
                $amenityRepo = $entityManager->getRepository(Amenity::class);
                foreach ($data['amenities'] as $amenityId) {
                    $amenity = $amenityRepo->find($amenityId);
                    if ($amenity) {
                        $property->addAmenity($amenity);
                    }
                }
            }

            $entityManager->flush();

            return $this->json([
                'message' => 'Property updated successfully',
                'property' => $property
            ], Response::HTTP_OK, [], ['groups' => ['property:read']]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Error updating property: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}/photos', name: 'update_photos', methods: ['PUT'])]
    public function updatePhotos(Request $request, Property $property, EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        if ($security->getUser() !== $property->getOwner()) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        try {
            $data = json_decode($request->getContent(), true);
            $newPhotoOrder = $data['photos'] ?? [];

            // Debug log
            error_log('Received new photo order: ' . print_r($newPhotoOrder, true));

            // Get current property media
            $currentMedia = $property->getPropertyMedias();
            
            // Create a map of URL to PropertyMedia entity
            $mediaMap = [];
            foreach ($currentMedia as $media) {
                $mediaMap[$media->getUrl()] = $media;
            }

            // Create a new ordered collection
            $orderedMedia = new ArrayCollection();
            
            // Add media in the new order
            foreach ($newPhotoOrder as $url) {
                if (isset($mediaMap[$url])) {
                    $orderedMedia->add($mediaMap[$url]);
                    // Debug log
                    error_log('Adding media with URL: ' . $url);
                }
            }

            // Remove all media from the property
            foreach ($currentMedia as $media) {
                $property->removePropertyMedia($media);
            }

            // Add media back in the new order
            foreach ($orderedMedia as $media) {
                $property->addPropertyMedia($media);
            }

            $entityManager->flush();

            // Debug log
            error_log('Final media count: ' . count($property->getPropertyMedias()));

            return $this->json([
                'message' => 'Property photos updated successfully',
                'photos' => $newPhotoOrder
            ]);

        } catch (\Exception $e) {
            error_log('Error in updatePhotos: ' . $e->getMessage());
            return $this->json([
                'error' => 'Error updating property photos: ' . $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
