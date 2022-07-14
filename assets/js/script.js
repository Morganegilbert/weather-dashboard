var resultList = document.getElementById('results');
var fetchButton = document.getElementById('fetch-button');
var apiKey = 'ed329abd942d01f3c302c755d746f0d1';
var searchInput = document.getElementsByClassName('search-results');
var fiveDayForcastDiv = document.getElementById('five-day-forcast');
const currentDay = moment().format("MM/DD/YYYY");
// var oneDayFuture =  moment(currentDay.add(1, 'days').toDate());
// oneDayFuture.setDate(oneDayFuture.getDate() + 1);
// console.log("this is one day ahead", oneDayFuture);
var oneDayFuture = moment().add(1, 'days').format("MM/DD/YYYY");
var twoDayFuture = moment().add(1, 'days').format("MM/DD/YYYY");
var threeDayFuture = moment().add(1, 'days').format("MM/DD/YYYY");
var fourDayFuture = moment().add(1, 'days').format("MM/DD/YYYY");
var fiveDayFuture = moment().add(1, 'days').format("MM/DD/YYYY");

console.log("one day ahead", oneDayFuture);

// async function 

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

    // Fetches city results for current forcast
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

    // Fetches city results for future five days
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
    resultCityHeader.textContent = cityName + " " + currentDay;
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
async function displayfiveDayForcast(data, cityName, currentDay) {
    // Five Day Forcast Results

    // Results one day ahead
    var oneDayResults = {
        clouds: data.list[1].weather.description,
        temp: data.list[1].main.temp,
        wind: data.list[1].wind.speed,
        humidity: data.list[1].main.humidity,
    }
    // var oneDayFuture = moment(currentDay).add(1, 'days');

    // Adds new elements
    let fiveDayResultsSection = document.createElement('div');
    let dayOne = document.createElement('div');
    let oneDayResultsHeader = document.createElement('h3');

    // Assigns IDs to elements, appends days to day section div
    fiveDayResultsSection.id = 'five-day-results-section';
    dayOne.id = 'day-one';
    oneDayResultsHeader.id = 'one-day-header';
    oneDayResultsHeader.textContent = cityName + oneDayFuture;
    dayOne.appendChild(oneDayResultsHeader);

    // Additional elements
    let newListOneUl = document.createElement('ul');
    let newListItemOneClouds =  document.createElement('ol');
    let newListItemOneTemp =  document.createElement('ol');
    let newListItemOneWind =  document.createElement('ol');   
    let newListItemOneHumidity =  document.createElement('ol');

    // Assigns IDs
    newListItemOneClouds.id = 'results-one-clouds';
    newListItemOneTemp.id = 'results-one-temp';
    newListItemOneWind.id = 'results-one-wind';
    newListItemOneHumidity.id = 'results-one-humidity';

    // Assigns inner text with data
    newListItemOneClouds.textContent = oneDayResults.clouds;
    newListItemOneTemp.textContent = 'Temp: ' + oneDayResults.temp;
    newListItemOneWind.textContent = 'Wind: ' + oneDayResults.wind;
    newListItemOneHumidity.textContent = 'Humidity: ' + oneDayResults.humidity;

    // Appends Children
    newListOneUl.appendChild(newListItemOneClouds);
    newListOneUl.appendChild(newListItemOneTemp);
    newListOneUl.appendChild(newListItemOneWind);
    newListOneUl.appendChild(newListItemOneHumidity);
    dayOne.appendChild(newListOneUl);
    fiveDayResultsSection.appendChild(dayOne);

    // Results 2 Days ahead
    var twoDayResults = {
        clouds: data.list[2].weather.description,
        temp: data.list[2].main.temp,
        wind: data.list[2].wind.speed,
        humidity: data.list[2].main.humidity,
    }

    // Adds new elements
    let dayTwo = document.createElement('div');
    let twoDayResultsHeader = document.createElement('h3');

    // Assigns IDs to elements, appends days to day section div
    dayTwo.id = 'day-two';
    twoDayResultsHeader.id = 'two-day-header';
    twoDayResultsHeader.textContent = cityName + twoDayFuture;
    dayTwo.appendChild(twoDayResultsHeader);

    // Additional elements
    let newListTwoUl = document.createElement('ul');
    let newListItemTwoClouds =  document.createElement('ol');
    let newListItemTwoTemp =  document.createElement('ol');
    let newListItemTwoWind =  document.createElement('ol');   
    let newListItemTwoHumidity =  document.createElement('ol');

    // Assigns IDs
    newListItemTwoClouds.id = 'results-two-clouds';
    newListItemTwoTemp.id = 'results-two-temp';
    newListItemTwoWind.id = 'results-two-wind';
    newListItemTwoHumidity.id = 'results-two-humidity';

    // Assigns inner text with data
    newListItemTwoClouds.textContent = twoDayResults.clouds;
    newListItemTwoTemp.textContent = 'Temp: ' + twoDayResults.temp;
    newListItemTwoWind.textContent = 'Wind: ' + twoDayResults.wind;
    newListItemTwoHumidity.textContent = 'Humidity: ' + twoDayResults.humidity;

    // Appends Children
    newListTwoUl.appendChild(newListItemTwoClouds);
    newListTwoUl.appendChild(newListItemTwoTemp);
    newListTwoUl.appendChild(newListItemTwoWind);
    newListTwoUl.appendChild(newListItemTwoHumidity);
    dayTwo.appendChild(newListTwoUl);
    fiveDayResultsSection.appendChild(dayTwo);

    // Results 3 Days ahead
    var threeDayResults = {
        clouds: data.list[3].weather.description,
        temp: data.list[3].main.temp,
        wind: data.list[3].wind.speed,
        humidity: data.list[3].main.humidity,
    }

    // Adds new elements
    let dayThree = document.createElement('div');
    let threeDayResultsHeader = document.createElement('h3');

    // Assigns IDs to elements, appends days to day section div
    dayThree.id = 'day-three';
    threeDayResultsHeader.id = 'three-day-header';
    threeDayResultsHeader.textContent = cityName + threeDayFuture;
    dayThree.appendChild(threeDayResultsHeader);

    // Additional elements
    let newListThreeUl = document.createElement('ul');
    let newListItemThreeClouds =  document.createElement('ol');
    let newListItemThreeTemp =  document.createElement('ol');
    let newListItemThreeWind =  document.createElement('ol');   
    let newListItemThreeHumidity =  document.createElement('ol');

    // Assigns IDs
    newListItemThreeClouds.id = 'results-three-clouds';
    newListItemThreeTemp.id = 'results-three-temp';
    newListItemThreeWind.id = 'results-three-wind';
    newListItemThreeHumidity.id = 'results-three-humidity';

    // Assigns inner text with data
    newListItemThreeClouds.textContent = threeDayResults.clouds;
    newListItemThreeTemp.textContent = 'Temp: ' + threeDayResults.temp;
    newListItemThreeWind.textContent = 'Wind: ' + threeDayResults.wind;
    newListItemThreeHumidity.textContent = 'Humidity: ' + threeDayResults.humidity;

    // Appends Children
    newListThreeUl.appendChild(newListItemThreeClouds);
    newListThreeUl.appendChild(newListItemThreeTemp);
    newListThreeUl.appendChild(newListItemThreeWind);
    newListThreeUl.appendChild(newListItemThreeHumidity);
    dayThree.appendChild(newListThreeUl);
    fiveDayResultsSection.appendChild(dayThree);

    // Results 4 Days ahead
    var fourDayResults = {
        clouds: data.list[4].weather.description,
        temp: data.list[4].main.temp,
        wind: data.list[4].wind.speed,
        humidity: data.list[4].main.humidity,
    }

    // Adds new elements
    let dayFour = document.createElement('div');
    let fourDayResultsHeader = document.createElement('h3');

    // Assigns IDs to elements, appends days to day section div
    dayFour.id = 'day-four';
    fourDayResultsHeader.id = 'four-day-header';
    fourDayResultsHeader.textContent = cityName + fourDayFuture;
    dayFour.appendChild(fourDayResultsHeader);

    // Additional elements
    let newListFourUl = document.createElement('ul');
    let newListItemFourClouds =  document.createElement('ol');
    let newListItemFourTemp =  document.createElement('ol');
    let newListItemFourWind =  document.createElement('ol');   
    let newListItemFourHumidity =  document.createElement('ol');

    // Assigns IDs
    newListItemFourClouds.id = 'results-four-clouds';
    newListItemFourTemp.id = 'results-four-temp';
    newListItemFourWind.id = 'results-four-wind';
    newListItemFourHumidity.id = 'results-four-humidity';

    // Assigns inner text with data
    newListItemFourClouds.textContent = fourDayResults.clouds;
    newListItemFourTemp.textContent = 'Temp: ' + fourDayResults.temp;
    newListItemFourWind.textContent = 'Wind: ' + fourDayResults.wind;
    newListItemFourHumidity.textContent = 'Humidity: ' + fourDayResults.humidity;

    // Appends Children
    newListFourUl.appendChild(newListItemFourClouds);
    newListFourUl.appendChild(newListItemFourTemp);
    newListFourUl.appendChild(newListItemFourWind);
    newListFourUl.appendChild(newListItemFourHumidity);
    dayFour.appendChild(newListFourUl);
    fiveDayResultsSection.appendChild(dayFour);

    // Results 5 Days ahead
    var fiveDayResults = {
        clouds: data.list[3].weather.description,
        temp: data.list[3].main.temp,
        wind: data.list[3].wind.speed,
        humidity: data.list[3].main.humidity,
    }

    // Adds new elements
    let dayFive = document.createElement('div');
    let fiveDayResultsHeader = document.createElement('h3');

    // Assigns IDs to elements, appends days to day section div
    dayFive.id = 'day-five';
    fiveDayResultsHeader.id = 'five-day-header';
    fiveDayResultsHeader.textContent = cityName + fiveDayFuture;
    dayFive.appendChild(fiveDayResultsHeader);

    // Additional elements
    let newListFiveUl = document.createElement('ul');
    let newListItemFiveClouds =  document.createElement('ol');
    let newListItemFiveTemp =  document.createElement('ol');
    let newListItemFiveWind =  document.createElement('ol');   
    let newListItemFiveHumidity =  document.createElement('ol');

    // Assigns IDs
    newListItemFiveClouds.id = 'results-five-clouds';
    newListItemFiveTemp.id = 'results-five-temp';
    newListItemFiveWind.id = 'results-five-wind';
    newListItemFiveHumidity.id = 'results-five-humidity';

    // Assigns inner text with data
    newListItemFiveClouds.textContent = fiveDayResults.clouds;
    newListItemFiveTemp.textContent = 'Temp: ' + fiveDayResults.temp;
    newListItemFiveWind.textContent = 'Wind: ' + fiveDayResults.wind;
    newListItemFiveHumidity.textContent = 'Humidity: ' + fiveDayResults.humidity;

    // Appends Children
    newListFiveUl.appendChild(newListItemFiveClouds);
    newListFiveUl.appendChild(newListItemFiveTemp);
    newListFiveUl.appendChild(newListItemFiveWind);
    newListFiveUl.appendChild(newListItemFiveHumidity);
    dayFive.appendChild(newListFiveUl);
    fiveDayResultsSection.appendChild(dayFive);

    // Changes html to javascript html
    fiveDayForcastDiv.innerHTML = fiveDayResultsSection.innerHTML;
}