// mapquest API test 

document.getElementById('test-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    // retrieve the values entered by the user
    var startLocation = document.getElementById('start-location').value;
    var endLocation = document.getElementById('end-location').value;

    // create the API request with key, start point, and end point
    var requestUrl = 'https://www.mapquestapi.com/directions/v2/routematrix?key=3HkLXgscqDPRETajQUjpap4tOOpSzX1U&from=' + startLocation + '&to=' + endLocation;

    // fetch API:
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // show API response data 
            console.log(data);

            // extract and display the distance from the API response
            if (data.time[1]) {
                document.getElementById('route-time').textContent = 'Route Time: ' + data.time[1];
            } else {
                document.getElementById('route-time').textContent = 'Route time not available.';
            }

        })

});

// end mapquest API test