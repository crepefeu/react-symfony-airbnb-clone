<?php

namespace App\Enum;

enum AmenityCategory: string
{
    case WIFI = 'wifi';
    case KITCHEN = 'kitchen';
    case BATHROOM = 'bathroom';
    case BEDROOM = 'bedroom';
    case HEATING = 'heating';
    case COOLING = 'cooling';
    case ENTERTAINMENT = 'entertainment';
    case WORKSPACE = 'workspace';
    case LAUNDRY = 'laundry';
    case PARKING = 'parking';
    case OUTDOOR = 'outdoor';
    case SAFETY = 'safety';
    case ACCESSIBILITY = 'accessibility';
    case FEATURES = 'features';

    public function getIcon(): string
    {
        return match($this) {
            self::WIFI => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-wifi"><path d="M12 20h.01"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/></svg>',
            self::SAFETY => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
            self::ENTERTAINMENT => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-tv"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>',
            self::OUTDOOR => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-palm-tree"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/></svg>',
            self::KITCHEN => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-cooking-pot"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>',
            self::BATHROOM => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bath"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/></svg>',
            self::WORKSPACE => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-desk"><path d="M3 3h18v12H3z"/><path d="M3 15h18"/><path d="M2 19h20"/><path d="M12 3v16"/></svg>',
            self::PARKING => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-parking-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
            self::LAUNDRY => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-washing-machine"><rect width="18" height="20" x="3" y="2" rx="2"/><circle cx="12" cy="12" r="5"/><path d="M10 12h.01"/><path d="M7 5h3"/><circle cx="17" cy="5" r="1"/></svg>',
            self::ACCESSIBILITY => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-wheelchair"><circle cx="16" cy="6" r="2"/><path d="M6 17h1.5c1 0 2-.7 2.2-1.7l.3-1.3"/><path d="M8.5 12h9.5"/><path d="M11 9h7"/><path d="M8 17a3 3 0 1 0 6 0v-5"/></svg>',
            self::COOLING => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-fan"><path d="M10.827 16.379a6.707 6.707 0 0 1-8.5-2.705 6.707 6.707 0 0 1 2.704-8.5L8.65 7.06A3.186 3.186 0 0 0 12 12c0 .764-.268 1.482-.756 2.05l-.417.469"/><path d="M8.929 9.407A6.707 6.707 0 0 1 7.624.509 6.707 6.707 0 0 1 15.827.509L12.939 3.5A3.186 3.186 0 0 0 12 12c-.764 0-1.482-.268-2.05-.756l-.469-.417"/><path d="M16.379 10.827a6.707 6.707 0 0 1-2.705-8.5 6.707 6.707 0 0 1 8.5 2.704L20.286 8.65A3.186 3.186 0 0 0 12 12c0-.764.268-1.482.756-2.05l.417-.469"/><path d="M15.827 16.379a6.707 6.707 0 0 1 8.5-2.705 6.707 6.707 0 0 1-2.704 8.5L18.005 20.286A3.186 3.186 0 0 0 12 12c.764 0 1.482.268 2.05.756l.469.417"/></svg>',
            self::HEATING => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-thermometer"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
            self::FEATURES => ''
        };
    }
}
