import React from 'react';

const Search = ({ initialSearchParams }) => {
    return (
        <div className="pt-20 px-4">
            <h1 className="text-2xl font-semibold mb-4">Search Results</h1>
            {/* Add your search results component here */}
            <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(initialSearchParams, null, 2)}
            </pre>
        </div>
    );
};

export default Search;
