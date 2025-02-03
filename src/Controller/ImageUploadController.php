<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageUploadController extends AbstractController
{
    private $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    #[Route('/api/upload-image', name: 'api_upload_image', methods: ['POST'])]
    public function uploadImage(Request $request, SluggerInterface $slugger): JsonResponse
    {
        try {
            $file = $request->files->get('image');
            
            if (!$file) {
                return $this->json(['error' => 'No file uploaded'], 400);
            }

            // Check file size (10MB limit)
            $maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if ($file->getSize() > $maxSize) {
                return $this->json([
                    'error' => 'File size too large. Maximum size is 10MB'
                ], 400);
            }

            // Create uploads directory if needed
            $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/properties';
            if (!is_dir($uploadsDir)) {
                if (!mkdir($uploadsDir, 0755, true)) {
                    throw new \RuntimeException('Failed to create upload directory');
                }
            }

            // Generate safe filename
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.jpg';
            $targetPath = $uploadsDir . '/' . $newFilename;

            // Process and save image using GD driver
            try {
                $image = $this->imageManager->read($file->getRealPath());
                
                // Resize maintaining aspect ratio
                if ($image->width() > 1200 || $image->height() > 800) {
                    $image->scale(width: 1200);
                    
                    if ($image->height() > 800) {
                        $image->scale(height: 800);
                    }
                }
                
                // Convert and save as JPEG
                $image->toJpeg(quality: 85)
                      ->save($targetPath);

            } catch (\Exception $e) {
                // Fallback to direct file move if image processing fails
                $file->move($uploadsDir, $newFilename);
            }

            return $this->json([
                'url' => '/uploads/properties/' . $newFilename
            ]);
            
        } catch (\Exception $e) {
            return $this->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
