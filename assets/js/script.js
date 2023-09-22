// establish variables for input fields and buttons

var dateStart = document.getElementById('dateStart');
var dateEnd = document.getElementById('dateEnd');
var address = document.getElementById('address');
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

// function to generate activity blocks that will be appended to the column as its own row
function generateActivityBlock(dayIndex) {
    // // call function to fetch api data
    // var apiURL = // hmmm... not sure if i even need this?

    // fetchAPIData(apiURL)

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


// poi search
scheduleButton.addEventListener('click', function (event) {
    //prevents default submit button activity
    event.preventDefault();
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
   
        dayContainer.innerHTML += `
            <section>
                <h2>Day ${dayIndex}: ${dayjs(d1).add(dayIndex - 1, 'day').format('M-DD-YYYY')}</h2>

                <div class="weather-block">
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
                            placeholder="Description of Activity (Optional">
                    </div>
                    <div><input type="time" class="activity-input"></div>
                    <button class="activity-input activity-button" id="activity-button-${dayIndex}">Add to Schedule</button>
                </div>

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

            </section>`;

            
    }


    
    //retrieve every "add to schedule" button per column to schedule activities, then add functionality
    var activityButtons = document.querySelectorAll(`.activity-button`);

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
            //parentElement of activity-input-form div => section, [3].[1]. => table, tbody id="tbody-${i}"
            var appendTableLocation = item.parentElement.parentElement.children[3].children[1];
            appendTableLocation.innerHTML += `
            <tr>
                <td>${timeInput}</td>
                <td>${addressInput}</td>
                <td>${descriptionInput}</td>
            </tr>
            `;
        })
    })
    

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
                suggestURL = "https://www.mapquestapi.com/search/v3/prediction?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=" + item.value;
                
                //fetches API url
                fetch(suggestURL)
                    .then(function(response) {
                        return response.json();
                    })
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
address.addEventListener('input', function() {

    if (address.value.length > 1) {
    suggestURL = "https://www.mapquestapi.com/search/v3/prediction?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=" + address.value;

    fetch(suggestURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // show API response data 
            address.innerHTML = "";
            var list = '';
            for (var i = 0; i < data.results.length; i++) {
                list += "<option value='" + data.results[i].displayString + "'>" + data.results[i].displayString + "</option>";
            }
            address.innerHTML = "<datalist id='auto-complete'>" + list + "</datalist>";
        })
    } else {
        return;
    }
});





// submitButton.addEventListener('click', placeSearch());


// mapquest API route time calculator
function calculateRouteTime (address) {
    var routeTimeStartLocation = address; // this is either the lodging address by default or that day's central location, specified by user
    var routeTimeEndLocation = activityAddress; // this is the activityAddress

    var requestUrl = 'https://www.mapquestapi.com/directions/v2/routematrix?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&from=' + routeTimeStartLocation + '&to=' + routeTimeEndLocation;

    fetchAPIData(requestUrl)
       .then(function(response) {
           return response.json();
       })

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

            // // extract and display the distance from the API response
            // if (data.time[1]) {
            //     document.getElementById('route-time').textContent = 'Route Time: ' + readableTime;
            // } else {
            //     document.getElementById('route-time').textContent = 'Route time not available.';
            // }
       })
};
