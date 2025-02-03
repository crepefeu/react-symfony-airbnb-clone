<?php

namespace App\Entity;

use App\Repository\PropertyDraftRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PropertyDraftRepository::class)]
class PropertyDraft
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['draft:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'propertyDrafts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['draft:read'])]
    private ?User $owner = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['draft:read', 'user:read'])]
    private array $data = [];

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['draft:read', 'user:read'])]
    private \DateTimeImmutable $lastSaved;

    #[ORM\Column]
    #[Groups(['draft:read', 'user:read'])]
    private int $currentStep = 1;

    public function __construct()
    {
        $this->lastSaved = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;
        return $this;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): self
    {
        $this->data = $data;
        return $this;
    }

    public function getLastSaved(): \DateTimeImmutable
    {
        return $this->lastSaved;
    }

    public function setLastSaved(\DateTimeImmutable $lastSaved): self
    {
        $this->lastSaved = $lastSaved;
        return $this;
    }

    public function getCurrentStep(): int
    {
        return $this->currentStep;
    }

    public function setCurrentStep(int $currentStep): self
    {
        $this->currentStep = $currentStep;
        return $this;
    }
}
