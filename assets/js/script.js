// mapquest API route time test 

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
                document.getElementById('route-time').textContent = 'Route Time: ' + readableTime;
            } else {
                document.getElementById('route-time').textContent = 'Route time not available.';
            }
        })

});

// end mapquest API route time test