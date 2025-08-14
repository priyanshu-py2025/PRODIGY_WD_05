class WeatherApp {
    constructor() {
        this.apiKey = 'db4875d37161f44de6e50a68a7d4c82f';
        this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.init();
    }

    init() {
        this.locationInput = document.getElementById('locationInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.currentLocationBtn = document.getElementById('currentLocationBtn');
        this.weatherContainer = document.getElementById('weatherContainer');
        this.loading = document.getElementById('loading');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.error = document.getElementById('error');

        this.bindEvents();
        this.showMessage('Enter a city name or use your current location to get weather data.');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchByCity());
        this.currentLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchByCity();
            }
        });
    }

    async searchByCity() {
        const city = this.locationInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name.');
            return;
        }

        this.showLoading();
        try {
            const weatherData = await this.fetchWeatherByCity(city);
            this.displayWeather(weatherData);
        } catch (error) {
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const weatherData = await this.fetchWeatherByCoords(latitude, longitude);
                    this.displayWeather(weatherData);
                } catch (error) {
                    this.showError('Unable to fetch weather data for your location.');
                }
            },
            () => {
                this.showError('Unable to retrieve your location. Please enter a city manually.');
            }
        );
    }

    async fetchWeatherByCity(city) {
        const response = await fetch(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=en`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            throw new Error(errorData.message || 'Weather data not found');
        }
        return await response.json();
    }

    async fetchWeatherByCoords(lat, lon) {
        const response = await fetch(`${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=en`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            throw new Error(errorData.message || 'Weather data not found');
        }
        return await response.json();
    }

    displayWeather(data) {
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('country').textContent = data.sys.country;
        document.getElementById('temp').textContent = Math.round(data.main.temp);
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('windSpeed').textContent = data.wind.speed;
        document.getElementById('pressure').textContent = data.main.pressure;
        

        document.getElementById('visibility').textContent = 
            data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';
        
        
        document.getElementById('uvIndex').textContent = 'N/A';

        
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;

        this.showWeatherInfo();
        
        
        console.log('Weather data:', data);
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.weatherInfo.style.display = 'none';
        this.error.style.display = 'none';
    }

    showWeatherInfo() {
        this.loading.style.display = 'none';
        this.weatherInfo.style.display = 'block';
        this.error.style.display = 'none';
    }

    showError(message) {
        this.loading.style.display = 'none';
        this.weatherInfo.style.display = 'none';
        this.error.style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    showMessage(message) {
        this.loading.style.display = 'block';
        this.weatherInfo.style.display = 'none';
        this.error.style.display = 'none';
        document.getElementById('loading').textContent = message;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});