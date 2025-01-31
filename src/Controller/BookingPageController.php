<?php

namespace App\Controller;

use App\Entity\Booking;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BookingPageController extends AbstractController
{
    #[Route('/trips', name: 'trips')]
    public function trips(): Response
    {
        return $this->render('booking/index.html.twig');
    }
}
