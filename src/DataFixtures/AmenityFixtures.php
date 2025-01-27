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
        ['name' => 'WiFi', 'category' => AmenityCategory::WIFI],
        ['name' => 'Ethernet connection', 'category' => AmenityCategory::WIFI],
        
        // Kitchen amenities
        ['name' => 'Full Kitchen', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Microwave', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Coffee maker', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Dishwasher', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Wine fridge', 'category' => AmenityCategory::KITCHEN],
        
        // Parking
        ['name' => 'Free parking', 'category' => AmenityCategory::PARKING],
        ['name' => 'Paid parking', 'category' => AmenityCategory::PARKING],
        ['name' => 'Private garage', 'category' => AmenityCategory::PARKING],
        
        // Climate control
        ['name' => 'Air conditioning', 'category' => AmenityCategory::COOLING],
        ['name' => 'Ceiling fans', 'category' => AmenityCategory::COOLING],
        ['name' => 'Central Heating', 'category' => AmenityCategory::HEATING],
        ['name' => 'Floor heating', 'category' => AmenityCategory::HEATING],
        
        // Safety
        ['name' => 'Smoke alarm', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Fire extinguisher', 'category' => AmenityCategory::SAFETY],
        ['name' => 'First aid kit', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Security cameras', 'category' => AmenityCategory::SAFETY],
        ['name' => 'Carbon monoxide alarm', 'category' => AmenityCategory::SAFETY],
        
        // Special features
        ['name' => 'Swimming Pool', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Hot tub', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Sauna', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Pool table', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Indoor fireplace', 'category' => AmenityCategory::FEATURES],
        
        // Outdoor
        ['name' => 'Patio', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'BBQ grill', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Garden', 'category' => AmenityCategory::OUTDOOR],
        ['name' => 'Balcony', 'category' => AmenityCategory::OUTDOOR],
        
        // Fitness
        ['name' => 'Gym Equipment', 'category' => AmenityCategory::FEATURES],
        ['name' => 'Yoga mat', 'category' => AmenityCategory::FEATURES],
        
        // Entertainment
        ['name' => 'Smart TV', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Sound system', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Gaming console', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Books and games', 'category' => AmenityCategory::ENTERTAINMENT],
        
        // Work
        ['name' => 'Workspace', 'category' => AmenityCategory::WORKSPACE],
        ['name' => 'Printer', 'category' => AmenityCategory::WORKSPACE],
        
        // Laundry
        ['name' => 'Washer', 'category' => AmenityCategory::LAUNDRY],
        ['name' => 'Dryer', 'category' => AmenityCategory::LAUNDRY],
        ['name' => 'Iron', 'category' => AmenityCategory::LAUNDRY],
        
        // Accessibility
        ['name' => 'Elevator', 'category' => AmenityCategory::ACCESSIBILITY],
        ['name' => 'Private entrance', 'category' => AmenityCategory::ACCESSIBILITY],
        ['name' => 'Step-free access', 'category' => AmenityCategory::ACCESSIBILITY],
        ['name' => 'Wide hallways', 'category' => AmenityCategory::ACCESSIBILITY],
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
