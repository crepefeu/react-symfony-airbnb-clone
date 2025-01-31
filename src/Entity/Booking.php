<?php

namespace App\Entity;

use App\Enum\BookingStatus;
use App\Repository\BookingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookingRepository::class)]
class Booking
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['booking:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['booking:read'])]
    private ?\DateTimeInterface $checkInDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['booking:read'])]
    private ?\DateTimeInterface $checkOutDate = null;

    #[ORM\Column]
    #[Groups(['booking:read'])]
    private ?int $numberOfGuests = null;

    #[ORM\Column]
    #[Groups(['booking:read'])]
    private ?int $totalPrice = null;

    #[ORM\Column]
    #[Groups(['booking:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['booking:read'])]
    private ?Property $Property = null;

    #[ORM\ManyToOne(inversedBy: 'bookings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $Guest = null;

    #[ORM\Column(enumType: BookingStatus::class)]
    #[Groups(['booking:read'])]
    private ?BookingStatus $Status = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCheckInDate(): ?\DateTimeInterface
    {
        return $this->checkInDate;
    }

    public function setCheckInDate(\DateTimeInterface $checkInDate): static
    {
        $this->checkInDate = $checkInDate;

        return $this;
    }

    public function getCheckOutDate(): ?\DateTimeInterface
    {
        return $this->checkOutDate;
    }

    public function setCheckOutDate(\DateTimeInterface $checkOutDate): static
    {
        $this->checkOutDate = $checkOutDate;

        return $this;
    }

    public function getNumberOfGuests(): ?int
    {
        return $this->numberOfGuests;
    }

    public function setNumberOfGuests(int $numberOfGuests): static
    {
        $this->numberOfGuests = $numberOfGuests;

        return $this;
    }

    public function getTotalPrice(): ?int
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(int $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    #[Groups(['booking:read'])]
    public function getProperty(): ?Property
    {
        return $this->Property;
    }

    public function setProperty(?Property $Property): static
    {
        $this->Property = $Property;

        return $this;
    }

    public function getGuest(): ?User
    {
        return $this->Guest;
    }

    public function setGuest(?User $Guest): static
    {
        $this->Guest = $Guest;

        return $this;
    }

    public function getStatus(): ?BookingStatus
    {
        return $this->Status;
    }

    public function setStatus(BookingStatus $Status): static
    {
        $this->Status = $Status;

        return $this;
    }
}
