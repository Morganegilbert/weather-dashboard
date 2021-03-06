var resultList = document.getElementById('results');
var fetchButton = document.getElementById('fetch-button');
var apiKey = 'ed329abd942d01f3c302c755d746f0d1';
var searchInput = document.getElementsByClassName('search-results');
var fiveDayForcastDiv = document.getElementById('five-day-forcast');
var pastSearch = document.getElementById('past-search');

// Day variables
const currentDay = moment().format("MM/DD/YYYY");
var oneDayFuture = moment().add(1, 'days').format("MM/DD/YYYY");
var twoDayFuture = moment().add(2, 'days').format("MM/DD/YYYY");
var threeDayFuture = moment().add(3, 'days').format("MM/DD/YYYY");
var fourDayFuture = moment().add(4, 'days').format("MM/DD/YYYY");
var fiveDayFuture = moment().add(5, 'days').format("MM/DD/YYYY");

async function getApi(cityName) {
    // var cityName = '';
    var geolocatingURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=8&appid=' + apiKey;
    reverseGeolocatingURL = 'https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=' + apiKey;

    // Changes lat/lon based on city provided
    let locationData = await getLocationData(geolocatingURL);
    var lat = locationData[0].lat;
    var lon = locationData[0].lon;

    var cityResultURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    let forcastData = await getLocationData(cityResultURL);
    
    var fiveDayUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon +'&appid=' + apiKey;

    let fiveDayForcast = await getLocationData(fiveDayUrl);

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
        displayfiveDayForcast(fiveDayForcast, cityName, fiveDayUrl);
    });

}

// Pulls geolocation data
async function getLocationData(URL) {
    try {
        let res = await fetch(URL);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Starts search, saves search to local storage
fetchButton.onclick = async function getCity(event) {
    event.preventDefault();
    var cityName = document.getElementById("search-results").value;
    let pastResults = JSON.parse(localStorage.getItem('Search') || "[]");
    if (pastResults.length == 8) {
        pastResults.pop();
    }
    pastResults.unshift({city:cityName}); 

    localStorage.setItem('Search', JSON.stringify(pastResults));

    await getApi(cityName);
    await displayPastSearches(event);
    await assignFunctionality();
}

// Displays current results for City
async function displayResultsList(data, cityName) {
    var searchResults = {
        temp: data.current.temp,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        uvIndex: data.current.uvi,
        clouds: data.current.weather[0].icon,
    }
    
    var iconurl = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";
    
    let resultCitySearch = document.createElement('div');
    let resultCityHeader = document.createElement('h2');
    let weatherIconImg = document.createElement('img');
    weatherIconImg.alt = 'Weather Icon';
    weatherIconImg.src = iconurl;
    resultCitySearch.id = 'search-results';
    resultCityHeader.id = 'result-city-name';
    resultCityHeader.textContent = cityName + " " + currentDay + " ";
    resultCityHeader.appendChild(weatherIconImg);
    resultCitySearch.appendChild(resultCityHeader);

    // Adds new elements
    let newListUl = document.createElement('ul');
    let newListItemTemp =  document.createElement('ol');
    let newListItemWind =  document.createElement('ol');
    let newListItemHumidity =  document.createElement('ol');
    let newListItemUVIndex =  document.createElement('ol');
    let uvDiv = document.createElement ('div');

    // Assigns IDs
    newListItemTemp.id = 'results-temp';
    newListItemWind.id = 'results-wind';
    newListItemHumidity.id = 'results-humidity';
    newListItemUVIndex.id = 'results-uv-index';
    uvDiv.id = 'uv-div'

    // Converts kelvin to farenheit
    let newListItemTempF = Math.floor((searchResults.temp - 273) * (9/5) +32);

    // Assigns inner text with data
    newListItemTemp.textContent = 'Temp: ' + newListItemTempF + "??F";
    newListItemWind.textContent = 'Wind: ' + searchResults.wind + " MPH";
    newListItemHumidity.textContent = 'Humidity: ' + data.current.humidity + "%";
    newListItemUVIndex.textContent = 'UV Index: ';
    uvDiv.textContent = searchResults.uvIndex;

    // Changes UV color
    if (searchResults.uvIndex >= 0 && searchResults.uvIndex <= 2) {
        uvDiv.style.background = 'green';
    } 
    else if (searchResults.uvIndex >= 6 && searchResults.uvIndex <= 7) {
        uvDiv.style.background = 'orange';
    }
    else if (searchResults.uvIndex >= 8 && searchResults.uvIndex <= 10) {
        uvDiv.style.background = 'red';
    }
    // Appends Children
    newListItemUVIndex.appendChild(uvDiv);
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
        clouds: data.list[1].weather[0].icon,
        temp: data.list[1].main.temp,
        wind: data.list[1].wind.speed,
        humidity: data.list[1].main.humidity,
    }
    var iconOneUrl = "http://openweathermap.org/img/w/" + data.list[1].weather[0].icon + ".png";

    // Adds new elements
    let fiveDayResultsSection = document.createElement('div');
    let dayOne = document.createElement('div');
    let oneDayResultsHeader = document.createElement('h4');

    // Assigns IDs to elements, appends days to day section div
    fiveDayResultsSection.id = 'five-day-results-section';
    dayOne.id = 'day-one';
    oneDayResultsHeader.id = 'one-day-header';
    oneDayResultsHeader.textContent = oneDayFuture;
    dayOne.appendChild(oneDayResultsHeader);

    // Additional elements
    let newListOneUl = document.createElement('ul');
    let newListItemOneClouds =  document.createElement('img');
    let newListItemOneTemp =  document.createElement('ol');
    let newListItemOneWind =  document.createElement('ol');   
    let newListItemOneHumidity =  document.createElement('ol');

    // Adding alt and src to weather icon
    newListItemOneClouds.alt = 'Weather Icon';
    newListItemOneClouds.src = iconOneUrl;
    
    // Assigns IDs
    newListItemOneClouds.id = 'results-one-clouds';
    newListItemOneTemp.id = 'results-one-temp';
    newListItemOneWind.id = 'results-one-wind';
    newListItemOneHumidity.id = 'results-one-humidity';

    // Converts kelvin to farenheit
    let newListItemOneTempF = Math.floor((oneDayResults.temp - 273) * (9/5) +32);

    // Assigns inner text with data
    newListItemOneClouds.textContent = '';
    newListItemOneTemp.textContent = 'Temp: ' + newListItemOneTempF + "??F";
    newListItemOneWind.textContent = 'Wind: ' + oneDayResults.wind + " MPH";
    newListItemOneHumidity.textContent = 'Humidity: ' + oneDayResults.humidity + " %";

    // Appends Children
    newListOneUl.appendChild(newListItemOneClouds);
    newListOneUl.appendChild(newListItemOneTemp);
    newListOneUl.appendChild(newListItemOneWind);
    newListOneUl.appendChild(newListItemOneHumidity);
    dayOne.appendChild(newListOneUl);
    fiveDayResultsSection.appendChild(dayOne);

    // Results 2 Days ahead
    var twoDayResults = {
        clouds: data.list[2].weather[0].icon,
        temp: data.list[2].main.temp,
        wind: data.list[2].wind.speed,
        humidity: data.list[2].main.humidity,
    }
    var iconTwoUrl = "http://openweathermap.org/img/w/" + data.list[2].weather[0].icon + ".png";

    // Adds new elements
    let dayTwo = document.createElement('div');
    let twoDayResultsHeader = document.createElement('h4');

    // Assigns IDs to elements, appends days to day section div
    dayTwo.id = 'day-two';
    twoDayResultsHeader.id = 'two-day-header';
    twoDayResultsHeader.textContent = twoDayFuture;
    dayTwo.appendChild(twoDayResultsHeader);

    // Additional elements
    let newListTwoUl = document.createElement('ul');
    let newListItemTwoClouds =  document.createElement('img');
    let newListItemTwoTemp =  document.createElement('ol');
    let newListItemTwoWind =  document.createElement('ol');   
    let newListItemTwoHumidity =  document.createElement('ol');

    // Adding alt and src to weather icon
    newListItemTwoClouds.alt = 'Weather Icon';
    newListItemTwoClouds.src = iconTwoUrl;

    // Assigns IDs
    newListItemTwoClouds.id = 'results-two-clouds';
    newListItemTwoTemp.id = 'results-two-temp';
    newListItemTwoWind.id = 'results-two-wind';
    newListItemTwoHumidity.id = 'results-two-humidity';

    // Converts kelvin to farenheit
    let newListItemTwoTempF = Math.floor((twoDayResults.temp - 273) * (9/5) +32);

    // Assigns inner text with data
    newListItemTwoClouds.textContent = '';
    newListItemTwoTemp.textContent = 'Temp: ' + newListItemTwoTempF + "??F";
    newListItemTwoWind.textContent = 'Wind: ' + twoDayResults.wind + " MPH";
    newListItemTwoHumidity.textContent = 'Humidity: ' + twoDayResults.humidity + " %";

    // Appends Children
    newListTwoUl.appendChild(newListItemTwoClouds);
    newListTwoUl.appendChild(newListItemTwoTemp);
    newListTwoUl.appendChild(newListItemTwoWind);
    newListTwoUl.appendChild(newListItemTwoHumidity);
    dayTwo.appendChild(newListTwoUl);
    fiveDayResultsSection.appendChild(dayTwo);

    // Results 3 Days ahead
    var threeDayResults = {
        clouds: data.list[3].weather[0].icon,
        temp: data.list[3].main.temp,
        wind: data.list[3].wind.speed,
        humidity: data.list[3].main.humidity,
    }
    var iconThreeUrl = "http://openweathermap.org/img/w/" + data.list[3].weather[0].icon + ".png";

    // Adds new elements
    let dayThree = document.createElement('div');
    let threeDayResultsHeader = document.createElement('h4');

    // Assigns IDs to elements, appends days to day section div
    dayThree.id = 'day-three';
    threeDayResultsHeader.id = 'three-day-header';
    threeDayResultsHeader.textContent = threeDayFuture;
    dayThree.appendChild(threeDayResultsHeader);

    // Additional elements
    let newListThreeUl = document.createElement('ul');
    let newListItemThreeClouds =  document.createElement('img');
    let newListItemThreeTemp =  document.createElement('ol');
    let newListItemThreeWind =  document.createElement('ol');   
    let newListItemThreeHumidity =  document.createElement('ol');

    // Adding alt and src to weather icon
    newListItemThreeClouds.alt = 'Weather Icon';
    newListItemThreeClouds.src = iconThreeUrl;

    // Assigns IDs
    newListItemThreeClouds.id = 'results-three-clouds';
    newListItemThreeTemp.id = 'results-three-temp';
    newListItemThreeWind.id = 'results-three-wind';
    newListItemThreeHumidity.id = 'results-three-humidity';

    // Converts kelvin to farenheit
    let newListItemThreeTempF = Math.floor((threeDayResults.temp - 273) * (9/5) +32);

    // Assigns inner text with data
    newListItemThreeClouds.textContent = '';
    newListItemThreeTemp.textContent = 'Temp: ' + newListItemThreeTempF + "??F";
    newListItemThreeWind.textContent = 'Wind: ' + threeDayResults.wind + " MPH";
    newListItemThreeHumidity.textContent = 'Humidity: ' + threeDayResults.humidity + " %";

    // Appends Children
    newListThreeUl.appendChild(newListItemThreeClouds);
    newListThreeUl.appendChild(newListItemThreeTemp);
    newListThreeUl.appendChild(newListItemThreeWind);
    newListThreeUl.appendChild(newListItemThreeHumidity);
    dayThree.appendChild(newListThreeUl);
    fiveDayResultsSection.appendChild(dayThree);

    // Results 4 Days ahead
    var fourDayResults = {
        clouds: data.list[4].weather[0].icon,
        temp: data.list[4].main.temp,
        wind: data.list[4].wind.speed,
        humidity: data.list[4].main.humidity,
    }

    var iconFourUrl = "http://openweathermap.org/img/w/" + data.list[4].weather[0].icon + ".png";

    // Adds new elements
    let dayFour = document.createElement('div');
    let fourDayResultsHeader = document.createElement('h4');

    // Assigns IDs to elements, appends days to day section div
    dayFour.id = 'day-four';
    fourDayResultsHeader.id = 'four-day-header';
    fourDayResultsHeader.textContent = fourDayFuture;
    dayFour.appendChild(fourDayResultsHeader);

    // Additional elements
    let newListFourUl = document.createElement('ul');
    let newListItemFourClouds =  document.createElement('img');
    let newListItemFourTemp =  document.createElement('ol');
    let newListItemFourWind =  document.createElement('ol');   
    let newListItemFourHumidity =  document.createElement('ol');
    
    // Adding alt and src to weather icon
    newListItemFourClouds.alt = 'Weather Icon';
    newListItemFourClouds.src = iconFourUrl;

    // Assigns IDs
    newListItemFourClouds.id = 'results-four-clouds';
    newListItemFourTemp.id = 'results-four-temp';
    newListItemFourWind.id = 'results-four-wind';
    newListItemFourHumidity.id = 'results-four-humidity';

    // Converts kelvin to farenheit
    let newListItemFourTempF = Math.floor((fourDayResults.temp - 273) * (9/5) +32);

    // Assigns inner text with data
    newListItemFourClouds.textContent = fourDayResults.clouds;
    newListItemFourTemp.textContent = 'Temp: ' + newListItemFourTempF + "??F";
    newListItemFourWind.textContent = 'Wind: ' + fourDayResults.wind + " MPH";
    newListItemFourHumidity.textContent = 'Humidity: ' + fourDayResults.humidity + " %";

    // Appends Children
    newListFourUl.appendChild(newListItemFourClouds);
    newListFourUl.appendChild(newListItemFourTemp);
    newListFourUl.appendChild(newListItemFourWind);
    newListFourUl.appendChild(newListItemFourHumidity);
    dayFour.appendChild(newListFourUl);
    fiveDayResultsSection.appendChild(dayFour);

    // Results 5 Days ahead
    var fiveDayResults = {
        clouds: data.list[5].weather[0].icon,
        temp: data.list[3].main.temp,
        wind: data.list[3].wind.speed,
        humidity: data.list[3].main.humidity,
    }

    var iconFiveUrl = "http://openweathermap.org/img/w/" + data.list[5].weather[0].icon + ".png";

    // Adds new elements
    let dayFive = document.createElement('div');
    let fiveDayResultsHeader = document.createElement('h4');

    // Assigns IDs to elements, appends days to day section div
    dayFive.id = 'day-five';
    fiveDayResultsHeader.id = 'five-day-header';
    fiveDayResultsHeader.textContent = fiveDayFuture;
    dayFive.appendChild(fiveDayResultsHeader);

    // Additional elements
    let newListFiveUl = document.createElement('ul');
    let newListItemFiveClouds =  document.createElement('img');
    let newListItemFiveTemp =  document.createElement('ol');
    let newListItemFiveWind =  document.createElement('ol');   
    let newListItemFiveHumidity =  document.createElement('ol');
    
    // Adding alt and src to weather icon
    newListItemFiveClouds.alt = 'Weather Icon';
    newListItemFiveClouds.src = iconFiveUrl;

    // Assigns IDs
    newListItemFiveClouds.id = 'results-five-clouds';
    newListItemFiveTemp.id = 'results-five-temp';
    newListItemFiveWind.id = 'results-five-wind';
    newListItemFiveHumidity.id = 'results-five-humidity';
    
    // Converts kelvin to farenheit
    let newListItemFiveTempF = Math.floor((fiveDayResults.temp - 273) * (9/5) +32);

    // Assigns inner text with data
    newListItemFiveClouds.textContent = fiveDayResults.clouds;
    newListItemFiveTemp.textContent = 'Temp: ' + newListItemFiveTempF + "??F";
    newListItemFiveWind.textContent = 'Wind: ' + fiveDayResults.wind + " MPH";
    newListItemFiveHumidity.textContent = 'Humidity: ' + fiveDayResults.humidity + " %";

    // Appends Children
    newListFiveUl.appendChild(newListItemFiveClouds);
    newListFiveUl.appendChild(newListItemFiveTemp);
    newListFiveUl.appendChild(newListItemFiveWind);
    newListFiveUl.appendChild(newListItemFiveHumidity);
    dayFive.appendChild(newListFiveUl);
    fiveDayResultsSection.appendChild(dayFive);

    // Converts kelvin to farenheit
    // document.getElementById("results-f")
    // Changes html to javascript html
    fiveDayForcastDiv.innerHTML = fiveDayResultsSection.innerHTML;
}

// Displays past searches
async function displayPastSearches(event) {
    event.preventDefault();
    // Creates buttons for past search results
    let pastResults = JSON.parse(window.localStorage.getItem('Search'));
    let pastSearchContainer = document.createElement('div');
    pastSearchContainer.id = "past-search-container";


    for (var i = 0; i < pastResults.length; i++) {
        let pastSearchResult = document.createElement('div');
        pastSearchResult.className = "btn";
        pastSearchResult.id = "fetch-past-button" + "-" + i;
        pastSearchResult.textContent = pastResults[i].city;
        pastSearchContainer.appendChild(pastSearchResult);
    }
    pastSearch.replaceWith(pastSearchContainer);
    // await reload();
}

// Attempted to reload past search list on submit
// async function reload(){
//     var container = document.getElementById("past-search-container");
//     var content = container.innerHTML;
//     container.innerHTML= content; 
// }

// Past Search click function
async function assignFunctionality() {

    let pastResults = JSON.parse(window.localStorage.getItem('Search'));
    let pastSearchContainer = document.createElement('div');
    pastSearchContainer.id = "past-search-container";

    for (var i = 0; i < pastResults.length; i++) {
        var pastCityButton = document.getElementById("fetch-past-button" + "-" + i);
        pastCityButton.addEventListener('click', function(event) {getApi(event.path[0].innerHTML)});
    }
}

