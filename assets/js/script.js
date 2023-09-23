// establish variables for input fields and buttons
var dateStart = document.getElementById('dateStart');
var dateEnd = document.getElementById('dateEnd');
var lodgingAddress = document.getElementById('lodging-address');
var submitButton = document.getElementById('submitButton');
var dayContainer = document.getElementById('day-container');
var scheduleButton = document.getElementById('scheduleButton');
var days;

// generally declared fetch function for reference and ease of use
function fetchAPIData(apiUrl) {
    return fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
};

// function to generate activity blocks that will be appended to the each day's schedule per user inputs
function generateActivityBlock(dayIndex) {
    // retrieve the inputs in the form and the table where the data will be appended
    var addressField = document.getElementById(`address${dayIndex}`);
    var descriptionField = document.getElementById(`description${dayIndex}`);
    var tableBody = document.getElementById(`tbody-${dayIndex}`);

    tableBody.innerHTML += `
        <tr>
            <td>${addressField}</td>
            <td>${descriptionField}</td>
        </tr>
        `;
}


// function to open modal
function openModal() {
    // open modal
    var modal = document.getElementById('route-modal');
    modal.style.display = 'block';
}

  
// function to close  modal
function closeModal() {
    var modal = document.getElementById('route-modal');
    modal.style.display = 'none';
}

// array of all activity addresses (not sure how to create array per day...) 
var activityAddresses = [];


// calculate number of days, generate columns per number of days, generate the html content of each column
// in the generated actvity-input-form, add MapQuest API autocomplete, and generate button and add its functionality
// generate route-time-calculator button, add functionality, store data for the route-time-calculator modal
scheduleButton.addEventListener('click', function (event) {
    //prevents default submit button activity
    event.preventDefault();

    // disable button after first use, otherwise columns will continue to generate if button is clicked
    scheduleButton.disabled = true;

    // add lodging address to array for addresses - only if a lodging address was inputted
    if (lodgingAddress.value !== '') {
        activityAddresses.push(lodgingAddress.value);
        console.log(activityAddresses);
    }

    //establishes two variables based on user input dates
    var d1 = new Date(dateStart.value);
    var d2 = new Date(dateEnd.value);
    //calculates the difference between the two dates in milliseconds
    var diff = Math.abs(d1-d2);
    //converts milliseconds to days and makes the days indexed to 1 instead of 0
    var days = ((diff / 86400000) + 1);
    //for each day [we are now 1-indexed], we generate a container for the user to receive day specific data
    //each search field is given a datalist and id based on its iteration
    //the submit buttons also have iterative ids



    for (var dayIndex = 1; dayIndex <= days; dayIndex++) {
        // html for schedule columns
        dayContainer.innerHTML += `
            <section>
                <h2>Day ${dayIndex}: ${dayjs(d1).add(dayIndex - 1, 'day').format('M-DD-YYYY')}</h2>

                <div class="weatherDisplay" id="weatherDisplay${dayIndex}">
                    <p>Temp: <span></span>&deg;F</p>
                    <p>Precipitation: <span></span>%</p>
                    <p>Wind: <span></span>mph</p>
                    <p>Humidity: <span></span>%</p>
                </div>

                <div class="activity-input-form">
                    <p>Schedule Activities:</p>
                    <div>
                        <input type="text" 
                            class="pure-input-rounded activity-input address-search" 
                            id="address${dayIndex}" 
                            autocomplete="off" 
                            placeholder="Address" 
                            list="auto-complete ${dayIndex}">
                    </div>
                    <div>
                        <input type="text" 
                            class="pure-input-rounded activity-input" 
                            id="description${dayIndex}" 
                            autocomplete="off" 
                            placeholder="Description of Activity (Optional)">
                    </div>
                    <div><input type="time" class="activity-input"></div>
                    <button class="activity-input activity-button" id="activity-button-${dayIndex}">Add to Schedule</button>
                </div>

                <div id="schedule-title"><p>Daily Schedule</p></div>
                <table class="pure-table pure-table-bordered">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Address</th>
                            <th>Activity</th>
                        </tr>
                    </thead>
                    <tbody id="tbody-${dayIndex}" class="tbody">
                    </tbody>
                </table>

                <div></div>
            </section>`;
    }

    // BEGIN CODE INTEGRATION - JOHN - BEGIN CODE INTEGRATION - JOHN

    //establishes search input value
    var searchCityInput = $('#lodging-address');
    //empty lat and lon variables
    var lat = '';
    var lon = '';
    var weatherDisplay = $('.weatherDisplay');

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

            var startDate = $('#dateStart').val();
            var endDate = $('#dateEnd').val();

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

            Object.keys(selectedWeatherData).forEach(function (date, index) {
                var indexPlus = (index + 1);
                var weatherDisplayID = ("#weatherDisplay" + indexPlus);
                var selectedData = selectedWeatherData[date];
                var cityNameD = $("<p>").text(selectedData.cityName);
                var weatherIconUrl = `https://api.openweathermap.org/img/w/${selectedData.weatherIcon}.png`;
                var weatherIconD = $("<img>").attr('src', weatherIconUrl);
                var dateD = $("<p>").text(selectedData.date);
                var tempD = $("<p>").html('Temp: ' + selectedData.temp + '&deg;F');
                var humidityD = $("<p>").text('Humidity: ' + selectedData.humidity + '%');
                var windD = $("<p>").text('Wind: ' + selectedData.wind + ' MPH');
                console.log(selectedWeatherData);

                $(weatherDisplayID).append(weatherIconD);
                $(weatherDisplayID).append(cityNameD);
                $(weatherDisplayID).append(dateD);
                $(weatherDisplayID).append(tempD);
                $(weatherDisplayID).append(humidityD);
                $(weatherDisplayID).append(windD);
            });
        })

    //retrieve every "add to schedule" button per column, then add functionality
    var activityButtons = document.querySelectorAll(`.activity-button`);

    //functionality for the button to schedule activities
    //require an address at minimum per activity, time and description optional

    activityButtons.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); //parentElement is the activity-input-form div
            var addressInput = item.parentElement.children[1].children[0].value;

            // check if the address input is empty, and return if it is
            if (addressInput === '') {
                alert('Please fill out an address before adding to the schedule.');
                return; 
            }

            var descriptionInput = item.parentElement.children[2].children[0].value;
            var timeInput = item.parentElement.children[3].children[0].value;
            // parentElement of activity-input-form div => section, [3].[1]. => table, tbody id="tbody-${i}"
            var appendTableLocation = item.parentElement.parentElement.children[4].children[1];
            appendTableLocation.innerHTML += `
                <tr>
                    <td>${timeInput}</td>
                    <td>${addressInput}</td>
                    <td>${descriptionInput}</td>
                </tr>
                `;
            
            // clear inputs
            item.parentElement.children[1].children[0].value = ''; 
            item.parentElement.children[2].children[0].value = ''; 
            item.parentElement.children[3].children[0].value = '';

            //retrieves the route-time-calculation-button, which may not exist yet
            var routeCalculatorButton = item.parentElement.parentElement.children[5].children[0];

            //checks if button exists yet, adds if it doesn't exist
            //this prevents from this button being generated every time an activity is scheduled
            if (!routeCalculatorButton) {
                var appendRouteCalculatorButtonLocation = item.parentElement.parentElement.children[5];
                var routeTimesButton = document.createElement("button");
                routeTimesButton.className = "route-time-calculation-button";
                routeTimesButton.textContent = 'Calculate Route Times';
                appendRouteCalculatorButtonLocation.append(routeTimesButton)

                // add event listener to open modal
                routeTimesButton.addEventListener('click', openModal);

                // add event listener to close modal
                var modalCloseButton = document.getElementById('modal-close-button');
                modalCloseButton.addEventListener('click', closeModal);
            }

            // create array for addresses if needed, otherwise add to it
            activityAddresses = activityAddresses || [];
            activityAddresses.push(addressInput);
            console.log(activityAddresses)


            // retrieve and reset dropdowns for addresses
            var addressDropdowns = document.getElementsByClassName('activity-addresses-dropdown');

            // loop for each dropdown
            for (var i = 0; i < addressDropdowns.length; i++) {
                var addressDropdown = addressDropdowns[i];
                addressDropdown.innerHTML = ''; 

                // populate dropdowns with addresses
                if (activityAddresses) {
                    activityAddresses.forEach(item => {
                        var option = document.createElement('option');
                        option.textContent = item;
                        addressDropdown.appendChild(option);
                    });
                }
            }

            // event listener for "calculate driving time" button
            var calculateDrivingTimeButton = document.getElementById('calculate-driving-time-button');
            calculateDrivingTimeButton.addEventListener('click', function() {
                // access both dropdown menus
                var startLocationDropdown = document.getElementById('address-dropdown-1');
                var endLocationDropdown = document.getElementById('address-dropdown-2');
                // access user choices for dropdowns
                var startLocationAddress = startLocationDropdown.options[startLocationDropdown.selectedIndex].value;
                var endLocationAddress = endLocationDropdown.options[endLocationDropdown.selectedIndex].value;
                
                calculateRouteTime(startLocationAddress, endLocationAddress);
            });
        })
    })
   
    
    // POI autocomplete for search inputs
    searchFields = document.querySelectorAll('.address-search');

    searchFields.forEach(item => {
        //listens for inputs in the search fields
        item.addEventListener('input', function() {
            //logs some diagnostic stuff to console
            console.log(item.value);
            console.log(item.getAttribute("list"));

            //checks that the number of characters is at least three so as not to waste API
            //calls or get an unusable response
            if (item.value.length > 2) {
                //generates API url based on input data
                suggestURL = `https://www.mapquestapi.com/search/v3/prediction?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=${item.value}`;
                
                //fetches API url
                fetchAPIData(suggestURL)
                    //dynamically refreshes and populates autofill field
                    .then(function(data) {
                        //clears autofill on receipt of data
                        item.innerHTML = "";
                        //generates empty list variable
                        var list = '';
                        //for each entry in the results, generates an autofill option based on that node's data
                        //and adds that html to the "list" variable
                        console.log(data);
                        for (var i = 0; i < data.results.length; i++) {
                            list += "<option value='" + data.results[i].displayString + "'></option>";
                        }
                        //appends list variable to a datalist and places it inside the input field as autofill data
                        //additionally, adds the "list" attribute from that field to the datalist's ID
                        //which allows the input field to reference the datalist
                        item.innerHTML = "<datalist id='" + item.getAttribute('list') + "'>" + list + "</datalist>";
                    })
                } else {
                    //if the input is not at least three characters, nothing happens
                    return;
                }
        })
    })

})

//much simpler event listener for single input field, see above comments for technical description
lodgingAddress.addEventListener('input', function() {

    if (lodgingAddress.value.length > 1) {
    suggestURL = `https://www.mapquestapi.com/search/v3/prediction?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=${lodgingAddress.value}`;

    fetchAPIData(suggestURL)
        .then(function(data) {
            // show API response data 
            lodgingAddress.innerHTML = "";
            var list = '';
            for (var i = 0; i < data.results.length; i++) {
                list += "<option value='" + data.results[i].displayString + "'>" + data.results[i].displayString + "</option>";
            }
            lodgingAddress.innerHTML = "<datalist id='auto-complete'>" + list + "</datalist>";
        })
    } else {
        return;
    }
});


// mapquest API route time calculator
function calculateRouteTime (startLocationAddress, endLocationAddress) {
    var requestUrl = 
    `https://www.mapquestapi.com/directions/v2/routematrix?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&from=
    ${startLocationAddress}&to=${endLocationAddress}`

    fetchAPIData(requestUrl)

        .then(function(data) {
            // show API response data 
            console.log(data);

            var seconds = data.time[1];
            // convert seconds to hours (3600s/hr)
            var hours = Math.floor(seconds / 3600); 
            // remainder seconds
            seconds %= 3600;
            // convert remainder seconds to minutes (60s/min)
            var minutes = Math.floor(seconds / 60);    
            
            var readableTime = '';

            // show hours only if time exceeds one hour
            if (hours > 0) {
                readableTime += hours + ' hour'; 
                if (hours > 1) {
                    readableTime += 's'; // make hours plural if more than 1 hour
                }
                if (minutes > 0) {
                    readableTime += ' '; // add space if there are minutes to show
                }
            }

            // show minutes only if needed
            if (minutes > 0) {
                readableTime += minutes + ' minute';
                if (minutes > 1) {
                    readableTime += 's'; // make minutes plural if more than 1 min
                }
            }

            // extract and display the distance from the API response
            if (data.time[1]) {
                document.getElementById('route-time').textContent = 'Driving Time: ' + readableTime;
            } else {
                document.getElementById('route-time').textContent = 'Route time not available.';
            }
    })
}
