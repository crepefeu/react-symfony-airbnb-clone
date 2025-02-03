<?php

namespace App\DataFixtures;

use App\Entity\PropertyDraft;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Amenity;

class PropertyDraftFixtures extends Fixture implements DependentFixtureInterface
{
    private const DRAFT_DATA = [
        [
            'currentStep' => 6,
            'data' => [
                'propertyType' => 'house',
                'latitude' => 48.8566,
                'longitude' => 2.3522,
                'address' => [
                    'streetName' => '123 Rue de Rivoli',
                    'streetNumber' => '123',
                    'city' => 'Paris',
                    'state' => 'Île-de-France',
                    'zipcode' => '75001',
                    'country' => 'France',
                ],
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'amenities' => [], // Will be filled in load()
                'title' => 'Charming House in Central Paris',
                'description' => 'A beautiful house in the heart of Paris, walking distance to major attractions.',
            ]
        ],
        [
            'currentStep' => 4,
            'data' => [
                'propertyType' => 'apartment',
                'latitude' => 48.8606,
                'longitude' => 2.3376,
                'address' => [
                    'streetName' => '45 Avenue Montaigne',
                    'streetNumber' => '45',
                    'city' => 'Paris',
                    'state' => 'Île-de-France',
                    'zipcode' => '75008',
                    'country' => 'France',
                ],
                'guests' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'amenities' => [], // Will be filled in load()
            ]
        ],
        [
            'currentStep' => 7,
            'data' => [
                'propertyType' => 'villa',
                'latitude' => 43.5298,
                'longitude' => 7.0339,
                'address' => [
                    'streetName' => '15 Boulevard de la Croisette',
                    'streetNumber' => '15',
                    'city' => 'Cannes',
                    'state' => 'Provence-Alpes-Côte d\'Azur',
                    'zipcode' => '06400',
                    'country' => 'France',
                ],
                'guests' => 8,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'amenities' => [], // Will be filled in load()
                'title' => 'Luxurious Villa with Sea View',
                'description' => 'Spectacular villa overlooking the Mediterranean, perfect for family gatherings.',
                'photos' => [], // Empty array since photos need to be uploaded
                'price' => 450, // Price per night
            ]
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        // Use the correct host references from UserFixtures
        $users = [
            UserFixtures::HOST1_REFERENCE,  // Sophie Martin
            UserFixtures::HOST2_REFERENCE,  // Pierre Dubois
            UserFixtures::HOST3_REFERENCE,  // Isabelle Roux
            UserFixtures::HOST4_REFERENCE   // Louis Bernard
        ];

        // Get amenity references with proper type hinting
        $wifi = $this->getReference(AmenityFixtures::WIFI_REFERENCE, Amenity::class);
        $tv = $this->getReference(AmenityFixtures::TV_REFERENCE, Amenity::class);
        $kitchen = $this->getReference(AmenityFixtures::KITCHEN_REFERENCE, Amenity::class);
        $washer = $this->getReference(AmenityFixtures::WASHER_REFERENCE, Amenity::class);
        $airConditioning = $this->getReference(AmenityFixtures::AIR_CONDITIONING_REFERENCE, Amenity::class);
        $heating = $this->getReference(AmenityFixtures::HEATING_REFERENCE, Amenity::class);

        // Create drafts data with amenities
        $draftsData = self::DRAFT_DATA;
        
        // Set amenities for each draft using the amenity objects directly
        $draftsData[0]['data']['amenities'] = [
            $wifi->getId(),
            $tv->getId(),
            $kitchen->getId(),
            $washer->getId()
        ];
        
        $draftsData[1]['data']['amenities'] = [
            $wifi->getId(),
            $tv->getId()
        ];
        
        $draftsData[2]['data']['amenities'] = [
            $wifi->getId(),
            $tv->getId(),
            $kitchen->getId(),
            $washer->getId(),
            $airConditioning->getId(),
            $heating->getId()
        ];
        
        foreach ($users as $i => $userReference) {
            foreach ($draftsData as $index => $draftData) {
                // Only create if we have enough drafts for distribution
                if ($index % count($users) === $i) {
                    $draft = new PropertyDraft();
                    $draft->setOwner($this->getReference($userReference, User::class));
                    $draft->setCurrentStep($draftData['currentStep']);
                    $draft->setData($draftData['data']);
                    
                    $manager->persist($draft);
                }
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            AmenityFixtures::class,
        ];
    }
}
