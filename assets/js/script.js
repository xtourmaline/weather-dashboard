const apiKey = "8c8324b39583c855b4fe51feb2f0e639";
let btnSearch = $("#search");

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


    // Uudate the displayed city inputs
    displayCityInputs(cityInputs);
}

// function to display saved city inputs
function displayCityInputs(inputs) {
    const cityList = $("#search-list");
    cityList.empty();

    inputs.reverse();

    inputs.forEach(input => {
        // cityList.append(`<button>${input}</button>`);
        cityList.prepend(`<button>${input}</button>`);
    });
}

displayCityInputs(JSON.parse(localStorage.getItem("cityInputs")) || []);

// occurs when button is pressed
btnSearch.on("click", function () {
    let cityInput = $("#city").val();

    //checks to see if the user enters anything
    if (cityInput === "") {
        alert("Enter a city");
    } else {
        console.log(cityInput);     // FOR TESTING PURPOSES!! DELETE LATER

        // calls function getLocation
        getLocation(cityInput, apiKey)
            .then(data => {
                const [name, lon, lat] = data;
                console.log(name, lon, lat);

                // calls function getWeather
                getWeather(lon, lat, apiKey);

                // Save the city input to local storage
                saveCityInput(name);

                // displays the city name
                $("#city-name").text(name);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
})

// getting the lon, lat, and name from the API response
function getLocation(cityInput, apiKey) {
    let cityCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`;
    
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

            console.log(data) // FOR TESTING PURPOSES!! DELETE LATER

            return [name, lon, lat]; // return the data as an array
        });
}

// getting the weather
function getWeather(lon, lat, apiKey) {
    let weather = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let date = `
                <p>${dayjs(data.list[0].dt_txt).format("MM/DD/YYYY")}</p>
            `

            let forecastContent = `
                <img src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png">
                <p class="card-text">Temp: ${data.list[0].main.temp} ºC</p>
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
                    <p class="card-text">Temp: ${data.list[count].main.temp} ºC</p>
                    <p class="card-text">Wind: ${data.list[count].wind.speed} mph</p>
                    <p class="card-text">Humidity: ${data.list[count].main.humidity} g/kg</p>
                `;

                count += 8;
                console.log(forecastContent)

                let $dayElement = $(`#day${i}`);
                $dayElement.children(":not(:first-child)").remove();
                $dayElement.append(forecastContent);
            }
        });
}