var searchCityInput = $('input');
var lat = '';
var lon = '';
var weatherDisplay = $('.weatherDisplay')

$('#searchBtn').on('click', function (event) {
    event.preventDefault();

    var city = searchCityInput.val();
    var geocodingUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=4YRzkiCJVHh4RSMvEfNjFeqjbAup1m71&location=${city}`;

    fetch(geocodingUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var locations = data.results[0].locations;
            if (locations.length > 0) {
                lat = locations[0].latLng.lat;
                lon = locations[0].latLng.lng;
                var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=7275518d08ae835bf6361e49e3af30c0&units=imperial`;
                return fetch(weatherUrl);
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            console.log(weatherData);
            $('.weatherDisplay').empty();

            var startDate = $('#startDate').val();
            var endDate = $('#endDate').val();

            var filteredData = weatherData.list.filter(function (entry) {
                var date = entry.dt_txt.split(' ')[0]; 
                return date >= startDate && date <= endDate;
            });

            var selectedWeatherData = {};

            filteredData.forEach(function (entry) {
                var date = entry.dt_txt.split(' ')[0]; 
                if (!selectedWeatherData[date]) {
                    selectedWeatherData[date] = {
                        cityName: weatherData.city.name,
                        weatherIcon: entry.weather[0].icon,
                        date: entry.dt_txt,
                        temp: entry.main.temp,
                        humidity: entry.main.humidity,
                        wind: entry.wind.speed,
                    };
                }
            });

            Object.keys(selectedWeatherData).forEach(function (date) {
                var selectedData = selectedWeatherData[date];
                var cityNameD = $("<p>").text(selectedData.cityName);
                var weatherIconUrl = `https://api.openweathermap.org/img/w/${selectedData.weatherIcon}.png`;
                var weatherIconD = $("<img>").attr('src', weatherIconUrl);
                var dateD = $("<p>").text(selectedData.date);
                var tempD = $("<p>").html('Temp: ' + selectedData.temp + '&deg;F');
                var humidityD = $("<p>").text('Humidity: ' + selectedData.humidity + '%');
                var windD = $("<p>").text('Wind: ' + selectedData.wind + ' MPH');

                $('.weatherDisplay').append(weatherIconD);
                $('.weatherDisplay').append(cityNameD);
                $('.weatherDisplay').append(dateD);
                $('.weatherDisplay').append(tempD);
                $('.weatherDisplay').append(humidityD);
                $('.weatherDisplay').append(windD);
            });
        })
}); 
