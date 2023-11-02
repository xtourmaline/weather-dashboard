const apiKey = "8c8324b39583c855b4fe51feb2f0e639";
let btnSearch = $("#search");

btnSearch.on("click", function (event) {
    
    let cityInput = $("#city").val();

    //checks to see if the user enters anything
    if (cityInput === "") {
        alert("Enter a city");
    } else {
        cityInput = $("input").val();
        console.log(cityInput);  // FOR TESTING PURPOSES!! DELETE LATER
    }

    let [name, lon, lat] = getLocation(cityInput, apiKey); 
    
    console.log(name, lon, lat) // FOR TESTING PURPOSES!! DELETE LATER
})

// getting the lon, lat, and name from the API response
function getLocation(cityInput, apiKey) {
    let cityCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`
    
    fetch(cityCoordinates)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let name = data[0].name;
        let lon = data[0].lon;
        let lat = data[0].lat;

        return [name, lon, lat]
    })
}

// let name, lon, lat = getLocation()

// // getting the weather
// function getWeather() {
//     let weather = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

//     fetch(weather)
//         .then(function (response) {
//             return response.json();
//     })
//         .then(function (data) {
//             console.log(data);
//     });
// }