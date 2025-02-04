<?php

namespace App\Entity;

use App\Repository\PropertyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['booking:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['booking:read', 'wishlist:read', 'property:read'])]  // Add wishlist:read group
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['property:read', 'property:details'])]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\Column]
    private ?int $maxGuests = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['property:read', 'property:details'])]
    private int $bedrooms;

    #[ORM\Column(type: 'integer')]
    #[Groups(['property:read', 'property:details'])]
    private int $bathrooms;

    #[ORM\Column(type: 'float')]
    #[Groups(['property:read'])]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['property:read'])]
    private ?float $longitude = null;

    #[ORM\Column(type: 'geometry', nullable: true)]
    private $location = null;

    #[ORM\ManyToOne(targetEntity: Address::class, cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:read', 'wishlist:read'])]  // Add wishlist:read group
    private ?Address $address = null;

    #[ORM\Column(length: 255, nullable: true)]  // Change this line to allow null temporarily
    #[Groups(['property:read'])]
    private ?string $propertyType = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]  // Add type here
    #[Groups(['property:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]  // Add type here
    #[Groups(['property:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, Amenity>
     */
    #[ORM\ManyToMany(targetEntity: Amenity::class, inversedBy: 'properties', cascade: ['persist'])]
    #[Groups(['property:read', 'property:details'])]
    private Collection $amenities;

    /**
     * @var Collection<int, Review>
     */
    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Review::class, orphanRemoval: true)]
    #[Groups(['property:read'])]
    private Collection $reviews;

    #[ORM\ManyToOne(inversedBy: 'properties')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:read', 'wishlist:read'])]  // Add wishlist:read group
    private ?User $owner = null;

    /**
     * @var Collection<int, PropertyMedia>
     */
    #[ORM\OneToMany(targetEntity: PropertyMedia::class, mappedBy: 'property', orphanRemoval: true)]
    #[Groups(['property:read'])]
    private Collection $propertyMedias;

    /**
     * @var Collection<int, Booking>
     */
    #[ORM\OneToMany(targetEntity: Booking::class, mappedBy: 'Property')]
    private Collection $bookings;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->amenities = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->propertyMedias = new ArrayCollection();
        $this->bookings = new ArrayCollection();
    }

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

    public function setTitle(?string $title): static
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

    public function setLocation($location): self
    {
        $this->location = $location;
        return $this;
    }

    #[Groups(['property:read'])]
    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    #[Groups(['property:read'])]
    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    #[Groups(['property:read', 'wishlist:read'])]
    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(Address $address): static
    {
        $this->address = $address;

        return $this;
    }

    #[Groups(['property:read'])]
    public function getPropertyType(): ?string
    {
        return $this->propertyType;
    }

    public function setPropertyType(string $propertyType): static
    {
        $this->propertyType = $propertyType;
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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * @return Collection<int, Amenity>
     */
    #[Groups(['property:read', 'property:details'])]
    public function getAmenities(): Collection
    {
        return $this->amenities;
    }

    public function addAmenity(Amenity $amenity): static
    {
        if (!$this->amenities->contains($amenity)) {
            $this->amenities->add($amenity);
            $amenity->addProperty($this); // Change this line
        }

        return $this;
    }

    public function removeAmenity(Amenity $amenity): static
    {
        if ($this->amenities->removeElement($amenity)) {
            $amenity->removeProperty($this); // Change this line
        }

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    #[Groups(['property:read'])]
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setProperty($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            if ($review->getProperty() === $this) {
                $review->setProperty(null);
            }
        }

        return $this;
    }

    #[Groups(['property:read'])]
    public function getAverageRating(): ?float
    {
        if ($this->reviews->isEmpty()) {
            return null;
        }

        $total = 0;
        foreach ($this->reviews as $review) {
            $total += $review->getRating();
        }

        return $total / $this->reviews->count();
    }

    #[Groups(['property:read', 'wishlist:read'])]
    public function getOwner(): ?User
    {
        return $this->owner;
    }
    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * @return Collection<int, PropertyMedia>
     */
    #[Groups(['property:read', 'wishlist:read'])]
    public function getPropertyMedias(): Collection
    {
        return $this->propertyMedias;
    }

    public function addPropertyMedia(PropertyMedia $propertyMedia): static
    {
        if (!$this->propertyMedias->contains($propertyMedia)) {
            $this->propertyMedias->add($propertyMedia);
            $propertyMedia->setProperty($this);
        }

        return $this;
    }

    public function removePropertyMedia(PropertyMedia $propertyMedia): static
    {
        if ($this->propertyMedias->removeElement($propertyMedia)) {
            // set the owning side to null (unless already changed)
            if ($propertyMedia->getProperty() === $this) {
                $propertyMedia->setProperty(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Booking>
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    public function addBooking(Booking $booking): static
    {
        if (!$this->bookings->contains($booking)) {
            $this->bookings->add($booking);
            $booking->setProperty($this);
        }

        return $this;
    }

    public function removeBooking(Booking $booking): static
    {
        if ($this->bookings->removeElement($booking)) {
            // set the owning side to null (unless already changed)
            if ($booking->getProperty() === $this) {
                $booking->setProperty(null);
            }
        }

        return $this;
    }

    #[Groups(['property:read'])]
    public function isInWishlist(?User $user = null): bool
    {
        if (!$user) {
            return false;
        }

        foreach ($user->getWishlists() as $wishlist) {
            foreach ($wishlist->getWishlistItems() as $item) {
                if ($item->getProperty()->getId() === $this->getId()) {
                    return true;
                }
            }
        }

        return false;
    }
}
