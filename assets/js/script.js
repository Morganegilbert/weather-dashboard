var resultList = document.querySelector('results');
var fetchButton = document.getElementById('fetch-button');
var apiKey = 'ed329abd942d01f3c302c755d746f0d1';

async function getApi() {
    var cityName = 'Raleigh';
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude={part}&appid={API key}';
    var geolocatingURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=8&appid=' + apiKey;
    var fiveDayUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';
    reverseGeolocatingURL = 'http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid=' + apiKey;
    console.log('This is location URL', geolocatingURL);

    let locationData = await getLocationData(geolocatingURL);
    var lat = locationData[0].lat;
    var lon = locationData[0].lon;
    console.log('location data', locationData[0].lat);
    console.log('location lat', lat);
    console.log('location lon', lon);


    // let lat = await getLocationData(geolocatingURL);

}

async function getLocationData(URL) {
    try {
        let res = await fetch(URL);
        console.log('res', res.json);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
    let lat = await fetch(URL);

}

// async function 

fetchButton.addEventListener('click', getApi());