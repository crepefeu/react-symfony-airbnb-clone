<?php

namespace App\Repository;

use App\Entity\Property;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Property>
 */
class PropertyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Property::class);
    }

    public function findNearby(float $latitude, float $longitude, float $radiusInKm): array
    {
        $point = sprintf('POINT(%f %f)', $longitude, $latitude);
        
        return $this->createQueryBuilder('p')
            ->select('p')
            ->addSelect('ST_Distance(p.location, ST_GeomFromText(:point, 4326)) as HIDDEN distance')
            ->where('ST_DWithin(p.location, ST_GeomFromText(:point, 4326), :radius)')
            ->setParameter('point', $point)
            ->setParameter('radius', $radiusInKm * 1000) // Convert km to meters
            ->orderBy('distance', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findWithinBounds(float $minLat, float $maxLat, float $minLng, float $maxLng): array
    {
        $polygon = sprintf(
            'POLYGON((%f %f, %f %f, %f %f, %f %f, %f %f))',
            $minLng, $minLat, // Bottom left
            $maxLng, $minLat, // Bottom right
            $maxLng, $maxLat, // Top right
            $minLng, $maxLat, // Top left
            $minLng, $minLat  // Back to start
        );

        return $this->createQueryBuilder('p')
            ->where('ST_Within(p.address.location, ST_GeomFromText(:polygon, 4326)) = true')
            ->setParameter('polygon', $polygon)
            ->getQuery()
            ->getResult();
    }

    public function findByDistance(float $latitude, float $longitude, float $maxDistance): array
    {
        $point = sprintf('POINT(%f %f)', $longitude, $latitude);
        
        return $this->createQueryBuilder('p')
            ->select('p')
            ->addSelect('ST_Distance(p.address.location, ST_GeomFromText(:point, 4326)) as HIDDEN distance')
            ->having('distance <= :maxDistance')
            ->setParameter('point', $point)
            ->setParameter('maxDistance', $maxDistance)
            ->orderBy('distance', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findInBounds(float $north, float $south, float $east, float $west, ?int $bedrooms = null): array
    {
        $qb = $this->createQueryBuilder('p')
            ->where('p.latitude <= :north')
            ->andWhere('p.latitude >= :south')
            ->andWhere('p.longitude <= :east')
            ->andWhere('p.longitude >= :west')
            ->setParameter('north', $north)
            ->setParameter('south', $south)
            ->setParameter('east', $east)
            ->setParameter('west', $west);

        if ($bedrooms !== null) {
            $qb->andWhere('p.bedrooms = :bedrooms')
               ->setParameter('bedrooms', $bedrooms);
        }

        return $qb->getQuery()->getResult();
    }

    public function searchProperties(string $location, int $guests, ?array $coordinates = null): array
    {
        $qb = $this->createQueryBuilder('p')
            ->where('p.maxGuests >= :guests')
            ->setParameter('guests', $guests);

        if ($coordinates) {
            $radius = 0.5;
            $qb->andWhere('p.latitude BETWEEN :minLat AND :maxLat')
               ->andWhere('p.longitude BETWEEN :minLng AND :maxLng')
               ->setParameter('minLat', $coordinates['lat'] - $radius)
               ->setParameter('maxLat', $coordinates['lat'] + $radius)
               ->setParameter('minLng', $coordinates['lng'] - $radius)
               ->setParameter('maxLng', $coordinates['lng'] + $radius);
        } else {
            $qb->leftJoin('p.address', 'a')
                ->andWhere('a.city LIKE :location OR a.country LIKE :location')
                ->setParameter('location', '%' . $location . '%');
        }

        return $qb->getQuery()->getResult();
    }

//    /**
//     * @return Property[] Returns an array of Property objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Property
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
