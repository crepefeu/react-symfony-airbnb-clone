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
    public const HOST3_REFERENCE = 'user-host-3';
    public const HOST4_REFERENCE = 'user-host-4';
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
            'profilePicture' => 'https://randomuser.me/api/portraits/men/1.jpg',
            'bio' => 'Platform administrator'
        ],
        self::HOST1_REFERENCE => [
            'email' => 'sophie.martin@example.com',
            'roles' => ['ROLE_HOST'],
            'password' => 'host123',
            'firstName' => 'Sophie',
            'lastName' => 'Martin',
            'createdAt' => '2023-02-01',
            'profilePicture' => 'https://randomuser.me/api/portraits/women/32.jpg',
            'bio' => 'Interior designer and passionate about Parisian architecture. I love sharing the beauty of my properties with travelers from around the world.'
        ],
        self::HOST2_REFERENCE => [
            'email' => 'pierre.dubois@example.com',
            'roles' => ['ROLE_HOST'],
            'password' => 'host123',
            'firstName' => 'Pierre',
            'lastName' => 'Dubois',
            'createdAt' => '2023-03-15',
            'profilePicture' => 'https://randomuser.me/api/portraits/men/45.jpg',
            'bio' => 'Retired architect with a passion for historic Parisian buildings.'
        ],
        self::HOST3_REFERENCE => [
            'email' => 'isabelle.roux@example.com',
            'roles' => ['ROLE_HOST'],
            'password' => 'host123',
            'firstName' => 'Isabelle',
            'lastName' => 'Roux',
            'createdAt' => '2023-04-01',
            'profilePicture' => 'https://randomuser.me/api/portraits/women/68.jpg',
            'bio' => 'Professional photographer and hospitality enthusiast.'
        ],
        self::HOST4_REFERENCE => [
            'email' => 'louis.bernard@example.com',
            'roles' => ['ROLE_HOST'],
            'password' => 'host123',
            'firstName' => 'Louis',
            'lastName' => 'Bernard',
            'createdAt' => '2023-05-01',
            'profilePicture' => 'https://randomuser.me/api/portraits/men/55.jpg',
            'bio' => 'Local guide and hospitality professional.'
        ],
        self::USER1_REFERENCE => [
            'email' => 'user1@example.com',
            'roles' => ['ROLE_USER'],
            'password' => 'user123',
            'firstName' => 'John',
            'lastName' => 'Doe',
            'createdAt' => '2023-03-01',
            'profilePicture' => 'https://randomuser.me/api/portraits/men/3.jpg'
        ],
        self::USER2_REFERENCE => [
            'email' => 'user2@example.com',
            'roles' => ['ROLE_USER'],
            'password' => 'user123',
            'firstName' => 'Jane',
            'lastName' => 'Smith',
            'createdAt' => '2023-03-15',
            'profilePicture' => 'https://randomuser.me/api/portraits/women/3.jpg'
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
                ->setProfilePicture($userData['profilePicture'])
                ->setBio($userData['bio'] ?? null)
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
