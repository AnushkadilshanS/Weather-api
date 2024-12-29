const apiKey = '2a330da39cc8e358ff73fcd6c9512633'; // Replace with your actual API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const forecastContainer = document.getElementById('forecastContainer');
const convertButton = document.getElementById('convertButton'); // Add reference to convert button
const fahrenheitOutput = document.getElementById('fahrenheitOutput'); // Reference for output

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
        fetchForecast(location);
    } else {
        alert("Please enter a location.");
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            locationElement.textContent = '';
            temperatureElement.textContent = '';
            descriptionElement.textContent = 'Error fetching weather data. Please try again.';
        });
}

function fetchForecast(location) {
    const url = `${forecastUrl}?q=${location}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not found');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            forecastContainer.innerHTML = 'Error fetching forecast data. Please try again.';
        });
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = ''; // Clear previous forecasts
    const forecastDays = {};

    // Grouping forecast data by date
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!forecastDays[date]) {
            forecastDays[date] = [];
        }
        forecastDays[date].push({
            temp: Math.round(item.main.temp),
            description: item.weather[0].description
        });
    });

    const dates = Object.keys(forecastDays).slice(0, 4); // Get only the first 4 days
    dates.forEach(date => {
        const dayForecast = forecastDays[date][0]; // Take the first entry for the day
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-day');
        forecastElement.innerHTML = `
            <strong>${date}</strong><br>
            Temp: ${dayForecast.temp}°C<br>
            ${dayForecast.description}
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

convertButton.addEventListener("click", function() {
    const temperatureText = temperatureElement.innerText;
    
    // Extract the temperature value from the text (assuming it's in °C)
    const celsiusMatch = temperatureText.match(/(-?\d+(\.\d+)?)°C/);
    
    if (celsiusMatch) {
        const celsius = parseFloat(celsiusMatch[1]);
        const fahrenheit = (celsius * 9 / 5) + 32;
        fahrenheitOutput.innerText = `Temperature in Fahrenheit: ${fahrenheit.toFixed(2)}°F`;
    } else {
        fahrenheitOutput.innerText = "Temperature not available for conversion.";
    }
});
