<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\SerializerInterface;

class AuthenticationController extends AbstractController
{
    #[Route('/api/me', name: 'get-me', methods: ['GET'])]
    public function getMe(Security $security, SerializerInterface $serializer): JsonResponse 
    {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $normalizedUser = $serializer->normalize($user, null, ['groups' => ['user:read']]);
        return new JsonResponse($normalizedUser);
    }

    #[Route('/api/is-authenticated', name: 'is-authenticated', methods: ['GET'])]
    public function isAuthenticated(Security $security): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        return new JsonResponse([], 200);
    }

    #[Route('/api/register', name: 'register-api', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setRoles(['ROLE_USER']);
        $user->setCreatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], 400);
        }

        $em->persist($user);
        $em->flush();

        // Return complete user data along with the token
        return $this->json([
            'token' => $jwtManager->create($user),
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'profilePicture' => $user->getProfilePicture(),
                'bio' => $user->getBio(),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getFormattedCreatedAt(),
                'averageRating' => $user->getAverageRating(),
            ]
        ]);
    }

    #[Route('/profile', name: 'profile')]
    public function profile(Security $security): Response {
        // $user = $security->getUser();
        // if (!$user) {
        //     return $this->render('user/unauthorized.html.twig');
        // }
        return $this->render('user/profile.html.twig');
    }
}
