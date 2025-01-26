<?php

namespace App\DataFixtures;

use App\Entity\Property;
use App\Entity\Address;
use App\Entity\Amenity;
use App\Enum\AmenityCategory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PropertyFixtures extends Fixture
{
    private const PROPERTY_TYPES = ['Apartment', 'House', 'Studio', 'Loft', 'Villa'];

    private const PARIS_PROPERTIES = [
        [
            'title' => 'Charming Montmartre Apartment',
            'location' => ['lat' => 48.886705, 'lng' => 2.334184],
            'price' => 150,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'maxGuests' => 4,
            'address' => [
                'streetNumber' => '12',
                'streetName' => 'Rue Lepic',
                'complement' => 'Floor 3',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75018'
            ],
            'description' => 'Beautiful apartment near Sacré-Cœur',
            'propertyType' => 'Apartment',
        ],
        [
            'title' => 'Luxury Marais Loft',
            'location' => ['lat' => 48.859405, 'lng' => 2.362233],
            'price' => 280,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'maxGuests' => 6,
            'address' => [
                'streetNumber' => '25',
                'streetName' => 'Rue des Archives',
                'complement' => '',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75004'
            ],
            'description' => 'Spacious loft in the heart of Le Marais',
            'propertyType' => 'Loft',
        ],
        [
            'title' => 'Eiffel Tower View Studio',
            'location' => ['lat' => 48.857908, 'lng' => 2.294082],
            'price' => 200,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'maxGuests' => 2,
            'address' => [
                'streetNumber' => '8',
                'streetName' => 'Avenue de la Bourdonnais',
                'complement' => '',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75007'
            ],
            'description' => 'Cozy studio with direct Eiffel Tower views',
            'propertyType' => 'Studio',
        ],
        [
            'title' => 'Latin Quarter Charm',
            'location' => ['lat' => 48.848674, 'lng' => 2.344997],
            'price' => 175,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'maxGuests' => 3,
            'address' => [
                'streetNumber' => '15',
                'streetName' => 'Rue Mouffetard',
                'complement' => '',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75005'
            ],
            'description' => 'Traditional apartment in historic district',
            'propertyType' => 'Apartment',
        ],
        [
            'title' => 'Canal Saint-Martin Hideaway',
            'location' => ['lat' => 48.872328, 'lng' => 2.366447],
            'price' => 160,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'maxGuests' => 2,
            'address' => [
                'streetNumber' => '95',
                'streetName' => 'Quai de Valmy',
                'complement' => '',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75010'
            ],
            'description' => 'Modern flat overlooking the canal',
            'propertyType' => 'Apartment',
        ],
        [
            'title' => 'Opéra District Penthouse',
            'location' => ['lat' => 48.871799, 'lng' => 2.332069],
            'price' => 320,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'maxGuests' => 6,
            'address' => [
                'streetNumber' => '32',
                'streetName' => 'Rue de la Chaussée d\'Antin',
                'complement' => 'Top Floor',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75009'
            ],
            'description' => 'Luxurious penthouse with panoramic views of Paris Opera',
            'propertyType' => 'Penthouse',
        ],
        [
            'title' => 'Champs-Élysées Luxury Suite',
            'location' => ['lat' => 48.869547, 'lng' => 2.308562],
            'price' => 450,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'maxGuests' => 4,
            'address' => [
                'streetNumber' => '88',
                'streetName' => 'Avenue des Champs-Élysées',
                'complement' => 'Building A',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75008'
            ],
            'description' => 'High-end apartment on the most beautiful avenue in the world',
            'propertyType' => 'Apartment',
        ],
        [
            'title' => 'Bastille Artist Studio',
            'location' => ['lat' => 48.853675, 'lng' => 2.369186],
            'price' => 140,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'maxGuests' => 2,
            'address' => [
                'streetNumber' => '15',
                'streetName' => 'Rue de la Roquette',
                'complement' => 'Studio 3B',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75011'
            ],
            'description' => 'Bohemian studio in the trendy Bastille neighborhood',
            'propertyType' => 'Studio',
        ],
        [
            'title' => 'Luxembourg Gardens Retreat',
            'location' => ['lat' => 48.846937, 'lng' => 2.336164],
            'price' => 260,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'maxGuests' => 4,
            'address' => [
                'streetNumber' => '41',
                'streetName' => 'Rue Notre Dame des Champs',
                'complement' => '4th Floor',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75006'
            ],
            'description' => 'Elegant apartment near the famous Luxembourg Gardens',
            'propertyType' => 'Apartment',
        ],
        [
            'title' => 'Belleville Modern Loft',
            'location' => ['lat' => 48.872424, 'lng' => 2.377131],
            'price' => 180,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'maxGuests' => 3,
            'address' => [
                'streetNumber' => '56',
                'streetName' => 'Rue de Belleville',
                'complement' => 'Loft 5',
                'city' => 'Paris',
                'state' => 'Île-de-France',
                'country' => 'France',
                'zipcode' => '75020'
            ],
            'description' => 'Contemporary loft in vibrant multicultural neighborhood',
            'propertyType' => 'Loft',
        ]
    ];

    private const PROPERTY_AMENITIES = [
        'Apartment' => [
            ['name' => 'High-speed WiFi', 'category' => AmenityCategory::WIFI],
            ['name' => 'Central heating', 'category' => AmenityCategory::HEATING],
            ['name' => 'Air conditioning', 'category' => AmenityCategory::COOLING],
            ['name' => 'Fully equipped kitchen', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Washing machine', 'category' => AmenityCategory::LAUNDRY],
            ['name' => 'Modern bathroom', 'category' => AmenityCategory::BATHROOM],
            ['name' => 'Smoke detector', 'category' => AmenityCategory::SAFETY],
            ['name' => 'Smart TV', 'category' => AmenityCategory::ENTERTAINMENT],
            ['name' => 'Coffee maker', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Dishwasher', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Iron & Board', 'category' => AmenityCategory::LAUNDRY],
            ['name' => 'Hair dryer', 'category' => AmenityCategory::BATHROOM],
            ['name' => 'Elevator', 'category' => AmenityCategory::ACCESSIBILITY],
        ],
        'Loft' => [
            ['name' => 'Gigabit WiFi', 'category' => AmenityCategory::WIFI],
            ['name' => '65" Smart TV', 'category' => AmenityCategory::ENTERTAINMENT],
            ['name' => 'Chef\'s kitchen', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Rain shower', 'category' => AmenityCategory::BATHROOM],
            ['name' => 'Security system', 'category' => AmenityCategory::SAFETY],
            ['name' => 'Dedicated workspace', 'category' => AmenityCategory::WORKSPACE],
            ['name' => 'Climate control', 'category' => AmenityCategory::COOLING],
            ['name' => 'Washer & Dryer', 'category' => AmenityCategory::LAUNDRY],
            ['name' => 'Wine fridge', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Surround sound system', 'category' => AmenityCategory::ENTERTAINMENT],
            ['name' => 'High ceilings', 'category' => AmenityCategory::FEATURES],
            ['name' => 'Floor-to-ceiling windows', 'category' => AmenityCategory::FEATURES],
            ['name' => 'Smart home features', 'category' => AmenityCategory::FEATURES],
            ['name' => 'Balcony', 'category' => AmenityCategory::OUTDOOR],
        ],
        'Studio' => [
            ['name' => 'Fast WiFi', 'category' => AmenityCategory::WIFI],
            ['name' => 'Kitchenette', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Smart TV', 'category' => AmenityCategory::ENTERTAINMENT],
            ['name' => 'Compact washer', 'category' => AmenityCategory::LAUNDRY],
            ['name' => 'Air conditioning unit', 'category' => AmenityCategory::COOLING],
            ['name' => 'Working corner', 'category' => AmenityCategory::WORKSPACE],
            ['name' => 'Microwave', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Mini fridge', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Storage solutions', 'category' => AmenityCategory::FEATURES],
            ['name' => 'Blackout curtains', 'category' => AmenityCategory::FEATURES],
        ],
        'Penthouse' => [
            ['name' => 'Enterprise WiFi', 'category' => AmenityCategory::WIFI],
            ['name' => 'Private terrace', 'category' => AmenityCategory::OUTDOOR],
            ['name' => 'Gourmet kitchen', 'category' => AmenityCategory::KITCHEN],
            ['name' => 'Home cinema', 'category' => AmenityCategory::ENTERTAINMENT],
            ['name' => '24/7 Security', 'category' => AmenityCategory::SAFETY],
            ['name' => 'Luxury bathroom', 'category' => AmenityCategory::BATHROOM],
            ['name' => 'Climate control', 'category' => AmenityCategory::COOLING],
            ['name' => 'Floor heating', 'category' => AmenityCategory::HEATING],
            ['name' => 'Private parking', 'category' => AmenityCategory::PARKING],
            ['name' => 'Office room', 'category' => AmenityCategory::WORKSPACE],
            ['name' => 'Laundry room', 'category' => AmenityCategory::LAUNDRY],
            ['name' => 'Wheelchair access', 'category' => AmenityCategory::ACCESSIBILITY],
            ['name' => 'Wine cellar', 'category' => AmenityCategory::FEATURES],
            ['name' => 'Jacuzzi', 'category' => AmenityCategory::BATHROOM],
            ['name' => 'Smart home system', 'category' => AmenityCategory::FEATURES],
            ['name' => 'Private elevator', 'category' => AmenityCategory::ACCESSIBILITY],
            ['name' => 'Panoramic views', 'category' => AmenityCategory::FEATURES],
            ['name' => 'BBQ area', 'category' => AmenityCategory::OUTDOOR],
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::PARIS_PROPERTIES as $propertyData) {
            $property = new Property();
            $property->setTitle($propertyData['title']);
            $property->setDescription($propertyData['description']);
            $property->setPrice($propertyData['price']);
            $property->setBedrooms($propertyData['bedrooms']);
            $property->setBathrooms($propertyData['bathrooms']);
            $property->setMaxGuests($propertyData['maxGuests']);
            $property->setLatitude($propertyData['location']['lat']);
            $property->setLongitude($propertyData['location']['lng']);
            $property->setPropertyType($propertyData['propertyType']);

            // Create PostGIS point object for property location
            $point = sprintf('POINT(%f %f)', 
                $propertyData['location']['lng'],
                $propertyData['location']['lat']
            );
            $property->setLocation($point);

            $address = new Address();
            $address->setStreetNumber($propertyData['address']['streetNumber']);
            $address->setStreetName($propertyData['address']['streetName']);
            $address->setCity($propertyData['address']['city']);
            $address->setState($propertyData['address']['state']);
            $address->setCountry($propertyData['address']['country']);
            $address->setZipcode($propertyData['address']['zipcode']);
            
            // Set coordinates for both Property and Address
            $address->setCoordinates(
                $propertyData['location']['lat'],
                $propertyData['location']['lng']
            );

            $property->setAddress($address);
            
            // Add amenities based on property type with fallback to Apartment amenities
            $amenitiesList = self::PROPERTY_AMENITIES[$propertyData['propertyType']] ?? self::PROPERTY_AMENITIES['Apartment'];
            foreach ($amenitiesList as $amenityData) {
                $amenity = new Amenity();
                $amenity->setName($amenityData['name']);
                $amenity->setCategory($amenityData['category']);
                $amenity->setProperty($property);
                $manager->persist($amenity);
                $property->addAmenity($amenity);
            }

            $manager->persist($address);
            $manager->persist($property);
        }

        $manager->flush();
    }
}
