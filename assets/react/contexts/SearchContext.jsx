import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

const initialState = {
  location: '',
  dates: {
    startDate: null,
    endDate: null
  },
  guests: {
    adults: 0,
    children: 0
  },
  isExpanded: false,
  activeSection: null,
  // ...any other state properties
};

export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState(initialState);

  const updateSearch = (updates) => {
    setSearchState(prevState => ({
      ...prevState,
      ...updates,
      guests: {
        ...prevState.guests,
        ...(updates.guests || {})
      }
    }));
  };

  return (
    <SearchContext.Provider value={{ searchState, updateSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};