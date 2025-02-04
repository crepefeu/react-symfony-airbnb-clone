<?php

namespace App\Tests\Controller;

use App\Controller\BookingController;
use App\Entity\Address;
use App\Entity\Booking;
use App\Entity\Property;
use App\Entity\User;
use App\Enum\BookingStatus;
use App\Repository\PropertyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class BookingControllerTest extends WebTestCase
{
    private BookingController $bookingController;
    private Security $security;
    private PropertyRepository $propertyRepository;
    private EntityManagerInterface $entityManager;
    private MailerInterface $mailer;
    private UrlGeneratorInterface $urlGenerator;
    private UserPasswordHasherInterface $passwordHasher;

    private Address $address;
    private User $user;
    private User $host;
    private Property $property;
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $container = static::getContainer();
        
        $this->security = $container->get(Security::class);
        $this->propertyRepository = $container->get(PropertyRepository::class);
        $this->entityManager = $container->get('doctrine')->getManager();
        $this->mailer = $container->get(MailerInterface::class);
        $this->urlGenerator = $container->get(UrlGeneratorInterface::class);
        $this->passwordHasher = $container->get(UserPasswordHasherInterface::class);

        $this->bookingController = static::getContainer()->get(BookingController::class);
    }

    public function testCreateBookingSuccessful(): void
    {
        $user = new User();
        $host = new User();
        $address = new Address();
        $property = new Property();

        $this->setEntities(1, $user, $host, $address, $property);

        $requestData = [
            'checkInDate' => '2024-03-01',
            'checkOutDate' => '2024-03-05',
            'numberOfGuests' => 2,
            'totalPrice' => 500,
            'propertyId' => $property->getId()
        ];

        $this->client->loginUser($user);

        $request = new Request([], [], [], [], [], [], json_encode($requestData));

        $response = $this->bookingController->createBooking(
            $request,
            $this->security,
            $this->propertyRepository,
            $this->entityManager,
            $this->mailer
        );

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
        $this->assertEquals(
            ['message' => 'Booking created successfully'],
            json_decode($response->getContent(), true)
        );
    }

    public function testCreateBookingUnauthorized(): void
    {
        $request = new Request();

        $response = $this->bookingController->createBooking(
            $request,
            $this->security,
            $this->propertyRepository,
            $this->entityManager,
            $this->mailer
        );

        $this->assertEquals(Response::HTTP_UNAUTHORIZED, $response->getStatusCode());
        $this->assertEquals(
            ['error' => 'Unauthorized'],
            json_decode($response->getContent(), true)
        );
    }

    public function testConfirmBookingWithAuthentication(): void
    {
        $user = new User();
        $host = new User();
        $address = new Address();
        $property = new Property();
        $booking = new Booking();
        $this->setEntities(4, $user, $host, $address, $property, $booking);        

        $this->client->loginUser($host);

        $this->client->request(
            'POST',
            '/api/bookings/confirm',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['bookingId' => $booking->getId()])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertEquals(BookingStatus::VALIDATED, $booking->getStatus());
    }

    public function testConfirmBookingWithoutAuthentication(): void
    {
        $user = new User();
        $host = new User();
        $address = new Address();
        $property = new Property();
        $booking = new Booking();
        $this->setEntities(5, $user, $host, $address, $property, $booking);        

        $this->client->request(
            'POST',
            '/api/bookings/confirm',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['bookingId' => $booking->getId()])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        
        self::ensureKernelShutdown();
        
        if ($this->entityManager) {
            $this->entityManager->close();
        }
    }

    private function setEntities(int $number, User $user, User $host, Address $address, Property $property, ?Booking $booking = null): void
    {
        $user->setEmail('user'.$number.'@example.com')
            ->setFirstName('John')
            ->setLastName('Doe')
            ->setPassword($this->passwordHasher->hashPassword($user, "password"))
            ->setRoles(['ROLE_USER'])
            ->setCreatedAt(new \DateTimeImmutable());

        $host->setEmail('owner'.$number.'@example.com')
            ->setFirstName('Property')
            ->setLastName('Owner')
            ->setPassword($this->passwordHasher->hashPassword($host, "password"))
            ->setRoles(['ROLE_HOST'])
            ->setCreatedAt(new \DateTimeImmutable());  
        
        $address->setStreetNumber('123')
            ->setStreetName('Main Street')
            ->setCity('Paris')
            ->setState('Île-de-France')
            ->setZipcode('75001')
            ->setCoordinates(48.8566, 2.3522)
            ->setCountry('France');

        $property->setTitle('Test Property '.$number)
            ->setOwner($host)
            ->setAddress($address)
            ->setDescription('A beautiful test property with modern amenities')
            ->setPrice(150.00)
            ->setMaxGuests(4)
            ->setBedrooms(2)
            ->setBathrooms(1)
            ->setLatitude(48.8566)
            ->setLongitude(2.3522)
            ->setCreatedAt(new \DateTimeImmutable())
            ->setUpdatedAt(new \DateTimeImmutable());

        if ($booking !== null) {
            $booking->setProperty($property)
            ->setGuest($user)
            ->setCheckInDate(new \DateTime('+1 day'))
            ->setCheckOutDate(new \DateTime('+3 days'))
            ->setNumberOfGuests(2)
            ->setTotalPrice(200.00)
            ->setCreatedAt(new \DateTimeImmutable())
            ->setStatus(BookingStatus::PENDING);

            $this->entityManager->persist($booking);
        }

        $this->entityManager->persist($user);
        $this->entityManager->persist($host);
        $this->entityManager->persist($property);
        $this->entityManager->flush();
    }
}