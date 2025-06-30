import React, { useState } from 'react';
import './SearchBox.css';

const SearchBox = ({ onSearch, onLocationClick, loading, locationLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSearch(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Enter city name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="search-input"
            disabled={loading || locationLoading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || locationLoading || !inputValue.trim()}
          >
            {loading ? '🔄' : '🔍'}
          </button>
        </div>
      </form>
      
      <div className="location-section">
        <button 
          type="button"
          onClick={onLocationClick}
          className="location-button"
          disabled={loading || locationLoading}
          title="Get weather for current location"
        >
          {locationLoading ? '🔄' : '📍'} {locationLoading ? 'Getting location...' : 'Current Location'}
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
