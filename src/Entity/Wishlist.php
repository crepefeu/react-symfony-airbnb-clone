<?php

namespace App\Entity;

use App\Repository\WishlistRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: WishlistRepository::class)]
class Wishlist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['wishlist:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'wishlists')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['wishlist:read'])]
    private ?string $name = null;

    /**
     * @var Collection<int, WishlistItem>
     */
    #[ORM\OneToMany(mappedBy: 'wishlist', targetEntity: WishlistItem::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(['wishlist:read'])]
    private Collection $wishlistItems;

    public function __construct()
    {
        $this->wishlistItems = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return Collection<int, WishlistItem>
     */
    #[Groups(['wishlist:read', 'property:read'])]
    public function getWishlistItems(): Collection
    {
        return $this->wishlistItems;
    }

    public function addWishlistItem(WishlistItem $wishlistItem): static
    {
        if (!$this->wishlistItems->contains($wishlistItem)) {
            $this->wishlistItems->add($wishlistItem);
            $wishlistItem->setWishlist($this);
        }

        return $this;
    }

    public function removeWishlistItem(WishlistItem $wishlistItem): static
    {
        if ($this->wishlistItems->removeElement($wishlistItem)) {
            // set the owning side to null (unless already changed)
            if ($wishlistItem->getWishlist() === $this) {
                $wishlistItem->setWishlist(null);
            }
        }

        return $this;
    }
}
