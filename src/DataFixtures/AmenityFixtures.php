<?php

namespace App\DataFixtures;

use App\Entity\Amenity;
use App\Enum\AmenityCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AmenityFixtures extends Fixture
{
    private const AMENITIES = [
        ['name' => 'WiFi', 'category' => AmenityCategory::WIFI],
        ['name' => 'Full Kitchen', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Free parking', 'category' => AmenityCategory::PARKING],
        ['name' => 'Air conditioning', 'category' => AmenityCategory::COOLING],
        ['name' => 'Central Heating', 'category' => AmenityCategory::HEATING],
        ['name' => 'Smoke alarm', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Fire extinguisher', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Swimming Pool', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Hot tub', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Patio', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'BBQ grill', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Gym Equipment', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Smart TV', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Workspace', 'category' => AmenityCategory::WORKSPACE],
        ['name' => 'Washer', 'category' => AmenityCategory::LAUNDRY],
        ['name' => 'Dryer', 'category' => AmenityCategory::LAUNDRY],
        ['name' => 'Elevator', 'category' => AmenityCategory::ACCESSIBILITY],
        ['name' => 'Private entrance', 'category' => AmenityCategory::ACCESSIBILITY],
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
