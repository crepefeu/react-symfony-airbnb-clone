<?php

namespace App\Serializer;

use App\Entity\Booking;
use App\Repository\ReviewRepository;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class BookingNormalizer implements NormalizerInterface
{
    private $normalizer;
    private $reviewRepository;
    private const ALREADY_CALLED = 'BOOKING_NORMALIZER_ALREADY_CALLED';

    public function __construct(ObjectNormalizer $normalizer, ReviewRepository $reviewRepository)
    {
        $this->normalizer = $normalizer;
        $this->reviewRepository = $reviewRepository;
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array
    {
        $context[self::ALREADY_CALLED] = true;
        $property = $object->getProperty();
        $guest = $object->getGuest();
        $review = $this->reviewRepository->findOneByPropertyAndAuthor($property->getId(), $guest->getId());
        $propertyOwner = $property->getOwner();
        $images = $property->getPropertyMedias()->map(function ($media) {
            return $media->getUrl();
        })->toArray();
        if (!empty($review)) {
            $reviewId = $review[0]->getId();
            $reviewRating = $review[0]->getRating();
            $reviewComment = $review[0]->getComment();
            $reviewCreatedAt = $review[0]->getCreatedAt();
        } else {
            $reviewId = null;
            $reviewRating = null;
            $reviewComment = null;
            $reviewCreatedAt = null;      
        }
        return [
            'id' => $object->getId(),
            'property' => [
                'id' => $property->getId(),
                'title' => $property->getTitle(),
                'image' => $images[0],
                'owner' => [
                    'id' => $propertyOwner->getId(),
                    'lastName' => $propertyOwner->getLastName(),
                    'firstName' => $propertyOwner->getFirstName(),
                    'profilePicture' => $propertyOwner->getProfilePicture()
                ]
            ],
            'guest' => [
                'id' => $guest->getId(),
                'lastName' => $guest->getLastName(),
                'firstName' => $guest->getFirstName(),
                'profilePicture' => $guest->getProfilePicture()
            ],
            'review' => [
                'id' => $reviewId,
                'rating' => $reviewRating,
                'comment' => $reviewComment,
                'createdAt' => $reviewCreatedAt
            ],
            'checkInDate' => $object->getCheckInDate(),
            'checkOutDate' => $object->getCheckOutDate(),
            'numberOfGuests' => $object->getNumberOfGuests(),
            'totalPrice' => $object->getTotalPrice(),
            'status' => $object->getStatus()
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Booking;
    }

    /**
     * @return array<class-string, bool>
     */
    public function getSupportedTypes(?string $format): array
    {
        return [
            Booking::class => true,
        ];
    }
}
