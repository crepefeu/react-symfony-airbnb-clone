<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\SecurityBundle\Security;

class UserController extends AbstractController
{
    #[Route('/api/user/profile-picture', name: 'update_profile_picture', methods: ['POST'])]
    public function updateProfilePicture(Request $request, Security $security, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $file = $request->files->get('profilePicture');
        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            // Remove old profile picture if it exists
            $oldPicturePath = $user->getProfilePicture();
            if ($oldPicturePath) {
                $oldPicturePath = $this->getParameter('kernel.project_dir') . '/public' . $oldPicturePath;
                if (file_exists($oldPicturePath)) {
                    unlink($oldPicturePath);
                }
            }

            $file->move(
                $this->getParameter('profile_pictures_directory'),
                $newFilename
            );

            $user->setProfilePicture('/uploads/profile-pictures/' . $newFilename);
            $em->persist($user);
            $em->flush();

            return new JsonResponse([
                'profilePicture' => $user->getProfilePicture(),
                'message' => 'Profile picture updated successfully'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/user/update-profile', name: 'update_profile', methods: ['PUT'])]
    public function updateProfile(
        Request $request, 
        Security $security, 
        EntityManagerInterface $em
    ): JsonResponse
    {
        /** @var User $user */
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        if (isset($data['bio'])) {
            $user->setBio($data['bio']);
        }

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'Profile updated successfully',
            'user' => [
                'bio' => $user->getBio(),
            ]
        ]);
    }
}
