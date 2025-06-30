import React, { useState, useEffect, useCallback } from 'react';
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
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch weather data for coordinates (latitude, longitude)
  const fetchWeatherByCoordinates = useCallback(async (lat, lon) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch both current weather and forecast data using coordinates
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${CURRENT_URL}?key=${API_KEY}&q=${lat},${lon}&aqi=no`),
        fetch(`${FORECAST_URL}?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`)
      ]);
      
      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data for your location.');
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
      setCity(`${currentData.location.name}, ${currentData.location.country}`);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's current location and fetch weather
  const getCurrentLocationWeather = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please allow location access and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [fetchWeatherByCoordinates]);
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

  // Load current location weather on component mount
  useEffect(() => {
    getCurrentLocationWeather();
  }, [getCurrentLocationWeather]);

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>🌤️ Live Weather App</h1>
          <p>Get real-time weather information for any city or your current location</p>
        </header>

        <SearchBox 
          onSearch={fetchWeatherData} 
          onLocationClick={getCurrentLocationWeather}
          loading={loading} 
          locationLoading={locationLoading}
        />

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
