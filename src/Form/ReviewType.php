<?php

namespace App\Form;

use App\Entity\Property;
use App\Entity\Review;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;


class ReviewType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('rating', IntegerType::class, [
                'label' => false,
                'constraints' => [
                    new Assert\Range([
                        'min' => 1,
                        'max' => 5,
                        'notInRangeMessage' => 'Your rating must be between 1 and 5',
                    ])
                ],
                'attr' => [
                    'class' => 'w-full border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2',
                    'placeholder' => 'Rating'
                ]
            ])
            ->add('comment', TextareaType::class, [
                'label' => false,
                'attr' => [
                    'class' => 'w-full border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2',
                    'placeholder' => 'Your comment'
                ]
            ])
            ->add('token', HiddenType::class, [
                'attr' => [
                    'class' => 'token-input'
                ],
                'mapped' => false,
            ]);
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Review::class,
        ]);
    }
}
