import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import StarRating from './StarRating';
import Modal from './Modal';

const ReservationCard = ({ property }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [numberOfNights, setNumberOfNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const cardRef = useRef(null);
    const [calendarPosition, setCalendarPosition] = useState('left');
    const [calendarOffset, setCalendarOffset] = useState(0);
    const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
    const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

    const handleClearDates = () => {
        setDateRange([null, null]);
    };

    useEffect(() => {
        if (startDate && endDate) {
            const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            setNumberOfNights(nights);
            setTotalPrice(nights * property.price);
        } else {
            setNumberOfNights(0);
            setTotalPrice(0);
        }
    }, [startDate, endDate, property.price]);

    useEffect(() => {
        if (isCalendarOpen && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const calendarWidth = 750; // Match max-width from CSS
            const viewportWidth = window.innerWidth;
            
            // Calculate how much the calendar would overflow on the right
            const overflowRight = rect.left + calendarWidth - viewportWidth;
            
            // If calendar would overflow right side
            if (overflowRight > 0) {
                // Move calendar left by the overflow amount, but don't let it go off screen left
                const offset = Math.min(overflowRight, rect.left);
                setCalendarOffset(offset);
            } else {
                setCalendarOffset(0);
            }
        }
    }, [isCalendarOpen]);

    const formatDate = (date) => {
        if (!date) return 'Add date';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const GuestTypeSelector = ({ type, value, onChange, max, description }) => (
        <div className="flex items-center justify-between py-3">
            <div>
                <div className="font-semibold">{type}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    className={`rounded-full w-8 h-8 border flex items-center justify-center 
                        ${value <= 0 ? 'border-gray-200 text-gray-200' : 'border-gray-500 text-gray-500 hover:border-black hover:text-black'}`}
                    onClick={() => onChange(Math.max(0, value - 1))}
                    disabled={value <= 0}
                >
                    -
                </button>
                <span className="w-6 text-center">{value}</span>
                <button
                    className={`rounded-full w-8 h-8 border flex items-center justify-center 
                        ${getTotalGuests() >= property.maxGuests ? 'border-gray-200 text-gray-200' : 'border-gray-500 text-gray-500 hover:border-black hover:text-black'}`}
                    onClick={() => onChange(value + 1)}
                    disabled={getTotalGuests() >= property.maxGuests}
                >
                    +
                </button>
            </div>
        </div>
    );

    const getTotalGuests = () => guests.adults + guests.children;

    const formatGuestLabel = () => {
        const total = getTotalGuests();
        let label = `${total} ${total === 1 ? 'guest' : 'guests'}`;
        if (guests.infants > 0) {
            label += `, ${guests.infants} ${guests.infants === 1 ? 'infant' : 'infants'}`;
        }
        return label;
    };

    return (
        <div ref={cardRef} className="border rounded-xl p-6 shadow-lg h-fit sticky top-24 space-y-4 z-40">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <span className="text-2xl font-bold">€{property.price}</span>
                    <span className="text-gray-500"> / night</span>
                </div>
                {property.averageRating && (
                    <div className="flex items-center gap-2">
                        <StarRating rating={property.averageRating} size="sm" />
                        <span className="text-sm text-gray-600">
                            {property.reviews.length} {property.reviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>
                )}
            </div>

            <div className="border rounded-lg relative">
                <div className="grid grid-cols-2">
                    <button 
                        onClick={() => setIsCalendarOpen(true)}
                        className="p-3 border-r border-b text-left hover:bg-gray-50"
                    >
                        <label className="block text-xs uppercase font-semibold text-gray-600">Check-in</label>
                        <div className="mt-1">{formatDate(startDate)}</div>
                    </button>
                    <button 
                        onClick={() => setIsCalendarOpen(true)}
                        className="p-3 border-b text-left hover:bg-gray-50"
                    >
                        <label className="block text-xs uppercase font-semibold text-gray-600">Check-out</label>
                        <div className="mt-1">{formatDate(endDate)}</div>
                    </button>
                </div>

                {isCalendarOpen && (
                    <>
                        {/* Overlay */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} />
                        
                        {/* Calendar Menu - Now positioned relative to the reservation card */}
                        <div 
                            className="absolute z-50 bg-white rounded-lg shadow-xl mt-2"
                            style={{
                                width: '750px',
                                left: `calc(70% - ${calendarOffset}px)`,
                                top: '0',
                                transform: 'translateX(-50%)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Top section */}
                            <div className="p-4 border-b flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">
                                        {numberOfNights > 0 ? `${numberOfNights} nights` : 'Select dates'}
                                    </h3>
                                    {startDate && endDate && (
                                        <p className="text-sm text-gray-500">
                                            {formatDate(startDate)} - {formatDate(endDate)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <div className="border rounded-lg p-2">
                                        <div className="font-semibold">CHECK-IN</div>
                                        <div>{formatDate(startDate)}</div>
                                    </div>
                                    <div className="border rounded-lg p-2">
                                        <div className="font-semibold">CHECK-OUT</div>
                                        <div>{formatDate(endDate)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar section */}
                            <div className="p-4">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(dates) => {
                                        setDateRange(dates);
                                        if (dates[0] && dates[1]) {
                                            setIsCalendarOpen(false);
                                        }
                                    }}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                    monthsShown={2}
                                    minDate={new Date()}
                                    calendarClassName="flex hostMe-style border-none"
                                />
                            </div>
                            
                            {/* Bottom section */}
                            <div className="p-4 border-t flex justify-between items-center">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleClearDates}
                                        className="text-sm font-semibold underline"
                                    >
                                        Clear dates
                                    </button>
                                    <button
                                        onClick={() => setShowKeyboardHelp(true)}
                                        className="text-sm font-semibold underline"
                                    >
                                        Keyboard shortcuts
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <div className="p-3 border-t relative">
                    <button
                        onClick={() => setIsGuestSelectorOpen(!isGuestSelectorOpen)}
                        className="w-full text-left"
                    >
                        <label className="block text-xs uppercase font-semibold text-gray-600">Guests</label>
                        <div className="mt-1">{formatGuestLabel()}</div>
                    </button>

                    {isGuestSelectorOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsGuestSelectorOpen(false)} />
                            <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border p-4">
                                <GuestTypeSelector
                                    type="Adults"
                                    description="Age 13+"
                                    value={guests.adults}
                                    onChange={(value) => setGuests({ ...guests, adults: value })}
                                    max={property.maxGuests}
                                />
                                <GuestTypeSelector
                                    type="Children"
                                    description="Ages 2-12"
                                    value={guests.children}
                                    onChange={(value) => setGuests({ ...guests, children: value })}
                                    max={property.maxGuests}
                                />
                                <GuestTypeSelector
                                    type="Infants"
                                    description="Under 2"
                                    value={guests.infants}
                                    onChange={(value) => setGuests({ ...guests, infants: value })}
                                    max={5}
                                />
                                <div className="text-sm text-gray-500 mt-4">
                                    {property.maxGuests} guests maximum. Infants don't count toward the guest total.
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <button 
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!startDate || !endDate}
            >
                Reserve
            </button>

            {numberOfNights > 0 && (
                <div className="space-y-4 mt-4 border-t pt-4">
                    <div className="flex justify-between text-gray-600">
                        <span>€{property.price} × {numberOfNights} nights</span>
                        <span>€{totalPrice}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>€{totalPrice}</span>
                    </div>
                </div>
            )}

            <Modal isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)}>
                <div title="Keyboard Controls">
                    <ul className="space-y-2 mb-4">
                        <li>← → : Navigate days</li>
                        <li>↑ ↓ : Navigate weeks</li>
                        <li>PgUp/PgDn : Switch months</li>
                        <li>Home/End : Go to start/end of week</li>
                        <li>Enter/Space : Select date</li>
                        <li>Esc : Close calendar</li>
                    </ul>
                </div>
            </Modal>
        </div>
    );
};

ReservationCard.propTypes = {
    property: PropTypes.shape({
        price: PropTypes.number.isRequired,
        maxGuests: PropTypes.number.isRequired,
        averageRating: PropTypes.number,
        reviews: PropTypes.array.isRequired,
    }).isRequired,
};

export default ReservationCard;
