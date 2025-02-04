<?php

namespace App\Entity;

use App\Repository\ChatMediaMessageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChatMediaMessageRepository::class)]
class ChatMediaMessage extends ChatMessage
{
    #[ORM\Column(length: 255)]
    #[Groups(['chat:read'])]
    private ?string $mediaUrl = null;

    public function getMediaUrl(): ?string
    {
        return $this->mediaUrl;
    }

    public function setMediaUrl(string $mediaUrl): static
    {
        $this->mediaUrl = $mediaUrl;
        return $this;
    }
}
