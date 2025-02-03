<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HostController extends AbstractController
{
    #[Route('/become-a-host', name: 'become_host')]
    public function hostLanding(): Response
    {
        return $this->render('host/index.html.twig');
    }
}
