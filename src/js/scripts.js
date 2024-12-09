// Cette ligne définit la clé API pour accéder au service WeatherAPI. Vous devrez remplacer cette clé par votre propre clé lorsque vous utiliserez WeatherAPI dans vos projets.
const API_KEY = '8338cecf4255464fb72101804242711';

const cityNameElement = document.getElementById('city-name');
const dateTimeElement = document.getElementById('date-time');
const weatherConditionElement = document.getElementById('weather-condition');
const weatherIconElement = document.getElementById('weather-icon-img');
const weatherFeels = document.getElementById('weather-feels');
const weatherMin = document.getElementById('weather-min');
const weatherMax = document.getElementById('weather-max');
const weatherWind = document.getElementById('weather-wind');
const weatherUV = document.getElementById('weather-uv');
const weatherVisibility = document.getElementById('weather-visibility');
const weatherHumidity = document.getElementById('weather-humidity');
const searchForm = document.querySelector('form');
const searchInput = document.getElementById('search-input');

// Cette fonction utilise l'API Fetch pour demander des données météorologiques pour une ville spécifique. Elle gère la réponse et met à jour l'affichage ou affiche un message d'erreur.
function fetchWeatherForCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=14`)
        .then(response => response.json())
        .then(data => {
            if (data.location && data.current) {
                updateWeatherDisplay(data);
                fetchSunriseSunset(city); // Récupérer les heures de lever et coucher du soleil
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données:", error);
            cityNameElement.textContent = "City not found";
        });
}

// Cette fonction met à jour le DOM avec les données météorologiques récupérées, y compris le nom de la ville et l'icône météo.
function updateWeatherDisplay(data) {
    cityNameElement.textContent = `${data.location.name}, ${data.location.country}`;
    weatherIconElement.src = `https:${data.current.condition.icon}`;
    weatherIconElement.alt = data.current.condition.text;
    weatherConditionElement.textContent = data.current.condition.text;
    weatherFeels.textContent = `Feels like ${data.current.feelslike_c}°C`;
    weatherMin.textContent = `/${data.forecast.forecastday[0].day.mintemp_c}°C`;
    weatherMax.textContent = `${data.forecast.forecastday[0].day.maxtemp_c}°C`;
    weatherWind.textContent = `${data.current.wind_kph}`;
    weatherUV.textContent = `${data.current.uv}`;
    weatherVisibility.textContent = `${data.current.cloud} `;
    weatherHumidity.textContent = `${data.current.humidity}`;
    displayForecast(data);
}

// Cette fonction met à jour l'affichage de la date et de l'heure. Vous pouvez personnaliser le format selon vos besoins.
function updateDateTime() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    dateTimeElement.textContent = `${day}/${month}/${year}`;
}

// Cette fonction tente d'obtenir la localisation de l'utilisateur et de récupérer les données météorologiques pour celle-ci. Si la géolocalisation échoue ou n'est pas prise en charge, elle affiche par défaut la météo pour Manchester.
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

// Ce code ajoute un écouteur d'événements de soumission au formulaire de recherche, permettant aux utilisateurs de rechercher la météo dans différentes villes.
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
        fetchWeatherForCity(city);
    }
});

// Ce code garantit que les données météorologiques sont récupérées et affichées lorsque la page se charge.
document.addEventListener('DOMContentLoaded', () => {
    getLocationAndDisplayWeather();
    searchInput.value = '';
    window.scrollTo(0, 0);
});

// Récupérer le jour actuel et l'afficher 
let jourElement = document.getElementById('jourDeLaSemaine');
const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
let aujourdHui = new Date();
let jourIndex = aujourdHui.getDay();
jourElement.textContent = jours[jourIndex];

// Pour 14 jours de prévisions
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Effacer le contenu précédent

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const dayIndex = date.getDay();

        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day', 'bg-slate-700', 'p-2', 'rounded-xl', 'text-center', 'min-w-16', 'text-white');
        dayElement.innerHTML = `
            <p class="border-b-2">${days[dayIndex]}</p>
            <img class="py-2" src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.avgtemp_c}°C</p>
        `;
        forecastContainer.appendChild(dayElement);
    });
}

// Fonction pour récupérer les heures de lever et de coucher du soleil
function fetchSunriseSunset(city) {
    fetch(`http://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${city}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }
            return response.json();
        })
        .then(data => {
            if (data.astronomy && data.astronomy.astro) {
                const sunrise = data.astronomy.astro.sunrise;
                const sunset = data.astronomy.astro.sunset;
                updateSunriseSunsetDisplay(sunrise, sunset);
            } else {
                console.error("Données d'astronomie non trouvées");
            }
        })
        .catch(error => {
            console.error("Erreur:", error);
        });
}

// Fonction pour mettre à jour l'affichage des heures de lever et de coucher du soleil
function updateSunriseSunsetDisplay(sunrise, sunset) {
    const sunriseElement = document.getElementById('sunrise');
    const sunsetElement = document.getElementById('sunset');

    sunriseElement.textContent = `${sunrise}`;
    sunsetElement.textContent = `${sunset}`;
}
