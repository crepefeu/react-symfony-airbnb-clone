<?php

namespace App\Serializer;

use App\Entity\Property;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class PropertyNormalizer implements NormalizerInterface
{
    private $normalizer;
    private const ALREADY_CALLED = 'PROPERTY_NORMALIZER_ALREADY_CALLED';

    public function __construct(ObjectNormalizer $normalizer)
    {
        $this->normalizer = $normalizer;
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        $context[self::ALREADY_CALLED] = true;

        $user = $context['user'] ?? null;

        $images = $object->getPropertyMedias()->map(function ($media) {
            return $media->getUrl();
        })->toArray();

        $amenities = $object->getAmenities()->map(function ($amenity) {
            return [
                'id' => $amenity->getId(),
                'name' => $amenity->getName(),
                'category' => [
                    'name' => $amenity->getCategory()->value,
                    'icon' => $amenity->getCategory()->getIcon()
                ],
                'icon' => $amenity->getCategory()->getIcon(),
            ];
        })->toArray();

        $data = [
            'id' => $object->getId(),
            'title' => $object->getTitle(),
            'description' => $object->getDescription(),
            'price' => $object->getPrice(),
            'bedrooms' => $object->getBedrooms(),
            'bathrooms' => $object->getBathrooms(),
            'maxGuests' => $object->getMaxGuests(),
            'latitude' => $object->getLatitude(),
            'longitude' => $object->getLongitude(),
            'propertyType' => $object->getPropertyType(),
            'images' => $images, // Replace old images field with new mapping
            'address' => $this->normalizer->normalize($object->getAddress(), $format, $context),
            'amenities' => $amenities,
            'averageRating' => $object->getAverageRating(),
            'owner' => [
                'id' => $object->getOwner()->getId(),
                'firstName' => $object->getOwner()->getFirstName(),
                'lastName' => $object->getOwner()->getLastName(),
                'profilePicture' => $object->getOwner()->getProfilePicture(), // Add profile picture
                'bio' => $object->getOwner()->getBio(), // Add bio
                'propertiesCount' => $object->getOwner()->getProperties()->count(),
                'averageRating' => $object->getOwner()->getAverageRating(),
                'createdAt' => $object->getOwner()->getCreatedAt()->format('c'),
                'properties' => array_map(fn($property) => [
                    'id' => $property->getId(),
                    'title' => $property->getTitle(),
                    'description' => $property->getDescription(),
                    'price' => $property->getPrice(),
                    'bedrooms' => $property->getBedrooms(),
                    'bathrooms' => $property->getBathrooms(),
                    'maxGuests' => $property->getMaxGuests(),
                    'latitude' => $property->getLatitude(),
                    'longitude' => $property->getLongitude(),
                    'propertyType' => $property->getPropertyType(),
                    'address' => $this->normalizer->normalize($property->getAddress(), $format, $context),
                    'amenities' => array_map(fn($amenity) => [
                        'id' => $amenity->getId(),
                        'name' => $amenity->getName(),
                        'category' => [
                            'name' => $amenity->getCategory()->value,
                            'icon' => $amenity->getCategory()->getIcon()
                        ],
                        'icon' => $amenity->getCategory()->getIcon(), // Add this line
                    ], $property->getAmenities()->toArray()),
                    'averageRating' => $property->getAverageRating(),
                    'createdAt' => $property->getCreatedAt()->format('c'),
                ], $object->getOwner()->getProperties()->toArray()),
            ],
            'reviews' => array_map(fn($review) => [
                'id' => $review->getId(),
                'rating' => $review->getRating(),
                'comment' => $review->getComment(),
                'createdAt' => $review->getCreatedAt()->format('c'),
                'author' => [
                    'id' => $review->getAuthor()->getId(),
                    'firstName' => $review->getAuthor()->getFirstName(),
                    'lastName' => $review->getAuthor()->getLastName(),
                    'profilePicture' => $review->getAuthor()->getProfilePicture(), // Add reviewer's profile picture
                ],
            ], $object->getReviews()->toArray()),
            'createdAt' => $object->getCreatedAt()->format('c'),
            'updatedAt' => $object->getUpdatedAt()->format('c'),
            'isInWishlist' => $object->isInWishlist($user),
        ];

        return $data;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Property;
    }

    /**
     * @return array<class-string, bool>
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            Property::class => true,
        ];
    }
}
