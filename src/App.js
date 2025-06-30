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

// Function to determine background weather condition based on WeatherAPI condition code
const getWeatherCondition = (conditionCode) => {
  // Clear/Sunny conditions
  if (conditionCode === 1000) return 'sunny';
  
  // Cloudy conditions
  if ([1003, 1006, 1009].includes(conditionCode)) return 'cloudy';
  
  // Rainy conditions
  if ([1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) return 'rainy';
  
  // Snowy conditions
  if ([1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) return 'snowy';
  
  // Thunderstorm conditions
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) return 'thunderstorm';
  
  // Foggy/Misty conditions
  if ([1030, 1135, 1147].includes(conditionCode)) return 'foggy';
  
  // Default to clear
  return 'clear';
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('clear');

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
      setWeatherCondition(getWeatherCondition(currentData.current.condition.code));
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
      setWeatherCondition(getWeatherCondition(currentData.current.condition.code));
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
    <div className={`App ${weatherCondition}`}>
      <div className="weather-background">
        {weatherCondition === 'sunny' && <div className="sun"></div>}
        {weatherCondition === 'cloudy' && (
          <div className="clouds">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
          </div>
        )}
        {weatherCondition === 'rainy' && (
          <>
            <div className="clouds">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>
            </div>
            <div className="rain">
              {[...Array(100)].map((_, i) => (
                <div key={i} className="raindrop" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.3 + Math.random() * 0.4}s`
                }}></div>
              ))}
            </div>
          </>
        )}
        {weatherCondition === 'snowy' && (
          <div className="snow">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="snowflake" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}>❄</div>
            ))}
          </div>
        )}
        {weatherCondition === 'thunderstorm' && (
          <div className="thunderstorm">
            <div className="lightning"></div>
          </div>
        )}
      </div>
      
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
