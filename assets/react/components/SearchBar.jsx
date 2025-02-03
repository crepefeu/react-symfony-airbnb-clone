import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateRangePicker } from 'react-date-range';
import { useSearch } from '../contexts/SearchContext';
import axios from '../utils/axios';

const SearchBar = () => {
    const { searchState, updateSearch } = useSearch();

    const executeSearch = async () => {
        try {
            const { data } = await axios.get('/properties/search', {
                params: {
                    location: searchState.location,
                    checkIn: searchState.dates.startDate.toISOString(),
                    checkOut: searchState.dates.endDate.toISOString(),
                    guests: searchState.guests
                }
            });
            
            window.location.href = `/search?${new URLSearchParams({
                location: searchState.location,
                checkIn: searchState.dates.startDate.toISOString(),
                checkOut: searchState.dates.endDate.toISOString(),
                guests: searchState.guests
            }).toString()}`;
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    return (
        <div className="flex-1 max-w-2xl mx-auto">
            <motion.div
                className={`${
                    searchState.isExpanded 
                        ? 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20'
                        : ''
                }`}
                animate={{ opacity: searchState.isExpanded ? 1 : 0 }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        updateSearch({ isExpanded: false, activeSection: null });
                    }
                }}
            >
                <motion.div
                    layout
                    className={`
                        ${searchState.isExpanded 
                            ? 'w-full max-w-4xl bg-white rounded-xl shadow-2xl'
                            : 'w-full bg-white rounded-full shadow hover:shadow-md cursor-pointer'
                        }
                    `}
                    onClick={() => !searchState.isExpanded && updateSearch({ isExpanded: true })}
                >
                    {!searchState.isExpanded ? (
                        // Collapsed state - Single search bar
                        <div className="flex items-center h-12 px-4 divide-x divide-gray-200">
                            <div className="flex-1 px-4">Start your search</div>
                            <div className="px-4">
                                <div className="p-2 bg-rose-500 rounded-full text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Expanded state
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${searchState.activeSection === 'location' ? 'bg-gray-100' : ''}`}>
                                    <label className="block text-xs font-bold">Where</label>
                                    <input
                                        type="text"
                                        placeholder="Search destinations"
                                        className="w-full bg-transparent border-none outline-none mt-1"
                                        value={searchState.location}
                                        onChange={(e) => updateSearch({ location: e.target.value })}
                                        onClick={() => updateSearch({ activeSection: 'location' })}
                                    />
                                </div>

                                <div 
                                    className={`p-4 rounded-xl cursor-pointer ${searchState.activeSection === 'dates' ? 'bg-gray-100' : ''}`}
                                    onClick={() => updateSearch({ activeSection: 'dates' })}
                                >
                                    <label className="block text-xs font-bold">When</label>
                                    <div className="mt-1">Any week</div>
                                </div>

                                <div 
                                    className={`p-4 rounded-xl cursor-pointer ${searchState.activeSection === 'guests' ? 'bg-gray-100' : ''}`}
                                    onClick={() => updateSearch({ activeSection: 'guests' })}
                                >
                                    <label className="block text-xs font-bold">Who</label>
                                    <div className="mt-1">Add guests</div>
                                </div>
                            </div>

                            {/* Expandable sections */}
                            <AnimatePresence>
                                {searchState.activeSection && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 border-t pt-4"
                                    >
                                        {searchState.activeSection === 'dates' && (
                                            <DateRangePicker
                                                ranges={[{
                                                    startDate: searchState.dates.startDate,
                                                    endDate: searchState.dates.endDate,
                                                    key: 'selection'
                                                }]}
                                                onChange={item => updateSearch({
                                                    dates: {
                                                        startDate: item.selection.startDate,
                                                        endDate: item.selection.endDate
                                                    }
                                                })}
                                            />
                                        )}

                                        {searchState.activeSection === 'guests' && (
                                            <div className="p-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={searchState.guests}
                                                    onChange={(e) => updateSearch({
                                                        guests: parseInt(e.target.value)
                                                    })}
                                                    className="w-full p-2 border rounded"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                                    onClick={executeSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SearchBar;