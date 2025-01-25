<?php

namespace App\Entity;

use App\Repository\AddressRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
class Address
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $streetNumber = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $streetName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $state = null;

    #[ORM\Column(length: 20)]
    #[Groups(['property:read'])]
    private ?string $zipcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $country = null;

    #[ORM\Column(type: 'geometry', nullable: false)]
    private $location;

    #[ORM\OneToOne(mappedBy: 'address', cascade: ['persist', 'remove'])]
    private ?Property $property = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStreetNumber(): ?string
    {
        return $this->streetNumber;
    }

    public function setStreetNumber(string $streetNumber): static
    {
        $this->streetNumber = $streetNumber;

        return $this;
    }

    public function getStreetName(): ?string
    {
        return $this->streetName;
    }

    public function setStreetName(string $streetName): static
    {
        $this->streetName = $streetName;

        return $this;
    }

    #[Groups(['address:read'])]
    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): static
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    #[Groups(['address:read'])]
    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function setCoordinates(float $latitude, float $longitude): static
    {
        $this->location = sprintf('POINT(%f %f)', $longitude, $latitude);
        return $this;
    }

    public function getLatitude(): ?float
    {
        if (!$this->location) {
            return null;
        }
        $point = \substr($this->location, 6, -1);
        return (float) \explode(' ', $point)[1];
    }

    public function getLongitude(): ?float
    {
        if (!$this->location) {
            return null;
        }
        $point = \substr($this->location, 6, -1);
        return (float) \explode(' ', $point)[0];
    }

    public function getProperty(): ?Property
    {
        return $this->property;
    }

    public function setProperty(Property $property): static
    {
        // set the owning side of the relation if necessary
        if ($property->getAddress() !== $this) {
            $property->setAddress($this);
        }

        $this->property = $property;

        return $this;
    }
}
