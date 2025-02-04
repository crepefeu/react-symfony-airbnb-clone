<?php

namespace App\DataFixtures;

use App\Entity\Chat;
use App\Entity\ChatMessage;
use App\Entity\ChatMediaMessage;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;

class ChatFixtures extends Fixture implements DependentFixtureInterface
{
    private const SAMPLE_IMAGES = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
        'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
    ];

    public function load(ObjectManager $manager): void
    {
        // Chat 1: Between User1 and Host1
        $chat1 = new Chat();
        $chat1->addParticipant($this->getReference(UserFixtures::USER1_REFERENCE, User::class));
        $chat1->addParticipant($this->getReference(UserFixtures::HOST1_REFERENCE, User::class));
        
        $message1 = new ChatMessage();
        $message1->setContent("Hi, I'm interested in your property in Paris.");
        $message1->setSender($this->getReference(UserFixtures::USER1_REFERENCE, User::class));
        $message1->setChat($chat1);
        $message1->setCreatedAt(new \DateTimeImmutable('2023-10-01 10:00:00'));
        
        $message2 = new ChatMessage();
        $message2->setContent("Hello! Thank you for your interest. When would you like to stay?");
        $message2->setSender($this->getReference(UserFixtures::HOST1_REFERENCE, User::class));
        $message2->setChat($chat1);
        $message2->setCreatedAt(new \DateTimeImmutable('2023-10-01 10:05:00'));

        $manager->persist($chat1);
        $manager->persist($message1);
        $manager->persist($message2);

        // Chat 2: Between User2 and Host2 with media messages
        $chat2 = new Chat();
        $chat2->addParticipant($this->getReference(UserFixtures::USER2_REFERENCE, User::class));
        $chat2->addParticipant($this->getReference(UserFixtures::HOST2_REFERENCE, User::class));

        $message3 = new ChatMessage();
        $message3->setContent("Is your apartment still available for next week?");
        $message3->setSender($this->getReference(UserFixtures::USER2_REFERENCE, User::class));
        $message3->setChat($chat2);
        $message3->setCreatedAt(new \DateTimeImmutable('2023-10-02 15:00:00'));

        // Add multiple media messages
        foreach (self::SAMPLE_IMAGES as $index => $imageUrl) {
            $mediaMessage = new ChatMediaMessage();
            $mediaMessage->setContent("Here's a picture of the " . ($index === 0 ? "view" : ($index === 1 ? "living room" : "kitchen")));
            $mediaMessage->setMediaUrl($imageUrl);
            $mediaMessage->setSender($this->getReference(UserFixtures::HOST2_REFERENCE, User::class));
            $mediaMessage->setChat($chat2);
            $mediaMessage->setCreatedAt(new \DateTimeImmutable('2023-10-02 ' . (15 + $index) . ':10:00'));
            
            $manager->persist($mediaMessage);
        }

        $manager->persist($chat2);
        $manager->persist($message3);

        // Chat 3: Between Host1 and Host2
        $chat3 = new Chat();
        $chat3->addParticipant($this->getReference(UserFixtures::HOST1_REFERENCE, User::class));
        $chat3->addParticipant($this->getReference(UserFixtures::HOST2_REFERENCE, User::class));

        $message4 = new ChatMessage();
        $message4->setContent("Hey, how's the hosting experience going for you?");
        $message4->setSender($this->getReference(UserFixtures::HOST1_REFERENCE, User::class));
        $message4->setChat($chat3);
        $message4->setCreatedAt(new \DateTimeImmutable('2023-10-03 09:00:00'));

        $message5 = new ChatMessage();
        $message5->setContent("Great! Had some wonderful guests lately.");
        $message5->setSender($this->getReference(UserFixtures::HOST2_REFERENCE, User::class));
        $message5->setChat($chat3);
        $message5->setCreatedAt(new \DateTimeImmutable('2023-10-03 09:15:00'));

        $manager->persist($chat3);
        $manager->persist($message4);
        $manager->persist($message5);

        $manager->flush();

    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
