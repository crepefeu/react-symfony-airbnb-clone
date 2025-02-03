<?php

namespace App\Serializer;

use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class UserNormalizer implements NormalizerInterface
{
    private $normalizer;
    private const ALREADY_CALLED = 'USER_NORMALIZER_ALREADY_CALLED';

    public function __construct(NormalizerInterface $normalizer)
    {
        $this->normalizer = $normalizer;
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        $context[self::ALREADY_CALLED] = true;

        return [
            'id' => $object->getId(),
            'email' => $object->getEmail(),
            'firstName' => $object->getFirstName(),
            'lastName' => $object->getLastName(),
            'profilePicture' => $object->getProfilePicture(),
            'bio' => $object->getBio(),
            'createdAt' => $object->getCreatedAt()?->format('c'),
            'averageRating' => $object->getAverageRating(),
            'roles' => $object->getRoles(),
            'properties' => array_map(function($property) use ($format, $context) {
                return [
                    'id' => $property->getId(),
                    'title' => $property->getTitle(),
                    'description' => $property->getDescription(),
                    'price' => $property->getPrice(),
                    'bedrooms' => $property->getBedrooms(),
                    'bathrooms' => $property->getBathrooms(),
                    'images' => $property->getPropertyMedias()->map(fn($media) => $media->getUrl())->toArray(),
                    'averageRating' => $property->getAverageRating(),
                ];
            }, $object->getProperties()->toArray()),
            'propertyDrafts' => array_map(function($draft) {
                return [
                    'id' => $draft->getId(),
                    'currentStep' => $draft->getCurrentStep(),
                    'lastSaved' => $draft->getLastSaved()->format('c'),
                    'data' => $draft->getData(),
                ];
            }, $object->getPropertyDrafts()->toArray()),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof User;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            User::class => true,
        ];
    }
}
