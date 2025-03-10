<?php

namespace App\Controller\Api;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Entity\ChatMediaMessage;
use App\Entity\User;
use App\Repository\ChatRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Uid\Uuid;

#[Route('/api')]
class ChatApiController extends AbstractController
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
        private ChatRepository $chatRepository,
        private UserRepository $userRepository,
        private string $uploadDirectory,
        private SluggerInterface $slugger
    ) {
        // Create chat uploads directory if it doesn't exist
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0777, true);
        }
    }

    #[Route('/chats', name: 'api_get_chats', methods: ['GET'])]
    public function getChats(): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $this->security->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not authenticated'], 401);
            }

            $chats = $this->chatRepository->findByParticipant($user);
            return $this->json(
                ['chats' => $chats], 
                200, 
                [], 
                [
                    'groups' => ['chat:read', 'chat:minimal'],
                    'circular_reference_handler' => function ($object) {
                        return $object->getId();
                    }
                ]
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/chats/{id}/messages', name: 'api_get_chat_messages', methods: ['GET'])]
    public function getChatMessages(Chat $chat): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        if (!$chat->getParticipants()->contains($user)) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        try {
            return $this->json(
                $chat->getMessages(),
                200,
                [],
                [
                    'groups' => ['chat:read', 'chat:minimal'],
                    'circular_reference_handler' => function ($object) {
                        return $object->getId();
                    }
                ]
            );
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error fetching messages'], 500);
        }
    }

    #[Route('/messages/send/{userId}', name: 'api_send_message', methods: ['POST'])]
    public function sendMessage(int $userId, Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        try {
            $recipient = $this->userRepository->find($userId);
            if (!$recipient) {
                return $this->json(['error' => 'Recipient not found'], 404);
            }

            // Find or create chat
            $chat = $this->chatRepository->findBetweenUsers($user, $recipient);
            if (!$chat) {
                $chat = new Chat();
                $chat->addParticipant($user);
                $chat->addParticipant($recipient);
                $this->entityManager->persist($chat);
            }

            // Handle file upload
            $file = $request->files->get('file');
            $content = $request->request->get('content', '');

            if ($file) {
                $message = new ChatMediaMessage();
                $extension = $file->guessExtension() ?? 'bin';
                $newFilename = Uuid::v4()->toRfc4122() . '.' . $extension;

                try {
                    $file->move($this->uploadDirectory, $newFilename);
                    $message->setMediaUrl('/uploads/chat/' . $newFilename);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Error uploading file'], 500);
                }
            } else {
                $message = new ChatMessage();
            }

            $message->setContent($content);
            $message->setSender($user);
            $message->setChat($chat);

            $this->entityManager->persist($message);
            $this->entityManager->flush();

            return $this->json(
                $message,
                201,
                [],
                [
                    'groups' => ['chat:read'],
                    'circular_reference_handler' => function ($object) {
                        return $object->getId();
                    }
                ]
            );
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/messages/{id}', name: 'api_update_message', methods: ['PUT'])]
    public function updateMessage(ChatMessage $message, Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        if ($message->getSender() !== $user) {
            return $this->json(['error' => 'You cannot edit this message'], 403);
        }

        try {
            $data = json_decode($request->getContent(), true);
            $content = $data['content'] ?? null;
            
            if (empty($content)) {
                return $this->json(['error' => 'Message content cannot be empty'], 400);
            }

            $message->setContent($content);
            $this->entityManager->flush();

            return $this->json($message, 200, [], ['groups' => 'chat:read']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error updating message'], 500);
        }
    }

    #[Route('/messages/{id}', name: 'api_delete_message', methods: ['DELETE'])]
    public function deleteMessage(ChatMessage $message): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->security->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        if ($message->getSender() !== $user) {
            return $this->json(['error' => 'You cannot delete this message'], 403);
        }

        try {
            if ($message instanceof ChatMediaMessage && $message->getMediaUrl()) {
                $filePath = $this->getParameter('chat_uploads_directory') . 
                    str_replace('/uploads/chat', '', $message->getMediaUrl());
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            $this->entityManager->remove($message);
            $this->entityManager->flush();

            return $this->json(null, 204);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error deleting message'], 500);
        }
    }
}
