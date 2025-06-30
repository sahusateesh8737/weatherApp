# Live Weather App 🌤️

A beautiful and responsive React weather application that provides real-time weather information for any city or your current location using WeatherAPI.

## Features

- 🔍 **City Search**: Input any city name to get weather information
- 📍 **Auto Location**: Automatically detect and display weather for your current location
- 🌡️ **Current Weather**: Real-time temperature, humidity, wind speed, pressure, and visibility
- ⏰ **Hourly Forecast**: Next 24 hours weather prediction
- 📅 **7-Day Forecast**: Weekly weather outlook
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Enhanced API**: Uses WeatherAPI for comprehensive weather data
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- 🌈 **Dynamic Backgrounds**: 
  - ☀️ **Sunny**: Glowing sun animation from corner
  - ☁️ **Cloudy**: Floating clouds with realistic movement
  - 🌧️ **Rainy**: Dark storm clouds with animated raindrops and subtle lightning effects
  - ❄️ **Snowy**: Falling snowflakes with gentle animation
  - ⛈️ **Thunderstorm**: Dark stormy atmosphere
  - 🌫️ **Foggy**: Misty atmospheric effects
  - ☀️ Glowing sun animation for sunny weather
  - ☁️ Floating clouds for cloudy conditions  
  - 🌧️ Animated raindrops for rainy weather
  - ❄️ Falling snowflakes for snowy conditions
  - ⚡ Lightning effects for thunderstorms
- ⏱️ **Loading States**: Visual feedback during data fetching
- 🔒 **Privacy Focused**: Location access is optional and only used when requested

## Technologies Used

- **React 18** - Frontend framework
- **React Hooks** - useState, useEffect, useCallback for state management
- **Geolocation API** - Browser's built-in location detection
- **Async/Await** - For handling API calls and Promise.all for parallel requests
- **CSS3** - Modern styling with glassmorphism effects and CSS animations
- **WeatherAPI** - Comprehensive weather data source with current and forecast data

## Concepts Demonstrated

- ✅ **Geolocation Integration** - Using browser's Geolocation API
- ✅ **API Integration** - Fetching data from external REST API
- ✅ **React useEffect** - Side effects and component lifecycle
- ✅ **Async/Await** - Asynchronous JavaScript programming
- ✅ **State Management** - Managing component state with React hooks
- ✅ **Error Handling** - Proper error handling for API failures
- ✅ **CSS Animations** - Dynamic background animations based on weather conditions
- ✅ **Responsive Design** - Mobile-first approach

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- OpenWeather API key

### Installation

1. **Clone or download the project**
   ```bash
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get WeatherAPI Key**
   - Visit [WeatherAPI.com](https://www.weatherapi.com/)
   - Sign up for a free account
   - Generate an API key

4. **Configure API Key**
   - Open `src/App.js`
   - The API key is already configured: `28ccfd75196e42ca90081251242207`
   - **Note**: WeatherAPI offers a generous free tier with current weather and forecasts

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open the app**
   - The app will open automatically at `http://localhost:3000`
   - If it doesn't open automatically, visit the URL in your browser

## Project Structure

```
weather-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── WeatherCard.js      # Main weather display component
│   │   ├── WeatherCard.css
│   │   ├── SearchBox.js        # City search input component
│   │   ├── SearchBox.css
│   │   ├── LoadingSpinner.js   # Loading animation component
│   │   └── LoadingSpinner.css
│   ├── App.js                  # Main application component
│   ├── App.css
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## How It Works

1. **Component Structure**: The app uses a modular component structure with separate components for search, weather display, and loading states.

2. **Single API Integration**: 
   - Uses WeatherAPI to fetch both current weather and forecast data in parallel
   - Simpler API structure compared to OpenWeather

3. **State Management**: React hooks manage application state including weather data, loading states, and error handling.

4. **Async Operations**: Implements async/await pattern with Promise.all for parallel API calls.

5. **Enhanced Data**: Displays current weather, hourly forecasts (24 hours), and daily forecasts (7 days).

## API Endpoints Used

- **Current Weather**: `http://api.weatherapi.com/v1/current.json`
  - Parameters: key (API key), q (city name), aqi (air quality - no)
  - Returns: Current weather conditions for the specified city

- **Forecast API**: `http://api.weatherapi.com/v1/forecast.json`
  - Parameters: key (API key), q (city name), days (7), aqi (no), alerts (no)
  - Returns: Weather forecast including hourly data for multiple days

**Note**: WeatherAPI offers a generous free tier that includes current weather and forecasts.

## Error Handling

The app handles various error scenarios:
- Invalid city names (404 errors)
- Invalid API keys (401 errors)
- Network connectivity issues
- Empty search inputs

## Responsive Design

The application is fully responsive and includes:
- Mobile-first CSS approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized typography for different screen sizes

## Future Enhancements

Potential improvements for the app:
- 5-day weather forecast
- Geolocation-based weather
- Weather history and charts
- Multiple city comparison
- Weather alerts and notifications
- Dark/light theme toggle

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.
