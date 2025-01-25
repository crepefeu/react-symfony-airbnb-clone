import React from 'react';

const Filters = ({ onFilterChange, onSortChange, filters, sortBy }) => {
    return (
        <div className="bg-white border-b py-4">
            <div className="px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center gap-4">
                    <select
                        className="border rounded-lg px-3 py-2"
                        onChange={(e) => onSortChange(e.target.value)}
                        value={sortBy}
                    >
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Max Price"
                        className="border rounded-lg px-3 py-2"
                        value={filters.maxPrice || ''}
                        onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                    />

                    <select
                        className="border rounded-lg px-3 py-2"
                        value={filters.propertyType || ''}
                        onChange={(e) => onFilterChange({ propertyType: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Filters;
