<?php

namespace App\Repository;

use App\Entity\ChatMediaMessage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ChatMediaMessage>
 */
class ChatMediaMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatMediaMessage::class);
    }

    /**
     * Find media messages by chat
     */
    public function findMediaMessagesByChat(Chat $chat): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.chat = :chat')
            ->andWhere('m INSTANCE OF :type')
            ->setParameter('chat', $chat)
            ->setParameter('type', ChatMediaMessage::class)
            ->orderBy('m.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
