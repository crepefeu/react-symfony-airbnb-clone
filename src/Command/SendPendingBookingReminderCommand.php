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
    name: 'app:send-pending-booking-reminder',
    description: 'Send reminder emails to confirm pending booking',
)]
class SendPendingBookingReminderCommand extends Command
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
        
        $pendingBookings = $this->bookingRepository->findPendingBookings();
        
        $emailsSent = 0;
        foreach ($pendingBookings as $booking) {
            try {        
                $emailMessage = (new TemplatedEmail())
                ->from('no-reply@hostme.com')
                ->to($booking->getProperty()->getOwner()->getEmail())
                ->subject("Please confirm pending bookings")
                ->htmlTemplate("booking/pending-booking-reminder-mail-template.html.twig")
                ->context([
                    'firstName' => $booking->getProperty()->getOwner()->getFirstName(),
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

        $io->success(sprintf('Sent %d confirm booking reminders', $sentCount));
        return Command::SUCCESS;    
    }
}
