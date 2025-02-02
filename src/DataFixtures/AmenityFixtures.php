<?php

namespace App\DataFixtures;

use App\Entity\Amenity;
use App\Enum\AmenityCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AmenityFixtures extends Fixture
{
    public const AMENITIES = [
        // Essential amenities
        ['name' => 'Wifi', 'category' => AmenityCategory::WIFI],
        ['name' => 'TV', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Kitchen', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Washer', 'category' => AmenityCategory::LAUNDRY],
        ['name' => 'Free parking on premises', 'category' => AmenityCategory::PARKING],
        ['name' => 'Paid parking on premises', 'category' => AmenityCategory::PARKING],
        ['name' => 'Air conditioning', 'category' => AmenityCategory::COOLING],
        ['name' => 'Dedicated workspace', 'category' => AmenityCategory::WORKSPACE],
        
        // Special features
        ['name' => 'Pool', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Hot tub', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Patio', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'BBQ grill', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Outdoor dining area', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Fire pit', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Pool table', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Fireplace', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Piano', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Exercise equipment', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Lake access', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Beach access', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Ski-in/Ski-out', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Outdoor shower', 'category' => AmenityCategory::OUTDOOR],
        
        // Safety features
        ['name' => 'Smoke detector', 'category' => AmenityCategory::SAFETY],
        ['name' => 'First aid kit', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Fire extinguisher', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Carbon monoxide detector', 'category' => AmenityCategory::SAFETY],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::AMENITIES as $index => $amenityData) {
            $amenity = new Amenity();
            $amenity->setName($amenityData['name']);
            $amenity->setCategory($amenityData['category']);
            
            $manager->persist($amenity);
            // Create a clone of the amenity for each property to use
            $this->addReference('amenity_template_' . $index, $amenity);
        }

        $manager->flush();
    }
}
