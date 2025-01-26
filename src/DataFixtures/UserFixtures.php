<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public const ADMIN_REFERENCE = 'user-admin';
    public const HOST1_REFERENCE = 'user-host-1';
    public const HOST2_REFERENCE = 'user-host-2';
    public const USER1_REFERENCE = 'user-regular-1';
    public const USER2_REFERENCE = 'user-regular-2';

    private const USERS = [
        self::ADMIN_REFERENCE => [
            'email' => 'admin@example.com',
            'roles' => ['ROLE_ADMIN'],
            'password' => 'admin123',
            'firstName' => 'Admin',
            'lastName' => 'User',
            'createdAt' => '2023-01-01',
        ],
        self::HOST1_REFERENCE => [
            'email' => 'host1@example.com',
            'roles' => ['ROLE_HOST'],
            'password' => 'host123',
            'firstName' => 'Jean',
            'lastName' => 'Dupont',
            'createdAt' => '2023-02-01',
        ],
        self::HOST2_REFERENCE => [
            'email' => 'host2@example.com',
            'roles' => ['ROLE_HOST'],
            'password' => 'host123',
            'firstName' => 'Marie',
            'lastName' => 'Laurent',
            'createdAt' => '2023-02-15',
        ],
        self::USER1_REFERENCE => [
            'email' => 'user1@example.com',
            'roles' => ['ROLE_USER'],
            'password' => 'user123',
            'firstName' => 'John',
            'lastName' => 'Doe',
            'createdAt' => '2023-03-01',
        ],
        self::USER2_REFERENCE => [
            'email' => 'user2@example.com',
            'roles' => ['ROLE_USER'],
            'password' => 'user123',
            'firstName' => 'Jane',
            'lastName' => 'Smith',
            'createdAt' => '2023-03-15',
        ],
    ];

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        foreach (self::USERS as $reference => $userData) {
            $user = new User();
            $user->setEmail($userData['email'])
                ->setRoles($userData['roles'])
                ->setFirstName($userData['firstName'])
                ->setLastName($userData['lastName'])
                ->setCreatedAt(new \DateTimeImmutable($userData['createdAt']));

            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $userData['password']
            );
            $user->setPassword($hashedPassword);

            $manager->persist($user);
            $this->addReference($reference, $user);
        }

        $manager->flush();
    }
}
