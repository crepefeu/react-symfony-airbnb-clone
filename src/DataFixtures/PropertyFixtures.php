<?php

namespace App\DataFixtures;

use App\Entity\Property;
use App\Entity\Address;
use App\Entity\Amenity;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\DataFixtures\AmenityFixtures;
use App\Entity\PropertyMedia;
use App\Enum\MediaType;

class PropertyFixtures extends Fixture implements DependentFixtureInterface
{
    private const PROPERTY_TYPES = ['Apartment', 'House', 'Studio', 'Loft', 'Villa'];

    private const CITIES = [
        'Paris' => [
            'center' => ['lat' => 48.8566, 'lng' => 2.3522],
            'radius' => 5,
            'neighborhoods' => [
                ['Montmartre', 48.886705, 2.334184],
                ['Le Marais', 48.859405, 2.362233],
                ['Latin Quarter', 48.848674, 2.344997]
            ]
        ],
        'London' => [
            'center' => ['lat' => 51.5074, 'lng' => -0.1278],
            'radius' => 8,
            'neighborhoods' => [
                ['Shoreditch', 51.5229, -0.0777],
                ['Notting Hill', 51.5115, -0.1960],
                ['Greenwich', 51.4834, -0.0098]
            ]
        ],
        'New York' => [
            'center' => ['lat' => 40.7128, 'lng' => -74.0060],
            'radius' => 8,
            'neighborhoods' => [
                ['Manhattan', 40.7831, -73.9712],
                ['Brooklyn', 40.6782, -73.9442],
                ['Williamsburg', 40.7081, -73.9571]
            ]
        ],
        'Tokyo' => [
            'center' => ['lat' => 35.6762, 'lng' => 139.6503],
            'radius' => 10,
            'neighborhoods' => [
                ['Shibuya', 35.6588, 139.7015],
                ['Shinjuku', 35.6938, 139.7033],
                ['Roppongi', 35.6635, 139.7315]
            ]
        ],
        'Barcelona' => [
            'center' => ['lat' => 41.3851, 'lng' => 2.1734],
            'radius' => 5,
            'neighborhoods' => [
                ['Gothic Quarter', 41.3827, 2.1777],
                ['Eixample', 41.3927, 2.1638],
                ['Gracia', 41.4026, 2.1532]
            ]
        ]
    ];

    private const PROPERTY_DESCRIPTIONS = [
        '%s with stunning views in %s. %s featuring modern amenities and local charm.',
        'Luxurious %s in the heart of %s. %s perfect for your city adventure.',
        'Charming %s located in %s. %s offering an authentic local experience.',
        'Contemporary %s situated in vibrant %s. %s with easy access to attractions.'
    ];

    private const LOCAL_FEATURES = [
        'Paris' => [
            'Near charming cafes and boutiques',
            'Walking distance to museums',
            'Close to Seine River',
            'Near Metro stations'
        ],
        'London' => [
            'Close to Underground stations',
            'Near Royal Parks',
            'Walking distance to pubs',
            'Near historic landmarks'
        ],
        'New York' => [
            'Close to subway stations',
            'Near Central Park',
            'Walking distance to restaurants',
            'Easy access to attractions'
        ],
        'Tokyo' => [
            'Near train stations',
            'Close to shopping districts',
            'Walking distance to temples',
            'Near food markets'
        ],
        'Barcelona' => [
            'Near tapas bars',
            'Close to beaches',
            'Walking distance to markets',
            'Near Gothic architecture'
        ]
    ];

    private const ADJECTIVES = ['Lovely', 'Beautiful', 'Modern', 'Cozy', 'Stylish'];

    private const PROPERTY_IMAGES = [
        'Apartment' => [
            'Modern' => [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
            ],
            'Luxury' => [
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80'
            ]
        ],
        'House' => [
            'Modern' => [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'
            ],
            'Traditional' => [
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80'
            ]
        ],
        'Studio' => [
            'Urban' => [
                'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1630699144867-37acec97df5a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1626178793926-22b28830aa30?auto=format&fit=crop&w=800&q=80'
            ],
            'Cozy' => [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80'
            ]
        ],
        'Loft' => [
            'Industrial' => [
                'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
            ]
        ],
        'Villa' => [
            'Luxury' => [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687644-aaca8f1a8409?auto=format&fit=crop&w=800&q=80'
            ]
        ]
    ];

    private function generateRandomLocation(float $baseLat, float $baseLng, float $radiusKm): array
    {
        $radiusEarthKm = 6371;
        
        // Convert radius from kilometers to radians
        $radiusRadian = $radiusKm / $radiusEarthKm;
        
        // Random angle
        $u = rand(0, 1000000) / 1000000;
        $v = rand(0, 1000000) / 1000000;
        
        $w = $radiusRadian * sqrt($u);
        $t = 2 * pi() * $v;
        
        $x = $w * cos($t);
        $y = $w * sin($t);
        
        // Convert to latitude and longitude
        $newLng = $baseLng + ($x / cos(deg2rad($baseLat)));
        $newLat = $baseLat + $y;
        
        return [$newLat, $newLng];
    }

    private function generateStreetName(string $neighborhood): string
    {
        $streets = [
            'Paris' => ['Rue de', 'Avenue', 'Boulevard', 'Place'],
            'London' => ['Street', 'Road', 'Lane', 'Square'],
            'New York' => ['Street', 'Avenue', 'Boulevard', 'Place'],
            'Tokyo' => ['Dori', 'Street', 'Avenue'],
            'Barcelona' => ['Carrer de', 'Avinguda', 'Passeig de'],
        ];

        $numbers = range(1, 150);
        $number = $numbers[array_rand($numbers)];

        $city = explode(',', $neighborhood)[0];
        $prefixes = $streets[$city] ?? ['Street'];
        $prefix = $prefixes[array_rand($prefixes)];

        return $number . ' ' . $prefix . ' ' . $neighborhood;
    }

    private function addBasicAmenities(Property $property, ObjectManager $manager): void
    {
        // Add essential amenities
        $essentialReferences = [
            AmenityFixtures::WIFI_REFERENCE,
            AmenityFixtures::KITCHEN_REFERENCE,
        ];

        foreach ($essentialReferences as $reference) {
            $amenity = $this->getReference($reference, Amenity::class);
            $property->addAmenity($amenity);
        }

        // Add safety amenities
        $safetyAmenities = [
            'amenity_smoke_detector',
            'amenity_first_aid',
            'amenity_fire_extinguisher',
            'amenity_carbon_monoxide_detector'
        ];

        // Add random additional amenities
        $otherReferences = [
            AmenityFixtures::TV_REFERENCE,
            AmenityFixtures::WASHER_REFERENCE,
            AmenityFixtures::PARKING_REFERENCE,
            AmenityFixtures::AIR_CONDITIONING_REFERENCE,
            AmenityFixtures::HEATING_REFERENCE,
            AmenityFixtures::POOL_REFERENCE,
            AmenityFixtures::WORKSPACE_REFERENCE,
        ];

        // Add 2-4 random amenities
        shuffle($otherReferences);
        $selectedCount = rand(2, 4);
        $selectedAmenities = array_slice($otherReferences, 0, $selectedCount);

        foreach ($selectedAmenities as $reference) {
            if ($this->hasReference($reference, Amenity::class)) {
                $amenity = $this->getReference($reference, Amenity::class);
                $property->addAmenity($amenity);
            }
        }
    }

    public function load(ObjectManager $manager): void
    {
        $hosts = [
            $this->getReference(UserFixtures::HOST1_REFERENCE, User::class),
            $this->getReference(UserFixtures::HOST2_REFERENCE, User::class),
            $this->getReference(UserFixtures::HOST3_REFERENCE, User::class),
            $this->getReference(UserFixtures::HOST4_REFERENCE, User::class),
        ];

        $index = 0;
        foreach (self::CITIES as $cityName => $cityData) {
            // Create 4-6 properties per city
            $numProperties = rand(4, 6);
            
            for ($i = 0; $i < $numProperties; $i++) {
                $property = new Property();
                
                // Select random neighborhood
                $neighborhood = $cityData['neighborhoods'][array_rand($cityData['neighborhoods'])];
                [$lat, $lng] = $this->generateRandomLocation($neighborhood[1], $neighborhood[2], 1);
                
                $propertyType = self::PROPERTY_TYPES[array_rand(self::PROPERTY_TYPES)];
                
                $property->setTitle(sprintf("%s %s in %s", 
                    self::ADJECTIVES[array_rand(self::ADJECTIVES)],  // Fix here
                    $propertyType,
                    $neighborhood[0]
                ));
                
                $property->setLatitude($lat);
                $property->setLongitude($lng);
                $property->setPropertyType($propertyType);
                $property->setPrice(rand(80, 500));
                $property->setBedrooms(rand(1, 4));
                $property->setBathrooms(rand(1, 3));
                $property->setMaxGuests(rand(2, 8));
                
                // Create description using city-specific features
                $description = sprintf(
                    self::PROPERTY_DESCRIPTIONS[array_rand(self::PROPERTY_DESCRIPTIONS)],
                    $propertyType,
                    $neighborhood[0],
                    self::LOCAL_FEATURES[$cityName][array_rand(self::LOCAL_FEATURES[$cityName])]
                );
                $property->setDescription($description);
                
                // Set address
                $address = new Address();
                $address->setCity($cityName);
                $address->setCountry($this->getCityCountry($cityName));
                $address->setStreetNumber((string)rand(1, 150));
                $address->setStreetName($this->generateStreetName($neighborhood[0]));
                $address->setZipcode(sprintf('%05d', rand(10000, 99999)));
                $address->setState('');  // Optional for most cities
                $address->setCoordinates($lat, $lng);

                // Important: Set the address before persisting the property
                $property->setAddress($address);

                // Select random style based on property type
                $propertyStyles = array_keys(self::PROPERTY_IMAGES[$propertyType]);
                $selectedStyle = $propertyStyles[array_rand($propertyStyles)];
                $imagePool = self::PROPERTY_IMAGES[$propertyType][$selectedStyle];
                
                // Ensure we have at least 5 images by repeating if necessary
                while (count($imagePool) < 5) {
                    $imagePool = array_merge($imagePool, $imagePool);
                }
                
                // Take first 5 images after shuffling
                shuffle($imagePool);
                $selectedImages = array_slice($imagePool, 0, 5);

                // Convert images array to PropertyMedia entities
                foreach ($selectedImages as $imageUrl) {
                    $propertyMedia = new PropertyMedia();
                    $propertyMedia->setUrl($imageUrl);
                    $propertyMedia->setType(MediaType::IMAGE);
                    $propertyMedia->setProperty($property);
                    $manager->persist($propertyMedia);
                }

                // Remove the old images array setting
                // $property->setImages($selectedImages); -- Remove this line

                // Make sure createdAt and updatedAt are set
                $property->setCreatedAt(new \DateTimeImmutable());
                $property->setUpdatedAt(new \DateTimeImmutable());

                // Add amenities using the new method
                $this->addBasicAmenities($property, $manager);

                $property->setOwner($hosts[array_rand($hosts)]);
                
                $this->addReference('property_' . $index, $property);
                $manager->persist($property);
                $manager->persist($address);
                
                $index++;
            }
        }

        $manager->flush();
    }

    private function getCityCountry(string $city): string
    {
        return match($city) {
            'Paris' => 'France',
            'London' => 'United Kingdom',
            'New York' => 'United States',
            'Tokyo' => 'Japan',
            'Barcelona' => 'Spain',
            default => 'Unknown'
        };
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            AmenityFixtures::class,
        ];
    }
}
