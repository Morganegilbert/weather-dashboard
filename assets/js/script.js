var resultList = document.querySelector('results');
var fetchButton = document.getElementById('fetch-button');
var apiKey = 'ed329abd942d01f3c302c755d746f0d1';

function getApi() {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';
    var geolocatingURL = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}'
    var fiveDayUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}';

    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        for (var i = 0; i < data.length; i++) {
        var divItem = document.createElement('div');
        divItem.textContent = data[i].html_url;
        resultList.appendChild(divItem);
        }
    })
}
fetchButton.addEventListener('click', getApi);