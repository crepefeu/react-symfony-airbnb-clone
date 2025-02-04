<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Wishlist;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\WishlistItem;
use App\Entity\Property;

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
            'wishlistId' => $id,
        ]);
    }

    #[Route('/api/wishlists', name: 'create_wishlist', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'])) {
            return new JsonResponse(['error' => 'Name is required'], Response::HTTP_BAD_REQUEST);
        }

        $wishlist = new Wishlist();
        $wishlist->setName($data['name']);
        $wishlist->setOwner($user);

        $entityManager->persist($wishlist);
        $entityManager->flush();

        return new JsonResponse([
            'wishlist' => [
                'id' => $wishlist->getId(),
                'name' => $wishlist->getName(),
                'wishlistItems' => []
            ]
        ], Response::HTTP_CREATED);
    }

    // Get api route to get all wishlists of the current user
    #[Route('/api/wishlists', name: 'get_wishlists', methods: ['GET'])]
    public function getWishlists(Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
        }

        $wishlists = $user->getWishlists();

        return $this->json([
            'wishlists' => $wishlists
        ], 200, [], ['groups' => ['wishlist:read']]);
    }

    // Route to add an item to a wishlist
    #[Route('/api/wishlists/{id}/items', name: 'add_wishlist_item', methods: ['POST'])]
    public function addItem(int $id, Request $request, EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
        }

        $wishlists = $user->getWishlists();

        // Find the wishlist
        $wishlist = null;
        foreach ($wishlists as $w) {
            if ($w->getId() === $id) {
                $wishlist = $w;
                break;
            }
        }

        if (!$wishlist) {
            return new JsonResponse(['error' => 'Wishlist not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // check if the property id is set
        if (!isset($data['propertyId'])) {
            return new JsonResponse(['error' => 'Property is required'], Response::HTTP_BAD_REQUEST);
        }

        // Get the property from the database
        $property = $entityManager->getRepository(Property::class)->find($data['propertyId']);

        if (!$property) {
            return new JsonResponse(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
        }

        // Check if property already exists in wishlist
        foreach ($wishlist->getWishlistItems() as $item) {
            if ($item->getProperty()->getId() === $property->getId()) {
                return new JsonResponse([
                    'error' => 'Property already exists in this wishlist'
                ], Response::HTTP_CONFLICT);
            }
        }

        // Create a new WishlistItem with the property values from the request
        $wishlistItem = new WishlistItem();
        $wishlistItem->setProperty($property);
        $wishlistItem->setWishlist($wishlist);

        $entityManager->persist($wishlistItem);
        $entityManager->flush();

        return new JsonResponse([
            'wishlistItem' => [
                'id' => $wishlistItem->getId(),
                'property' => $wishlistItem->getProperty()
            ],
            'message' => 'Item added to wishlist'
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/wishlists/wishlist/{id}', name: 'get_wishlist', methods: ['GET'])]
    public function getWishlist(int $id, Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
        }

        $wishlist = null;
        foreach ($user->getWishlists() as $w) {
            if ($w->getId() === $id) {
                $wishlist = $w;
                break;
            }
        }

        if (!$wishlist) {
            return new JsonResponse(['error' => 'Wishlist not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'wishlist' => $wishlist
        ], 200, [], ['groups' => ['wishlist:read']]);
    }

    #[Route('/api/wishlists/{wishlistId}/items/{propertyId}', name: 'remove_wishlist_item', methods: ['DELETE'])]
    public function removeItem(
        int $wishlistId,
        int $propertyId,
        EntityManagerInterface $entityManager,
        Security $security
    ): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Authentication required'], Response::HTTP_UNAUTHORIZED);
        }

        // Find the wishlist and verify ownership
        $wishlist = null;
        foreach ($user->getWishlists() as $w) {
            if ($w->getId() === $wishlistId) {
                $wishlist = $w;
                break;
            }
        }

        if (!$wishlist) {
            return new JsonResponse(['error' => 'Wishlist not found'], Response::HTTP_NOT_FOUND);
        }

        // Find the wishlist item
        $wishlistItem = null;
        foreach ($wishlist->getWishlistItems() as $item) {
            if ($item->getProperty()->getId() === $propertyId) {
                $wishlistItem = $item;
                break;
            }
        }

        if (!$wishlistItem) {
            return new JsonResponse(['error' => 'Property not found in wishlist'], Response::HTTP_NOT_FOUND);
        }

        // Remove the item
        $entityManager->remove($wishlistItem);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
