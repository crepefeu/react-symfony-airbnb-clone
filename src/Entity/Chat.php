<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
class Chat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['chat:read'])]
    private ?int $id = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'chats')]
    #[Groups(['chat:read', 'chat:minimal'])]
    #[MaxDepth(1)]
    private Collection $participants;

    #[ORM\OneToMany(mappedBy: 'chat', targetEntity: ChatMessage::class, orphanRemoval: true)]
    #[ORM\OrderBy(['createdAt' => 'ASC'])]  // Changed from DESC to ASC to show oldest first
    #[Groups(['chat:minimal'])]
    #[MaxDepth(1)]
    private Collection $messages;

    #[ORM\Column]
    #[Groups(['chat:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['chat:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, User>
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(User $participant): static
    {
        if (!$this->participants->contains($participant)) {
            $this->participants->add($participant);
        }

        return $this;
    }

    public function removeParticipant(User $participant): static
    {
        $this->participants->removeElement($participant);

        return $this;
    }

    /**
     * @return Collection<int, ChatMessage>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(ChatMessage $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setChat($this);
            $this->setUpdatedAt(new \DateTimeImmutable());
        }

        return $this;
    }

    public function removeMessage(ChatMessage $message): static
    {
        if ($this->messages->removeElement($message)) {
            if ($message->getChat() === $this) {
                $message->setChat(null);
            }
        }

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

    #[Groups(['chat:read'])]
    public function getFormattedCreatedAt(): string
    {
        return $this->createdAt?->format(\DateTimeInterface::RFC3339_EXTENDED) ?? '';
    }

    #[Groups(['chat:read'])]
    public function getFormattedUpdatedAt(): string
    {
        return $this->updatedAt?->format(\DateTimeInterface::RFC3339_EXTENDED) ?? '';
    }

    #[Groups(['chat:read'])]
    public function getLastMessage(): ?ChatMessage
    {
        return $this->messages->isEmpty() ? null : $this->messages->first();
    }

    #[Groups(['chat:read'])]
    public function getLastMessageId(): ?int
    {
        return $this->getLastMessage()?->getId();
    }
}
