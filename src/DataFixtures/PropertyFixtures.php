<?php

namespace App\DataFixtures;

use App\Entity\Property;
use App\Entity\Address;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PropertyFixtures extends Fixture
{
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
            'description' => 'Beautiful apartment near Sacré-Cœur'
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
            'description' => 'Spacious loft in the heart of Le Marais'
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
            'description' => 'Cozy studio with direct Eiffel Tower views'
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
            'description' => 'Traditional apartment in historic district'
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
            'description' => 'Modern flat overlooking the canal'
        ]
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
            
            $manager->persist($address);
            $manager->persist($property);
        }

        $manager->flush();
    }
}
