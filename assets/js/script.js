// mapquest placesearch API test

var dateStart = document.getElementById('dateStart');
var dateEnd = document.getElementById('dateEnd');
var address = document.getElementById('address');
var city = document.getElementById('city');
var stateProvince = document.getElementById('state/province');
var country = document.getElementById('country');
var submitButton = document.getElementById('submitButton');
var dayContainer = document.getElementById('day-container');
var scheduleButton = document.getElementById('scheduleButton');





scheduleButton.addEventListener('click', function (event) {
    event.preventDefault();
    var d1 = new Date(dateStart.value);
    var d2 = new Date(dateEnd.value);
    var diff = Math.abs(d1-d2);
    var days = ((diff / 86400000) + 1);
    for (var i = 1; i <= days; i++) {
        dayContainer.innerHTML += '<section><h2>Day ' + i + '</h2><p>Search By Address</p><input type="text" class="pure-input-rounded address-search" autocomplete="off" id="address' + i + '" placeholder="Address" list="auto-complete' + i + '"><article><p>Precipitation: <span></span>%</p><p>Temp: <span></span>&deg;F</p><p>Wind: <span></span>mph</p><p>Humidity: <span></span>%</p></article><table class="pure-table pure-table-bordered"><thead><tr><th>Time</th><th>Activity</th></tr></thead><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tbody></table></section>';
    }
    searchFields = document.querySelectorAll('.address-search');

    searchFields.forEach(item => {
        item.addEventListener('input', function() {
            console.log(item.value);
            console.log(item.getAttribute("list"));

            if (item.value.length > 1) {
                suggestURL = "https://www.mapquestapi.com/search/v3/prediction?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=" + item.value;
            
                fetch(suggestURL)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        item.innerHTML = "";
                        var list = '';
                        for (var i = 0; i < data.results.length; i++) {
                            list += "<option value='" + data.results[i].displayString + "'>" + data.results[i].displayString + "</option>";
                        }
                        item.innerHTML = "<datalist id='" + item.getAttribute('list') + "'>" + list + "</datalist>";
                    })
                } else {
                    return;
                }
        })
    })
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