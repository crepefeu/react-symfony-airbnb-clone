<?php

namespace App\Form;

use App\Entity\Booking;
use App\Entity\Property;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BookingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('checkInDate', null, [
                'widget' => 'single_text',
            ])
            ->add('checkOutDate', null, [
                'widget' => 'single_text',
            ])
            ->add('numberOfGuests')
            ->add('totalPrice')
            ->add('createdAt', null, [
                'widget' => 'single_text',
            ])
            ->add('Status')
            ->add('Property', EntityType::class, [
                'class' => Property::class,
                'choice_label' => 'id',
            ])
            ->add('Guest', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Booking::class,
        ]);
    }
}
