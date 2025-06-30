import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weatherData, city }) => {
  if (!weatherData) return null;

  const {
    current: {
      temp_c,
      feelslike_c,
      humidity,
      pressure_mb,
      wind_kph,
      vis_km,
      condition: { text: description, code }
    },
    location: { name, country },
    forecast: { forecastday = [] }
  } = weatherData;

  // Function to get weather emoji based on WeatherAPI condition codes
  const getWeatherEmoji = (conditionCode) => {
    // WeatherAPI condition codes mapping to emojis
    const weatherEmojis = {
      1000: '☀️', // Sunny
      1003: '⛅', // Partly cloudy
      1006: '☁️', // Cloudy
      1009: '☁️', // Overcast
      1030: '🌫️', // Mist
      1063: '🌦️', // Patchy rain possible
      1066: '🌨️', // Patchy snow possible
      1069: '🌨️', // Patchy sleet possible
      1072: '🌧️', // Patchy freezing drizzle possible
      1087: '⛈️', // Thundery outbreaks possible
      1114: '❄️', // Blowing snow
      1117: '❄️', // Blizzard
      1135: '🌫️', // Fog
      1147: '🌫️', // Freezing fog
      1150: '🌦️', // Patchy light drizzle
      1153: '�️', // Light drizzle
      1168: '🌧️', // Freezing drizzle
      1171: '🌧️', // Heavy freezing drizzle
      1180: '🌦️', // Patchy light rain
      1183: '🌧️', // Light rain
      1186: '🌧️', // Moderate rain at times
      1189: '🌧️', // Moderate rain
      1192: '🌧️', // Heavy rain at times
      1195: '🌧️', // Heavy rain
      1198: '🌧️', // Light freezing rain
      1201: '🌧️', // Moderate or heavy freezing rain
      1204: '🌨️', // Light sleet
      1207: '🌨️', // Moderate or heavy sleet
      1210: '❄️', // Patchy light snow
      1213: '❄️', // Light snow
      1216: '❄️', // Patchy moderate snow
      1219: '❄️', // Moderate snow
      1222: '❄️', // Patchy heavy snow
      1225: '❄️', // Heavy snow
      1237: '🧊', // Ice pellets
      1240: '�️', // Light rain shower
      1243: '�️', // Moderate or heavy rain shower
      1246: '🌧️', // Torrential rain shower
      1249: '🌨️', // Light sleet showers
      1252: '�️', // Moderate or heavy sleet showers
      1255: '❄️', // Light snow showers
      1258: '❄️', // Moderate or heavy snow showers
      1261: '🧊', // Light showers of ice pellets
      1264: '🧊', // Moderate or heavy showers of ice pellets
      1273: '⛈️', // Patchy light rain with thunder
      1276: '⛈️', // Moderate or heavy rain with thunder
      1279: '⛈️', // Patchy light snow with thunder
      1282: '⛈️'  // Moderate or heavy snow with thunder
    };
    return weatherEmojis[conditionCode] || '🌤️';
  };

  // Function to format temperature
  const formatTemp = (temperature) => Math.round(temperature);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2 className="city-name">
          {name}, {country}
        </h2>
        <div className="weather-icon">
          {getWeatherEmoji(code)}
        </div>
      </div>

      <div className="temperature-section">
        <div className="main-temp">
          {formatTemp(temp_c)}°C
        </div>
        <div className="weather-description">
          {description}
        </div>
        <div className="feels-like">
          Feels like {formatTemp(feelslike_c)}°C
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{wind_kph} km/h</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{pressure_mb} mb</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">👁️</span>
          <div className="detail-info">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{vis_km} km</span>
          </div>
        </div>
      </div>

      <div className="last-updated">
        Last updated: {new Date().toLocaleTimeString()}
      </div>

      {/* Hourly Forecast */}
      {forecastday && forecastday.length > 0 && forecastday[0].hour && (
        <div className="hourly-forecast">
          <h3 className="forecast-title">Next 24 Hours</h3>
          <div className="hourly-items">
            {forecastday[0].hour.slice(0, 8).map((hour, index) => (
              <div key={index} className="hourly-item">
                <div className="hour-time">
                  {new Date(hour.time).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    hour12: true 
                  })}
                </div>
                <div className="hour-icon">
                  {getWeatherEmoji(hour.condition.code)}
                </div>
                <div className="hour-temp">
                  {formatTemp(hour.temp_c)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Forecast */}
      {forecastday && forecastday.length > 0 && (
        <div className="daily-forecast">
          <h3 className="forecast-title">7-Day Forecast</h3>
          <div className="daily-items">
            {forecastday.map((day, index) => (
              <div key={index} className="daily-item">
                <div className="day-name">
                  {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short' 
                  })}
                </div>
                <div className="day-icon">
                  {getWeatherEmoji(day.day.condition.code)}
                </div>
                <div className="day-temps">
                  <span className="temp-high">{formatTemp(day.day.maxtemp_c)}°</span>
                  <span className="temp-low">{formatTemp(day.day.mintemp_c)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
