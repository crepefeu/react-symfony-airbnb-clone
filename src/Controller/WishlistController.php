<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WishlistController extends AbstractController
{
    #[Route('/wishlists', name: 'wishlists')]
    public function index(): Response
    {
        return $this->render('wishlist/index.html.twig');
    }

    #[Route('/wishlists/{id}', name: 'wishlist_show')]
    public function show(int $id): Response
    {
        return $this->render('wishlist/show.html.twig', [
            'wishlistId' => $id
        ]);
    }
}
