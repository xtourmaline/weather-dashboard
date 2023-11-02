const apiKey = "8c8324b39583c855b4fe51feb2f0e639";
let btnSearch = $("#search");

// FUNCTION: saves city into local storage
function saveCityInput(cityInput) {
    let cityInputs = JSON.parse(localStorage.getItem("cityInputs")) || [];

    // remove city from list if already exists
    const existingIndex = cityInputs.indexOf(cityInput);
    if (existingIndex !== -1) {
        cityInputs.splice(existingIndex, 1);
    }

    // Add the city at the beginning of the list
    cityInputs.unshift(cityInput);

    // limits the search history to only 5 recent searches
    const maxCities = 5;
    if (cityInputs.length > maxCities) {
        cityInputs.pop();
    }

    // update local storage
    localStorage.setItem("cityInputs", JSON.stringify(cityInputs));

    // uudate the displayed city inputs
    displayCityInputs(cityInputs);
}

// FUNCTION: to display saved city inputs
function displayCityInputs(inputs) {
    const cityList = $("#search-list");
    cityList.empty();

    inputs.reverse();

    inputs.forEach(input => {
        cityList.prepend(`<button class="historyBtn">${input}</button>`);
    });
}

// FUNCTION: gets the necessary city and calls getLocation function to use for getWeather function
function search() {
    let cityInput = $("#city").val();

    //checks to see if the user enters anything
    if (cityInput === "") {
        alert("Enter a city");
    } else {
        // calls function getLocation
        getLocation(cityInput, apiKey)
            .then(data => {
                const [name, lon, lat] = data;

                // calls function getWeather
                getWeather(lon, lat, apiKey);

                // saves the city input to local storage
                saveCityInput(name);

                // displays the city name
                $("#city-name").text(name);

                // clears input field
                $("#city").val("");
            })

            .catch(error => {
                console.error("Error:", error);
            });
    }
}

// FUNCTION: getting the lon, lat, and name from the API response
function getLocation(cityInput, apiKey) {
    const cityCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`;
    
    // returns the fetch promise
    return fetch(cityCoordinates)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            let name = data[0].name;
            let lon = data[0].lon;
            let lat = data[0].lat;

            return [name, lon, lat]; // return the data as an array
        });
}

// FUNCTION: getting the weather and also displaying it
function getWeather(lon, lat, apiKey) {
    const weather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let date = `
                <p>${dayjs(data.list[0].dt_txt).format("MM/DD/YYYY")}</p>
            `;

            let forecastContent = `
                <img src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png">
                <p class="card-text">Temp: ${(((data.list[0].main.temp - 273.15) * 9/5) + 32).toFixed(2)} ºF</p>
                <p class="card-text">Wind: ${data.list[0].wind.speed} mph</p>
                <p class="card-text">Humidity: ${data.list[0].main.humidity} g/kg</p>
            `;

            $("#day0").children().first().after(date);
            $("#day0 > :nth-child(2)").nextAll().remove();
            
            $("#day0").append(forecastContent);
            
            let count = 7;

            for (let i = 1; i < 6; i++) {
                forecastContent = `
                    <img src="http://openweathermap.org/img/w/${data.list[count].weather[0].icon}.png">
                    <p class="card-text">Temp: ${(((data.list[count].main.temp - 273.15) * 9/5) + 32).toFixed(2)} ºF</p>
                    <p class="card-text">Wind: ${data.list[count].wind.speed} mph</p>
                    <p class="card-text">Humidity: ${data.list[count].main.humidity} g/kg</p>
                `;

                count += 8;
    
                let $dayElement = $(`#day${i}`);
                $dayElement.children(":not(:first-child)").remove();
                $dayElement.append(forecastContent);
            }
        });
}


// MAIN CODE

// displays the search history
displayCityInputs(JSON.parse(localStorage.getItem("cityInputs")) || []);

// when search button is pressed
btnSearch.on("click", function () {
    search();
});

// when enter key is pressed
$("#city").on("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        search();
    }
});

// when one of the search history button is pressed
$("#search-list").on("click", "button", function () {
    let cityInput = $(this).text();
    $("#city").val(cityInput);
    search();
});