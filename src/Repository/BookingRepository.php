<?php

namespace App\Repository;

use App\Entity\Booking;
use App\Entity\Property;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    public function findBookingsByOwner(int $ownerId): array
    {
        return $this->createQueryBuilder('b')
            ->join('b.Property', 'p')
            ->join('p.owner', 'o')
            ->where('o.id = :ownerId')
            ->setParameter('ownerId', $ownerId)
            ->getQuery()
            ->getResult();
    }

    public function findBookingsBetweenDates(\DateTime $start, \DateTime $end)
    {
        return $this->createQueryBuilder('b')
            ->where('b.checkInDate BETWEEN :start AND :end')
            ->andWhere('b.Status != :canceled')
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->setParameter('canceled', 'canceled')
            ->getQuery()
            ->getResult();
    }

    public function findPendingBookings()
    {
        return $this->createQueryBuilder('b')
            ->where('b.Status = :status')
            ->setParameter('status', 'pending')
            ->getQuery()
            ->getResult();
    }

    public function getExistingBookingsForGivenDates(Property $property, \DateTime $checkIn, \DateTime $checkOut) {
        return $this->createQueryBuilder('b')
        ->where('b.Property = :property')
        ->andWhere('b.Status != :canceled')
        ->andWhere(
            '(b.checkInDate BETWEEN :checkIn AND :checkOut) OR
            (b.checkOutDate BETWEEN :checkIn AND :checkOut) OR
            (:checkIn BETWEEN b.checkInDate AND b.checkOutDate)'
        )
        ->setParameter('property', $property)
        ->setParameter('canceled', 'canceled')
        ->setParameter('checkIn', $checkIn)
        ->setParameter('checkOut', $checkOut)
        ->getQuery()
        ->getResult();
    }

    public function getNewBookingsTrend(): array
    {
        $now = new \DateTime();
        $thirtyDaysAgo = (new \DateTime())->modify('-30 days');
        $sixtyDaysAgo = (new \DateTime())->modify('-60 days');

        $currentPeriodCount = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.createdAt BETWEEN :start AND :end')
            ->setParameter('start', $thirtyDaysAgo)
            ->setParameter('end', $now)
            ->getQuery()
            ->getSingleScalarResult();

        $previousPeriodCount = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.createdAt BETWEEN :start AND :end')
            ->setParameter('start', $sixtyDaysAgo)
            ->setParameter('end', $thirtyDaysAgo)
            ->getQuery()
            ->getSingleScalarResult();

        $trend = 0;
        if ($previousPeriodCount > 0) {
            $trend = (($currentPeriodCount - $previousPeriodCount) / $previousPeriodCount) * 100;
        } elseif ($currentPeriodCount > 0) {
            $trend = 100; 
        }

        return [
            'current' => $currentPeriodCount,
            'previous' => $previousPeriodCount,
            'trend' => $trend
        ];
    }

    //    /**
    //     * @return Booking[] Returns an array of Booking objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('b.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Booking
    //    {
    //        return $this->createQueryBuilder('b')
    //            ->andWhere('b.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
