<?php

namespace App\Entity;

use App\Repository\AmenityRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\AmenityCategory;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: AmenityRepository::class)]
class Amenity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['property:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $name = null;

    #[ORM\Column(type: 'string', enumType: AmenityCategory::class)]
    #[Groups(['property:read'])]
    private ?AmenityCategory $category = null;

    #[Groups(['property:read'])]
    public function getCategoryName(): string
    {
        return $this->category?->name ?? '';
    }

    #[Groups(['property:read'])]
    public function getCategoryIcon(): ?string
    {
        return $this->category?->getIcon();
    }

    #[ORM\ManyToMany(targetEntity: Property::class, mappedBy: 'amenities', cascade: ['persist'])]
    private Collection $properties;

    public function __construct()
    {
        $this->properties = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getCategory(): ?AmenityCategory
    {
        return $this->category;
    }

    public function setCategory(AmenityCategory $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getProperties(): Collection
    {
        return $this->properties;
    }

    public function addProperty(Property $property): static
    {
        if (!$this->properties->contains($property)) {
            $this->properties->add($property);
        }

        return $this;
    }

    public function removeProperty(Property $property): static
    {
        $this->properties->removeElement($property);

        return $this;
    }

    public function __toString(): string
    {
        return $this->name ?? 'Unnamed Amenity';
    }
}
