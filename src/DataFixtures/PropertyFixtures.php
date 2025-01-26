<?php

namespace App\DataFixtures;

use App\Entity\Property;
use App\Entity\Address;
use App\Entity\Amenity;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class PropertyFixtures extends Fixture implements DependentFixtureInterface
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

    public function load(ObjectManager $manager): void
    {
        // Get host users from UserFixtures
        $host1 = $this->getReference(UserFixtures::HOST1_REFERENCE, User::class);
        $host2 = $this->getReference(UserFixtures::HOST2_REFERENCE, User::class);

        foreach (self::PARIS_PROPERTIES as $index => $propertyData) {
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
            
            // Set the owner (alternate between hosts)
            $property->setOwner($index % 2 === 0 ? $host1 : $host2);

            // Create new amenities for each property based on templates
            $numAmenities = rand(5, 10);
            $amenityIndices = (array)array_rand(range(0, 17), $numAmenities);
            
            foreach ($amenityIndices as $amenityIndex) {
                $amenityTemplate = $this->getReference('amenity_template_' . $amenityIndex, Amenity::class);
                $amenity = new Amenity();
                $amenity->setName($amenityTemplate->getName());
                $amenity->setCategory($amenityTemplate->getCategory());
                $amenity->setProperty($property);
                $manager->persist($amenity);
                $property->addAmenity($amenity);
            }

            // Add reference for the property
            $this->addReference('property_' . $index, $property);
            $manager->persist($address);
            $manager->persist($property);
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
