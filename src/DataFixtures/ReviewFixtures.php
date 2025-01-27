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

    private const REVIEW_TEMPLATES = [
        5 => [
            'Exceptional stay! %s Near %s. %s',
            'Couldn\'t have asked for better! %s The host was amazing. Near %s. %s',
            'A true gem in Paris! %s Located close to %s. %s'
        ],
        4 => [
            'Great stay overall. %s Near %s. %s',
            'Very good experience. %s Close to %s. %s',
            'Lovely place. %s Walking distance to %s. %s'
        ],
        3 => [
            'Average stay. %s Located near %s, but %s',
            'Decent place. %s Close to %s, however %s',
            'Mixed feelings. %s Great location near %s, but %s'
        ]
    ];

    private const POSITIVE_ASPECTS = [
        'The bed was super comfortable.',
        'The kitchen was well-equipped.',
        'Beautiful natural light throughout.',
        'Very clean and well-maintained.',
        // Add more positive aspects...
    ];

    private const NEGATIVE_ASPECTS = [
        'The wifi was a bit slow.',
        'Some street noise at night.',
        'The elevator was quite small.',
        'Limited hot water at peak times.',
        // Add more negative aspects...
    ];

    public function load(ObjectManager $manager): void
    {
        $users = [
            UserFixtures::USER1_REFERENCE,
            UserFixtures::USER2_REFERENCE
        ];

        $landmarks = [
            'the Eiffel Tower',
            'Sacré-Cœur',
            'Notre-Dame',
            'the Seine River',
            'the Louvre Museum',
            'the Arc de Triomphe',
            'Luxembourg Gardens'
        ];

        // Generate reviews for all properties (20-30 properties now)
        for ($i = 0; $i < 25; $i++) {
            try {
                $property = $this->getReference('property_' . $i, Property::class);
                
                foreach (self::ADDITIONAL_REVIEWS as $reviewData) {
                    $review = new Review();
                    $rating = $reviewData['rating'];
                    
                    // Get random template for this rating
                    $templates = self::REVIEW_TEMPLATES[$rating];
                    $template = $templates[array_rand($templates)];
                    
                    // Generate comment with all required parameters
                    $comment = sprintf(
                        $template,
                        self::POSITIVE_ASPECTS[array_rand(self::POSITIVE_ASPECTS)],
                        $landmarks[array_rand($landmarks)],
                        $rating < 5 ? self::NEGATIVE_ASPECTS[array_rand(self::NEGATIVE_ASPECTS)] : 'Perfect stay!'
                    );

                    $review->setRating($rating)
                        ->setComment($comment)
                        ->setProperty($property)
                        ->setAuthor($this->getReference($users[array_rand($users, 1)], User::class))
                        ->setCreatedAt(new \DateTimeImmutable($reviewData['createdAt']));
                    
                    $manager->persist($review);
                }
            } catch (\Exception $e) {
                // Skip if property reference doesn't exist
                continue;
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
