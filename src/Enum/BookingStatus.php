<?php

namespace App\Enum;

enum BookingStatus: string
{
    case PENDING = "pending";
    case VALIDATED = "validated";
    case ONGOING = "ongoing";
    case FINISHED = "finished";
    case MISSED = "missed";
    case CANCELED = "canceled";
}
