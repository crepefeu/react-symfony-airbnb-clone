<?php

namespace App\Entity;

use App\Repository\AmenityRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\AmenityCategory;
use Symfony\Component\Serializer\Annotation\Groups;

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

    #[ORM\ManyToOne(inversedBy: 'amenities')]
    #[ORM\JoinColumn(nullable: true)]  // Change this to allow null temporarily
    private ?Property $property = null;

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

    public function getProperty(): ?Property
    {
        return $this->property;
    }

    public function setProperty(?Property $property): static
    {
        $this->property = $property;

        return $this;
    }
}
