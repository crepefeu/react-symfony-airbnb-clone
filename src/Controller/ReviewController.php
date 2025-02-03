<?php

namespace App\Controller;

use App\Entity\Review;
use App\Form\ReviewType;
use App\Repository\ReviewRepository;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\SecurityBundle\Security;

#[Route('/review')]
final class ReviewController extends AbstractController
{
    #[Route('/{propertyId}/{userId}/new', name: 'app_review_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, string $propertyId, string $userId, PropertyRepository $propertyRepository, UserRepository $userRepository): Response
    {

        $review = new Review();
        $form = $this->createForm(ReviewType::class, $review);
        $form->handleRequest($request);
        $property = $propertyRepository->find($propertyId);
        $author = $userRepository->find($userId);
        $review->setProperty($property);
        $review->setAuthor($author);
        $review->setCreatedAt(new \DateTimeImmutable());

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($review);
            $entityManager->flush();

            return $this->redirectToRoute('trips', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('review/new.html.twig', [
            'propertyId' => $propertyId,
            'review' => $review,
            'form' => $form,
        ]);
    }

    #[Route('/{propertyId}/{id}/edit', name: 'app_review_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request,
        EntityManagerInterface $entityManager,
        ReviewRepository $reviewRepository,
        string $propertyId,
        string $id
    ): Response
    {
        $review = $reviewRepository->find(['id' => $id]);
        $form = $this->createForm(ReviewType::class, $review);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $review->setCreatedAt(new \DateTimeImmutable);
            $entityManager->flush();
            return $this->redirectToRoute('trips', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('review/edit.html.twig', [
            'propertyId' => $propertyId,
            'review' => $review,
            'form' => $form,
        ]);
    }

    #[Route('/{id}/delete', name: 'app_review_delete', methods: ['GET'])]
    public function delete(Request $request, Review $review, EntityManagerInterface $entityManager): Response
    {
            $entityManager->remove($review);
            $entityManager->flush();
        return $this->redirectToRoute('trips', [], Response::HTTP_SEE_OTHER);
    }
}
