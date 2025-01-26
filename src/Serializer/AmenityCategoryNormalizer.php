<?php

namespace App\Serializer;

use App\Enum\AmenityCategory;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class AmenityCategoryNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        if (!$object instanceof AmenityCategory) {
            throw new \InvalidArgumentException('Invalid object type');
        }

        return [
            'name' => $object->value,
            'icon' => $object->getIcon(),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof AmenityCategory;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            AmenityCategory::class => true,
        ];
    }
}