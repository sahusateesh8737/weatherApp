import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBox from './components/SearchBox';
import LoadingSpinner from './components/LoadingSpinner';

// WeatherAPI configuration
const API_KEY = '28ccfd75196e42ca90081251242207';
const BASE_URL = 'http://api.weatherapi.com/v1';
const CURRENT_URL = `${BASE_URL}/current.json`;
const FORECAST_URL = `${BASE_URL}/forecast.json`;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');

  // Fetch weather data for a given city using WeatherAPI
  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Fetch both current weather and forecast data
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${CURRENT_URL}?key=${API_KEY}&q=${cityName}&aqi=no`),
        fetch(`${FORECAST_URL}?key=${API_KEY}&q=${cityName}&days=7&aqi=no&alerts=no`)
      ]);
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        if (currentResponse.status === 400 || forecastResponse.status === 400) {
          throw new Error('City not found. Please check the city name and try again.');
        } else if (currentResponse.status === 401 || forecastResponse.status === 401) {
          throw new Error('Invalid API key. Please check your WeatherAPI configuration.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again.');
        }
      }
      
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      
      // Combine current and forecast data
      const combinedData = {
        current: currentData.current,
        location: currentData.location,
        forecast: forecastData.forecast
      };
      
      setWeatherData(combinedData);
      setCity(cityName);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load default city weather on component mount
  useEffect(() => {
    fetchWeatherData('London');
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>🌤️ Live Weather App</h1>
          <p>Get real-time weather information for any city</p>
        </header>

        <SearchBox onSearch={fetchWeatherData} loading={loading} />

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {weatherData && !loading && (
          <WeatherCard weatherData={weatherData} city={city} />
        )}

        <footer className="app-footer">
          <p>Powered by WeatherAPI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
