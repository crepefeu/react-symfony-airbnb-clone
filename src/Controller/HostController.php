<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HostController extends AbstractController
{
    #[Route('/host', name: 'app_host')]
    public function index(): Response
    {
        return $this->render('host/index.html.twig');
    }

    #[Route('/become-host/intro', name: 'app_become_host')]
    public function becomeHost(): Response
    {
        return $this->render('host/become.html.twig');
    }
}
