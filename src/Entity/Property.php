<?php

namespace App\Entity;

use App\Repository\PropertyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\Column]
    private ?int $maxGuests = null;

    #[ORM\Column]
    private ?int $bedrooms = null;

    #[ORM\Column]
    private ?int $bathrooms = null;

    #[ORM\Column(type: 'geometry')]
    private $location = null;

    #[ORM\OneToOne(inversedBy: 'property', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Address $address = null;

    #[Groups(['property:read'])]
    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['property:read'])]
    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    #[Groups(['property:read'])]
    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getMaxGuests(): ?int
    {
        return $this->maxGuests;
    }

    public function setMaxGuests(int $maxGuests): static
    {
        $this->maxGuests = $maxGuests;

        return $this;
    }

    #[Groups(['property:read'])]
    public function getBedrooms(): ?int
    {
        return $this->bedrooms;
    }

    public function setBedrooms(int $bedrooms): static
    {
        $this->bedrooms = $bedrooms;

        return $this;
    }

    #[Groups(['property:read'])]
    public function getBathrooms(): ?int
    {
        return $this->bathrooms;
    }

    public function setBathrooms(int $bathrooms): static
    {
        $this->bathrooms = $bathrooms;

        return $this;
    }

    public function getLocation()
    {
        return $this->location;
    }

    public function setLocation($location): static
    {
        $this->location = $location;

        return $this;
    }

    public function setCoordinates(float $latitude, float $longitude): static
    {
        $this->location = sprintf('POINT(%f %f)', $longitude, $latitude);
        return $this;
    }

    #[Groups(['property:read'])]
    public function getLatitude(): ?float
    {
        if (!$this->location) {
            return null;
        }
        $point = \substr($this->location, 6, -1);
        return (float) \explode(' ', $point)[1];
    }

    #[Groups(['property:read'])]
    public function getLongitude(): ?float
    {
        if (!$this->location) {
            return null;
        }
        $point = \substr($this->location, 6, -1);
        return (float) \explode(' ', $point)[0];
    }

    #[Groups(['property:read'])]
    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(Address $address): static
    {
        $this->address = $address;

        return $this;
    }
}
