var resultList = document.getElementById('results');
var fetchButton = document.getElementById('fetch-button');
var apiKey = 'ed329abd942d01f3c302c755d746f0d1';
var searchInput = document.getElementsByClassName('search-results');
var fiveDayForcastDiv = document.getElementById('five-day-forcast');



async function getApi(cityName) {
    // var cityName = '';
    var geolocatingURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=8&appid=' + apiKey;
    reverseGeolocatingURL = 'http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=' + apiKey;
    console.log('This is location URL', geolocatingURL);

    // Changes lat/lon based on city provided
    let locationData = await getLocationData(geolocatingURL);
    var lat = locationData[0].lat;
    var lon = locationData[0].lon;

    var cityResultURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    console.log("Result", cityResultURL);
    let forcastData = await getLocationData(cityResultURL);
    
    var fiveDayUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon +'&appid=' + apiKey;

    let fiveDayForcast = await getLocationData(fiveDayUrl);
    console.log("5-day forcast", fiveDayUrl);
    
    console.log("forcast", forcastData);
    console.log('location data', locationData[0].lat);
    console.log('location lat', lat);
    console.log('location lon', lon);

    // Displays city results for current forcast
    // await cityResultDisplay(cityName, 'temp', 'wind_speed', 'humidity', 'uvi');

    fetch(cityResultURL)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network error")
        }
    })
    .then((data) => {
        console.log("this is data?", data);
        displayResultsList(forcastData, cityName, cityResultURL);
    });

    fetch(fiveDayUrl)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network error")
        }
    })
    .then((data) => {
        console.log("this is five day?", data);
        displayfiveDayForcast(fiveDayForcast, cityName, fiveDayUrl);
    });

    // Displays five day forcast
    // await fiveDayForcastDisplay();

    // Displays past search results
    // await pastResultDisplay();
}

// Pulls geolocation data
async function getLocationData(URL) {
    try {
        let res = await fetch(URL);
        console.log('res', res.json);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}



// Starts search
fetchButton.onclick = function getCity(event) {
    event.preventDefault();
    var cityName = document.getElementById("search-results").value;
    let pastResults = JSON.parse(localStorage.getItem('cityName') || "[]");
    pastResults.push({city:cityName}); 
    console.log("this is form", cityName);
    getApi(cityName);
}

// Displays current results for City
async function displayResultsList(data, cityName) {
    var searchResults = {
        temp: data.current.temp,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        uvIndex: data.current.uvi,
    }

    let resultCitySearch = document.createElement('div');
    let resultCityHeader = document.createElement('h2');
    resultCitySearch.id = 'search-results';
    resultCityHeader.id = 'result-city-name';
    resultCityHeader.textContent = cityName;
    resultCitySearch.appendChild(resultCityHeader);

    // Adds new elements
    let newListUl = document.createElement('ul');
    let newListItemTemp =  document.createElement('ol');
    let newListItemWind =  document.createElement('ol');
    let newListItemHumidity =  document.createElement('ol');
    let newListItemUVIndex =  document.createElement('ol');
    let humidityDiv = document.createElement ('div');

    // Assigns IDs
    newListItemTemp.id = 'results-temp';
    newListItemWind.id = 'results-wind';
    newListItemHumidity.id = 'results-humidity';
    newListItemUVIndex.id = 'results-uv-Index';
    humidityDiv.id = 'humidity-div'

    // Assigns inner text with data
    newListItemTemp.textContent = 'Temp: ' + searchResults.temp;
    newListItemWind.textContent = 'Wind: ' + searchResults.wind;
    newListItemHumidity.textContent = 'Humidity: ';
    newListItemUVIndex.textContent = 'UV Index: ' + searchResults.uvIndex;
    humidityDiv.textContent = searchResults.humidity;

    // Appends Children
    newListItemHumidity.appendChild(humidityDiv);
    newListUl.appendChild(newListItemTemp);
    newListUl.appendChild(newListItemWind);
    newListUl.appendChild(newListItemHumidity);
    newListUl.appendChild(newListItemUVIndex);
    resultCitySearch.appendChild(newListUl);
    
    // Changes html to javascript html
    resultList.innerHTML = resultCitySearch.innerHTML;
}

// Displays Five Day Forcast
async function displayfiveDayForcast(data, cityName) {
    // Five Day Forcast Results
    var fiveDayResults = {
        clouds: data.list[0].weather.description,
        temp: data.list[0].main.temp,
        wind: data.list[0].wind.speed,
        humidity: data.list[0].main.humidity,
    }

    // Adds new elements
    let fiveDayResultsSection = document.createElement('div');
    let dayOne = document.createElement('div');
    let fiveDayResultsHeader = document.createElement('h2');

    // Assigns IDs to elements, appends days to day section div
    fiveDayResultsSection.id = 'five-day-results-section';
    dayOne.id = 'day-one';
    fiveDayResultsHeader.id = 'five-day-header';
    fiveDayResultsHeader.textContent = cityName;
    dayOne.appendChild(fiveDayResultsHeader);

    // Additional elements
    let newFiveListUl = document.createElement('ul');
    let newListItemClouds =  document.createElement('ol');
    let newListItemFiveTemp =  document.createElement('ol');
    let newListItemFiveWind =  document.createElement('ol');   
    let newListItemFiveHumidity =  document.createElement('ol');

    // Assigns IDs
    newListItemClouds.id = 'results-five-clouds';
    newListItemFiveTemp.id = 'results-five-temp';
    newListItemFiveWind.id = 'results-five-wind';
    newListItemFiveHumidity.id = 'results-five-humidity';

    // Assigns inner text with data
    newListItemClouds.textContent = fiveDayResults.clouds;
    newListItemFiveTemp.textContent = 'Temp: ' + fiveDayResults.temp;
    newListItemFiveWind.textContent = 'Wind: ' + fiveDayResults.wind;
    newListItemFiveHumidity.textContent = 'Humidity: ' + fiveDayResults.humidity;

    // Appends Children
    newFiveListUl.appendChild(newListItemClouds);
    newFiveListUl.appendChild(newListItemFiveTemp);
    newFiveListUl.appendChild(newListItemFiveWind);
    newFiveListUl.appendChild(newListItemFiveHumidity);
    dayOne.appendChild(newFiveListUl);
    fiveDayResultsSection.appendChild(dayOne);
    
    // Changes html to javascript html
    fiveDayForcastDiv.innerHTML = fiveDayResultsSection.innerHTML;
}