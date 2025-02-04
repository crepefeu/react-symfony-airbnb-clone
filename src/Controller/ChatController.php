<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ChatController extends AbstractController
{
    #[Route('/messages', name: 'app_messages')]
    public function messages(): Response
    {
        return $this->render('chat/index.html.twig');
    }

    #[Route('/messages/{id}', name: 'app_messages_conversation')]
    public function conversation(int $id): Response
    {
        return $this->render('chat/conversation.html.twig', [
            'chatId' => $id
        ]);
    }
}
