<?php

namespace App\Command;

use App\Repository\BookingRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

#[AsCommand(
    name: 'app:send-booking-reminder',
    description: 'Send reminder emails for upcoming trip',
)]
class SendBookingReminderCommand extends Command
{
    public function __construct(private BookingRepository $bookingRepository,private MailerInterface $mailer)
    {
        parent::__construct();
    }

    protected function configure(): void
    {}

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $now = new \DateTime();
        $endDate = (clone $now)->modify('+2 days');
        
        $upcomingBookings = $this->bookingRepository->findBookingsBetweenDates(
            $now, 
            $endDate
        );

        $sentCount = 0;
        foreach ($upcomingBookings as $booking) {
            try {        
                $emailMessage = (new TemplatedEmail())
                ->from('no-reply@hostme.com')
                ->to($booking->getGuest()->getEmail())
                ->subject("Your upcoming trip")
                ->htmlTemplate("booking/upcoming-trip-mail-template.html.twig")
                ->context([
                    'firstName' => $booking->getGuest()->getFirstName(),
                    'propertyName' => $booking->getProperty()->getTitle(),
                ]);
        
                $this->mailer->send($emailMessage);
                $sentCount++;
                $io->note(sprintf('Reminder sent for booking %d', $booking->getId()));
            } catch (\Exception $e) {
                $io->error(sprintf('Failed to send reminder for booking %d: %s', 
                    $booking->getId(), 
                    $e->getMessage()
                ));
            }
        }

        $io->success(sprintf('Sent %d booking reminders', $sentCount));
        return Command::SUCCESS;    }
}
