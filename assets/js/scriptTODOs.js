// ----API-Related--------------------------------------------------------------------------------------------
// function to fetch api data

function fetchAPIData(apiUrl) {
    return fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
};

// function to calculate route time 
// any functions to process and convert api data?

// -----Date-Related-------------------------------------------------------------------------------------------

// var allDatesArr = [];
// function to generate date array
    // var dateStart = document.getElementById('dateStart');
    // var dateEnd = document.getElementById('dateEnd');

    // check of end date is actually after the start date....
    // use push method
    // maybe will need to convert dates to unix?
    // console.log(allDatesArr)
    // call local storage function to save dates
    
// -----Weather-Related-------------------------------------------------------------------------------------------

// function(s) to populate weather data
    // call function to fetch api data
    // whoever works on this..... 
    // we can share the code from our hws? i have several functions that would probably be usable here

// -----HTML-Related-------------------------------------------------------------------------------------------
 
// function to generate flex-box columns based on start and end date - we'll probably want to use flex row so things stack
    // create container in html with flex properties -- this is already done i think
    // var nameOfContainerEl = document.getElementById('#container');
    
    // clear any existing columns
    // nameOfContainerEl.innerHTML = '';

    // create column per each date in allDatesArr
    // allDatesArr.forEach(function (date) {
    //     var column = document.createElement('div');
    //     column.className = 'column-class-name-placeholder'; // in css create a class for the columns?
    
    //     // Add the column to the flex container
    //     containerNamePlaceholder.appendChild(column);
    // });
    

    // call function for creating column date headers
    // call function to add activity blocks
    // call function to add recommendation blocks

// ------------------------------------------------------------------------------------------------






// function to generate column date header elements
    // var columnHeaderEl = document.createElement('div');
    // columnHeaderEl.className = 'column-date-header'; // in css create a class for the column headers?
    // var date = datesArray[i];
    // columnHeaderEl.textContent = dateStr;
    // column.appendChild(columnHeaderEl);

// ------------------------------------------------------------------------------------------------
    





var dateStart = document.getElementById('dateStart');
var dateEnd = document.getElementById('dateEnd');

var address = document.getElementById('address');
var city = document.getElementById('city');
var stateProvince = document.getElementById('state/province');
var country = document.getElementById('country');
var submitButton = document.getElementById('submitButton');
var dayContainer = document.getElementById('day-container');
var scheduleButton = document.getElementById('scheduleButton');


// function to generate activity blocks that will be appended to the column as its own row
function generateActivityBlock(Activity) {
    // call function to fetch api data
    var apiURL = // hmmm...

    fetchAPIData(apiURL)

    // collect each item from form, need to assign IDs accordingly input to this input field
    var activityName  = $('#activity-name-input').val(); // attach autocomplete
    var = activityAddress = $('#activity-address-input').val(); // attach autocomplete 
    var = activityDescription = $('#activity-description-input').val();


    var = activityTravelTime; = (
        fetchRouteTime(activityAddress)
    )

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

    // can we make the blocks drag and drop-able?

}



    
// ------------------------------------------------------------------------------------------------

// function to generate recommendations blocks that will be appended to the column as its own row?
    // call function to fetch api data
    // each box can contain:
        // top row can be the name/address of the reference location? generate a "change location" button for this row that will regenerate the recommendations?
        // list(s) of recommendations by category (generated from API and user category selections)
            // determine what to include per recommendation (name, address, rating, distance, etc.)
        // an "add to itinerary" button that will create an activity block out of the recommendation
            // call activity block function 
    

// -----Local-Storage-Related-------------------------------------------------------------------------------------------

// function to store whatever data in local storage
    // localStorage.setItem('key', JSON.stringify(object);

    // call to store date inputs
    // call to store lodging address
    // call to store user inputted activities

// an init function

// -----User-Input-Related-------------------------------------------------------------------------------------------
// any additional functions we add to tidy or correct user input 
