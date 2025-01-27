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

        return [
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
            'address' => $this->normalizer->normalize($object->getAddress(), $format, $context),
            'amenities' => array_map(fn($amenity) => [
                'id' => $amenity->getId(),
                'name' => $amenity->getName(),
                'category' => [
                    'name' => $amenity->getCategory()->value,
                    'icon' => $amenity->getCategory()->getIcon()
                ],
                'icon' => $amenity->getCategory()->getIcon(), // Add this line
            ], $object->getAmenities()->toArray()),
            'averageRating' => $object->getAverageRating(),
            'owner' => [
                'id' => $object->getOwner()->getId(),
                'firstName' => $object->getOwner()->getFirstName(),
                'lastName' => $object->getOwner()->getLastName(),
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
                ],
            ], $object->getReviews()->toArray()),
        ];
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
