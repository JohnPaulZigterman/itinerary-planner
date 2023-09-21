// establish variables for input fields and buttons

var dateStart = document.getElementById('dateStart');
var dateEnd = document.getElementById('dateEnd');
var address = document.getElementById('address');
var submitButton = document.getElementById('submitButton');
var dayContainer = document.getElementById('day-container');
var scheduleButton = document.getElementById('scheduleButton');

// generally declared fetch function for reference and ease of use
function fetchAPIData(apiUrl) {
    return fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
};






// function to generate activity blocks that will be appended to the column as its own row
function generateActivityBlock(activityButton, i) {
    // // call function to fetch api data
    // var apiURL = // hmmm... not sure if i even need this?

    // fetchAPIData(apiURL)

    var activityBlocks = document.getElementById(`activity-blocks`);

    // collect each item from form, need to assign classes accordingly input to this input field
    var activityAddress = document.getElementById(`address${i}`).value; // attach autocomplete 
    var activityDescription = document.querySelector(`.activity-description-input`).value;

    // create activity container
    var activityBlock = document.createElement('div');
    
        var activityNameEl = document.createElement('div');
        activityNameEl.className = 'activity-block-row activity-name'; // in css create activity-name class
        activityNameEl.textContent = activityName;
        activityBlock.appendChild(activityNameEl);

        var activityAddressEl = document.createElement('div');
        activityAddressEl.className = 'activity-block-row activity-address'; // in css create activity-address class
        activityAddressEl.textContent = activityAddress;
        activityBlock.appendChild(activityAddressEl);

        var activityDescriptionEl = document.createElement('div');
        activityDescriptionEl.className = 'activity-block-row activity-description'; // in css create a class for the column headers?
        activityDescriptionEl.textContent = activityDescription;
        activityBlock.appendChild(activityDescriptionEl);
        
        var routeTimeButton = document.createElement("button");
        routeTimeButton.className = "route-time-calculation-button";
        routeTimeButton.textContent = 'Calculate Route Time';
        activityBlock.append(routeTimeButton)

        routeTimeButton.addEventListener("click", function() {
            calculateRouteTime(activityAddress)
            routeTimeButton.textContent = readableTime;
        });

    activityBlocks.append(activityBlock) // append after #activity-input-form in #activity-blocks div

    // can we make the blocks drag and drop-able?

}

















var days;

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
    for (var i = 1; i <= days; i++) {
   
        dayContainer.innerHTML += `
            <section>
                <h2>Day ${i}: ${dayjs(d1).add(i - 1, 'day').format('M-DD-YYYY')}</h2>

                <div class="weather-block">
                    <p>Temp: <span></span>&deg;F</p>
                    <p>Precipitation: <span></span>%</p>
                    <p>Wind: <span></span>mph</p>
                    <p>Humidity: <span></span>%</p>
                </div>

                <div class="activity-input-form">
                    <p>Schedule Activities:</p>
                    <div><p>Search By Address</p>
                    <input type="text" class="pure-input-rounded address-search" autocomplete="off" id="address${i}" placeholder="Address" list="auto-complete ${i}"></div>
                    <div><input type="text" class="activity-description-input" class="pure-input-rounded" autocomplete="off" placeholder="Description of Activity (Optional"></div>
                    <button id="activity-button-${i}">Input Activity</button>
                </div>

                <div id="activity-blocks"></div>
                
                <table class="pure-table pure-table-bordered">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td></td><td></td></tr>
                        <tr><td></td><td></td></tr>
                    </tbody>
                </table>

            </section>`;


    }
    
    // input activity button eventlistener
    for (var i = 1; i <= days; i++) {
        var activityButton = document.getElementById(`activity-button-${i}`);
        if (activityButton) {
            activityButton.addEventListener('click', function (event) {
                event.preventDefault();
                generateActivityBlock(event.target, i); 
            });
        }
    }

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
                        for (var i = 0; i < data.results.length; i++) {
                            list += "<option value='" + data.results[i].displayString + "'>" + data.results[i].displayString + "</option>";
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
            console.log(data);
            address.innerHTML = "";
            console.log(data.results.length);
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
