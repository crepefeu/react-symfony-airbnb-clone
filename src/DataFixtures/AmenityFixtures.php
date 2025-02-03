<?php

namespace App\DataFixtures;

use App\Entity\Amenity;
use App\Enum\AmenityCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AmenityFixtures extends Fixture
{
    // Reference constants for common amenities
    public const WIFI_REFERENCE = 'amenity_wifi';
    public const TV_REFERENCE = 'amenity_tv';
    public const KITCHEN_REFERENCE = 'amenity_kitchen';
    public const WASHER_REFERENCE = 'amenity_washer';
    public const PARKING_REFERENCE = 'amenity_parking';
    public const AIR_CONDITIONING_REFERENCE = 'amenity_air_conditioning';
    public const HEATING_REFERENCE = 'amenity_heating';
    public const POOL_REFERENCE = 'amenity_pool';
    public const WORKSPACE_REFERENCE = 'amenity_workspace';

    // Add safety amenity reference constants
    public const SMOKE_DETECTOR_REFERENCE = 'amenity_smoke_detector';
    public const FIRST_AID_REFERENCE = 'amenity_first_aid';
    public const FIRE_EXTINGUISHER_REFERENCE = 'amenity_fire_extinguisher';
    public const CO_DETECTOR_REFERENCE = 'amenity_carbon_monoxide_detector';

    public const AMENITIES = [
        // Essential amenities
        ['name' => 'Wifi', 'category' => AmenityCategory::WIFI],
        ['name' => 'TV', 'category' => AmenityCategory::ENTERTAINMENT],
        ['name' => 'Kitchen', 'category' => AmenityCategory::KITCHEN],
        ['name' => 'Washer', 'category' => AmenityCategory::LAUNDRY],
        ['name' => 'Free parking on premises', 'category' => AmenityCategory::PARKING],
        ['name' => 'Paid parking on premises', 'category' => AmenityCategory::PARKING],
        ['name' => 'Air conditioning', 'category' => AmenityCategory::COOLING],
        ['name' => 'Heating', 'category' => AmenityCategory::HEATING], // Add this line
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
        $referenceMap = [
            'Wifi' => self::WIFI_REFERENCE,
            'TV' => self::TV_REFERENCE,
            'Kitchen' => self::KITCHEN_REFERENCE,
            'Washer' => self::WASHER_REFERENCE,
            'Free parking on premises' => self::PARKING_REFERENCE,
            'Air conditioning' => self::AIR_CONDITIONING_REFERENCE,
            'Heating' => self::HEATING_REFERENCE,
            'Pool' => self::POOL_REFERENCE,
            'Dedicated workspace' => self::WORKSPACE_REFERENCE,
            'Smoke detector' => self::SMOKE_DETECTOR_REFERENCE,
            'First aid kit' => self::FIRST_AID_REFERENCE,
            'Fire extinguisher' => self::FIRE_EXTINGUISHER_REFERENCE,
            'Carbon monoxide detector' => self::CO_DETECTOR_REFERENCE,
        ];

        foreach (self::AMENITIES as $index => $amenityData) {
            $amenity = new Amenity();
            $amenity->setName($amenityData['name']);
            $amenity->setCategory($amenityData['category']);
            
            $manager->persist($amenity);

            // Only set reference if it's in the referenceMap
            if (isset($referenceMap[$amenityData['name']])) {
                $this->addReference($referenceMap[$amenityData['name']], $amenity);
            }
        }

        $manager->flush();
    }
}
