<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function getNewUsersTrend(): array
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

    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
