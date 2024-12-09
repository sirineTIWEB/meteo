// Cette ligne définit la clé API pour accéder au service WeatherAPI. Vous devrez remplacer cette clé par votre propre clé lorsque vous utiliserez WeatherAPI dans vos projets.
const API_KEY = '8338cecf4255464fb72101804242711';

const cityNameElement = document.getElementById('city-name');
const dateTimeElement = document.getElementById('date-time');
const weatherConditionElement = document.getElementById('weather-condition');
const weatherIconElement = document.getElementById('weather-icon-img');
const weatherFeels = document.getElementById('weather-feels');
const weatherMin = document.getElementById('weather-min');
const weatherMax = document.getElementById('weather-max');
const searchForm = document.querySelector('form');
const searchInput = document.getElementById('search-input');

// Cette fonction utilise l'API Fetch pour demander des données météorologiques pour une ville spécifique. Elle gère la réponse et met à jour l'affichage ou affiche un message d'erreur.
function fetchWeatherForCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.location && data.current) {
                updateWeatherDisplay(data);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données:", error);
            cityNameElement.textContent = "City not found";
        });
}


// Cette fonction met à jour le DOM avec les données météorologiques récupérées, y compris le nom de la ville et l'icône météo.
function updateWeatherDisplay(data) {
    cityNameElement.textContent = ` ${data.location.name}, ${data.location.country}`;
    weatherIconElement.src = `https:${data.current.condition.icon}`;
    weatherIconElement.alt = data.current.condition.text;
    weatherConditionElement.textContent = data.current.condition.text;
    weatherFeels.textContent = `feels like ${data.current.feelslike_c}°C`;
    weatherMin.textContent = `/${data.forecast.forecastday[0].day.mintemp_c}°C`;
    weatherMax.textContent = `${data.forecast.forecastday[0].day.maxtemp_c}°C`;
    updateDateTime();
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
});

//récupérer le jour actuel et l'afficher 
let jourElement = document.getElementById('jourDeLaSemaine');
const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
// Obtenir la date actuelle
let aujourdHui = new Date();
// Récupérer le jour de la semaine (0 pour dimanche, 1 pour lundi, etc.)
let jourIndex = aujourdHui.getDay();
// Afficher le jour correspondant dans l'élément HTML
jourElement.textContent = jours[jourIndex];

