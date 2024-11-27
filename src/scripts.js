const API_KEY = '8338cecf4255464fb72101804242711';
const cityNameElement = document.getElementById('city-name');
const dateTimeElement = document.getElementById('date-time');
const weatherIconElement = document.getElementById('weather-icon-img');
const searchForm = document.querySelector('form');
const searchInput = document.getElementById('search-input');

function fetchWeatherForCity(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.location && data.current) {
                updateWeatherDisplay(data);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données:", error);
            cityNameElement.textContent = "Ville non trouvée";
        });
}

function updateWeatherDisplay(data) {
    cityNameElement.textContent = data.location.name;
    weatherIconElement.src = `https:${data.current.condition.icon}`;
    weatherIconElement.alt = data.current.condition.text;
    updateDateTime();
}

function updateDateTime() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    const hours = now.getHours().toString().padStart(2, '0');
    dateTimeElement.textContent = `${day}/${month}/${year} - ${hours}:00`;
}

function getLocationAndDisplayWeather() {
    // Afficher Manchester par défaut immédiatement
    fetchWeatherForCity('Manchester');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherForCity(`${latitude},${longitude}`);
            },
            error => {
                console.error("Erreur de géolocalisation:", error);
                // Manchester est déjà affiché, pas besoin de faire quoi que ce soit ici
            }
        );
    } else {
        console.log("Géolocalisation non supportée");
        // Manchester est déjà affiché, pas besoin de faire quoi que ce soit ici
    }
}

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        fetchWeatherForCity(city);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    getLocationAndDisplayWeather();
});
