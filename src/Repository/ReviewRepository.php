<?php

namespace App\Repository;

use App\Entity\Review;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Review>
 */
class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    public function findOneByPropertyAndAuthor(int $propertyId, int $authorId): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.property = :propertyId')
            ->andWhere('r.author = :authorId')
            ->setParameter('propertyId', $propertyId)
            ->setParameter('authorId', $authorId)
            ->getQuery()
            ->getResult();
    }

    public function getNewReviewsTrend(): array
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
            'trend' => round($trend, 2)
        ];
    }

    public function getAverageRating(): ?float
    {
        return $this->createQueryBuilder('r')
            ->select('AVG(r.rating) as avgRating')
            ->getQuery()
            ->getSingleScalarResult();
    }


    //    /**
    //     * @return Review[] Returns an array of Review objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Review
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
