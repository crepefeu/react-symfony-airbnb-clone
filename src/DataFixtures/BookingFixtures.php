<?php
namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Booking;
use App\Entity\User;
use App\Entity\Property;
use App\Enum\BookingStatus;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;
use DateTime;

class BookingFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            PropertyFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        
        $users = $manager->getRepository(User::class)->findAll();
        $properties = $manager->getRepository(Property::class)->findAll();
                        
        for ($i = 0; $i < 40; $i++) {
            $booking = new Booking();
            $property = $faker->randomElement($properties);
            $checkInDate = $faker->dateTimeBetween('-1 year', '+1 year');
            $checkOutDate = (clone $checkInDate)->modify('+'. $faker->numberBetween(2, 15) . 'days');
            $statuses = $this->determinePossibleStatuses($checkInDate, $checkOutDate);
            $numberOfDays = $checkInDate->diff($checkOutDate)->days;
            $totalPrice = $numberOfDays * $property->getPrice();
            $createdAt = (clone $checkInDate)->modify('-' . $faker->numberBetween(5, 90) . ' days');

            $booking->setGuest($faker->randomElement($users));
            $booking->setProperty($property);
            $booking->setCheckInDate($checkInDate);
            $booking->setCheckOutDate($checkOutDate);
            $booking->setStatus($faker->randomElement($statuses));
            $booking->setCreatedAt(\DateTimeImmutable::createFromMutable($createdAt));
            $booking->setTotalPrice($totalPrice);
            $booking->setNumberOfGuests($faker->numberBetween(1, $property->getMaxGuests()));
            
            $manager->persist($booking);
        }
        
        $manager->flush();
    }

    private function determinePossibleStatuses(DateTime $checkInDate, DateTime $checkOutDate): array
    {
        $currentDate = new DateTime();
        if ($checkInDate < $currentDate && $checkOutDate <= $currentDate) {
            return [
                BookingStatus::FINISHED,
                BookingStatus::MISSED,
            ];
        }
        
        if ($checkInDate <= $currentDate && $checkOutDate >= $currentDate) {
            return [
                BookingStatus::ONGOING,
                BookingStatus::MISSED,
            ];
        }
        
        return [
            BookingStatus::PENDING,
            BookingStatus::VALIDATED,
            BookingStatus::CANCELED
        ];
    }
}
