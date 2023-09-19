// mapquest placesearch API test

var dateStart = document.getElementById('dateStart');
var dateEnd = document.getElementById('dateEnd');
var address = document.getElementById('address');
var city = document.getElementById('city');
var stateProvince = document.getElementById('state/province');
var country = document.getElementById('country');
var submitButton = document.getElementById('submitButton');
var main = document.getElementById('main');
var scheduleButton = document.getElementById('scheduleButton');


// var allDatesArr = [];
// function to generate date array
    // var dateStart = document.getElementById('dateStart');
    // var dateEnd = document.getElementById('dateEnd');

    // check of end date is actually after the start date....
    // use push method
    // maybe will need to convert dates to unix?
    // console.log(allDatesArr)
    


// function to generate flex-box columns based on start and end date
    // create container in html with flex properties -- this is already done i think
    // var NAMEOFCONTAINER = document.getElementById('');
    
    // clear any existing columns
    // NAMEOFCONTAINER.innerHTML = '';

    // loop through allDatesArr
    // for (var i = 0; i < allDatesArr.length; i++) {
    //     var dateTitle = allDatesArr[i];
    //     var column = document.createElement('div'); 
    //     column.className = 'flex-column'; // in css create a class for the columns to apply ?
    //     column.textContent = dateTitle;
    // };

    // call function for creating date titles


// function to generate column header elements
    // 
    


    





   






scheduleButton.addEventListener('click', function (event) {
    event.preventDefault();
    main.innerHTML += "<p>" + dateStart.value + "</p>";
    main.innerHTML += "<p>" + dateEnd.value + "</p>";
    var d1 = new Date(dateStart.value);
    var d2 = new Date(dateEnd.value);
    var diff = Math.abs(d1-d2);
    var days = (diff / 86400000);
    main.innerHTML += "<p>Days: " + days + "</p>";
    for (var i = 1; i <= days; i++) {
        main.innerHTML += '<section><h2>Day ' + i + '</h2><article><p>Precipitation: <span></span>%</p><p>Temp: <span></span>&deg;F</p><p>Wind: <span></span>mph</p><p>Humidity: <span></span>%</p></article><table class="pure-table pure-table-bordered"><thead><tr><th>Time</th><th>Activity</th></tr></thead><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tbody></table></section>';
    }
})


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




// mapquest API route time test 

//document.getElementById('test-form').addEventListener('submit', function (event) {
   // event.preventDefault(); 

    // retrieve the values entered by the user
   // var startLocation = document.getElementById('start-location').value;
  //  var endLocation = document.getElementById('end-location').value;

    // create the API request with key, start point, and end point
  //  var requestUrl = 'https://www.mapquestapi.com/directions/v2/routematrix?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&from=' + startLocation + '&to=' + endLocation;

    // fetch API:
   // fetch(requestUrl)
  //      .then(function(response) {
   //         return response.json();
   //     })
   //     .then(function(data) {
            // show API response data 
   //         console.log(data);

   //         var seconds = data.time[1];
            // convert seconds to hours (3600s/hr)
   //         var hours = Math.floor(seconds / 3600); 
            // remainder seconds
   //         seconds %= 3600;
            // convert remainder seconds to minutes (60s/min)
   //         var minutes = Math.floor(seconds / 60);    
            
     //       var readableTime = '';

            // show hours only if time exceeds one hour
     //       if (hours > 0) {
     //           readableTime += hours + ' hour'; 
      //          if (hours > 1) {
     //               readableTime += 's'; // make hours plural if more than 1 hour
     //           }
     //           if (minutes > 0) {
     //               readableTime += ' '; // add space if there are minutes to show
      //          }
      //      }
//
            // show minutes only if needed
//            if (minutes > 0) {
 //               readableTime += minutes + ' minute';
 //               if (minutes > 1) {
 //                   readableTime += 's'; // make minutes plural if more than 1 min
 //               }
 //           }
//
  //          // extract and display the distance from the API response
  //          if (data.time[1]) {
   //             document.getElementById('route-time').textContent = 'Route Time: ' + readableTime;
  //          } else {
 //               document.getElementById('route-time').textContent = 'Route time not available.';
 ///           }
 //       })

//});

// end mapquest API route time test