<?php

namespace App\DataFixtures;

use App\Entity\Review;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Property;
use App\Entity\User;

class ReviewFixtures extends Fixture implements DependentFixtureInterface
{
    private const ADDITIONAL_REVIEWS = [
        [
            'rating' => 5,
            'comment' => 'Perfect stay! Would definitely come back.',
            'createdAt' => '2023-11-15'
        ],
        [
            'rating' => 3,
            'comment' => 'Good location but needs some maintenance.',
            'createdAt' => '2023-11-10'
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        $users = [
            UserFixtures::USER1_REFERENCE,
            UserFixtures::USER2_REFERENCE
        ];

        for ($i = 0; $i < 10; $i++) {
            $property = $this->getReference('property_' . $i, Property::class);
            
            foreach (self::ADDITIONAL_REVIEWS as $reviewData) {
                $review = new Review();
                $review->setRating($reviewData['rating'])
                    ->setComment($reviewData['comment'])
                    ->setProperty($property)
                    ->setAuthor($this->getReference($users[array_rand($users, 1)], User::class))
                    ->setCreatedAt(new \DateTimeImmutable($reviewData['createdAt']));
                
                $manager->persist($review);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            PropertyFixtures::class,
        ];
    }
}
