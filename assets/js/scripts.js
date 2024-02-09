$(document).ready(function () {

  // create Vars - for Cities, current cities, currentDate
  var cities = []
  // Vars for openweather API and URL
  var openWeatherUrl = "https://api.openweathermap.org/data/2.5/";
  var APIkey = "a5112b084a68cefb0ea22d8f0208fde7"
  var units = "imperial"

  // Var array for Weather icons from FontAwesome (thanks to Crystal with help this part)

  var icons = [

    { code: "01", day: "fas fas-sun", night: "fas fa-moon" },
    { code: "02", day: "fas fa-cloud-sun", night: "fas fa-cloud-moon" },
    { code: "03", day: "fas fa-cloud", night: "fas fa-cloud" },
    { code: "04", day: "fas fa-cloud-sun", night: "fas fa-cloud-moon" },
    { code: "09", day: "fas fa-cloud-rain", night: "fas fa-cloud-rain" },
    { code: "10", day: "fas fa-cloud-showers-heavy", night: "fas fa-cloud-showers-heavy" },
    { code: "11", day: "fas fa-bolt", night: "fas fa-bolt" },
    { code: "13", day: "fas fa-snowflake", night: "fas fa-snowflake" },
    { code: "50", day: "fas fa-smog", night: "fas fa-smog" }
  ];

  // function to start App

  start();

  function start() {

    // Display the current date in the header (added current time)
    var currentDay = dayjs().format("dddd, MMMM D, YYYY h:mm A");
    $("#currentDay").text(currentDay);

    if (window.innerWidth >= 578) {
      $("#search-history").addClass("show");
      $("#collapse-search-history").hide();
    }

    getSearchHistory();

    // check if cities are saved to localStorage 
    if (cities.length === 0) {
      getWeather("New York");

    } else {
      var lastCityIndex = cities.length - 1;
      getWeather(cities[lastCityIndex]);

      $.each(cities, function (index, city) {
        displayCity(city);
      });
    }
  }

  // use openweatherAPI to get weather and forecast

  function getWeather(city) {
    var responseData = {};

    //  Get current weather and UV index from API
    $.ajax({
      url: openWeatherUrl + "weather",
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIkey,
      }
    }).then(function (response) {
      responseData.current = response;

      // var for coordinates to get UV index from API
      var coordinates = {
        lat:
          responseData.current.coord.lat
        ,
        lon: responseData.current.coord.lon
      }

      getUVindex(coordinates);
      displayCurrentWeather(responseData);
    });

    //call to get 5 day forcast
    $.ajax({
      url: openWeatherUrl + "forecast",
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIkey
      }
    }).then(function (response) {
      responseData.forecast = response;
      displayForecast(responseData);
    });
  }

  function getUVindex(coordinates) {
    $.ajax({
      url: openWeatherUrl + "uvi",
      method: "GET",
      data: {
        lat:
          coordinates.lat
        ,
        lon: coordinates.lon,
        appid: APIkey
      }
    }).then(function (response) {
      displayUV(response);
    });
  }

  // Replace icons from font awesome

  function replaceIcon(iconCode) {

    var number = iconCode.slice(0, 2);
    var dayOrNight = iconCode.slice(2);
    var currentHour = dayjs().hour();
    var index = icons.findIndex(function (icon, index) {
      return icon.code === number;
    });
    if (currentHour >= 06 && currentHour < 18) {
      return icons[index].day;

    } else {
      return icons[index].night;
    }
  }

  // section to display results from API
  function displayCurrentWeather(data) {

    // Display text fields
    $("#city").text(
      data.current.name
    );
    $("#conditions").text(
      data.current.weather
      [0].main);
    $("#temperature").text(`${parseInt(data.current.main.temp)}\u00B0 F`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`);


    var newIcon = replaceIcon(
      data.current.weather
      [0].icon);
    $("#icon").removeClass().addClass(`h2 ${newIcon}`);
  }


  function displayUV(data) {

    // Display text field
    $("#uv-index").text(data.value);

    // Remove existing color class
    $("#uv-index").removeClass("bg-success bg-warning bg-danger")

    // Determine condition color to apply to UV index
    if (data.value < 3) {
      $("#uv-index").addClass("bg-success");

    } else if (data.value >= 3 && data.value < 6) {
      $("#uv-index").addClass("bg-warning");

    } else if (data.value >= 6) {
      $("#uv-index").addClass("bg-danger");

    } else {
      console.log("Invalid UV index value.");
    }
  }
  // Return 5 day forcast
  function displayForecast(data) {

    // Create the 5 day forecast from 3 hour blocks returned by API
    var forecast = createForecast(data);
    $.each(forecast, function (i, day) {

      // Format date for display
      var date = dayjs(day.dt_txt).format("MMM. D");
      var year = dayjs(day.dt_txt).format("YYYY");

      // Replace API supplied icon with equivalent Font Awesome icon
      var iconClasses = replaceIcon(
        day.weather
        [0].icon);
      $(`#day-${i + 1}-icon`).removeClass().addClass(`h2 text-info ${iconClasses}`);

      // Display basic text fields
      $(`#day-${i + 1}-date`).text(date);
      $(`#day-${i + 1}-year`).text(year);
      $(`#day-${i + 1}-conditions`).text(
        day.weather
        [0].main);
      $(`#day-${i + 1}-temp`).text(`${parseInt(day.main.temp)}\u00B0 F`);
      $(`#day-${i + 1}-humidity`).text(`${day.main.humidity}% Humidity`);
    });
  }

  // Create 5 day forecast from API data
  function createForecast(data) {
    var forecastData = data.forecast.list;
    var fiveDayForecast = [];

    // Get date and hour of the first result returned by API
    var firstResult = {
      date: dayjs(data.forecast.list[0].dt_txt).date(),
      hour: dayjs(data.forecast.list[0].dt_txt).hour()
    };

    // if statements
    if (firstResult.hour === 6) {
      for (var i = 10; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }

      fiveDayForecast.push(forecastData[38]);

    } else if (firstResult.hour <= 09 && firstResult.hour >= 12) {
      for (var i = 9; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }

      fiveDayForecast.push(forecastData[39]);

    } else {
      var firstNoonIndex = forecastData.findIndex(function (forecast) {
        var isTomorrow = dayjs().isBefore(forecast.dt_txt);
        var hour = dayjs(forecast.dt_txt).hour();

        if (isTomorrow && hour === 12) {
          return true;
        }
      });

      for (var i = firstNoonIndex; i < forecastData.length; i += 8) {
        fiveDayForecast.push(forecastData[i]);
      }
    }

    return fiveDayForecast;
  }

  //Display City in search history
  function displayCity(city) {
    var cityList = $("<cityList>");
    cityList.addClass("list-group-item search-item");
    cityList.text(city);
    $("#search-history").prepend(cityList);
  }


  //Functions to get saved citys and save them to local storage

  function saveToHistory(city) {
    getSearchHistory();
    cities.push(city);
    setSearchHistory();
  }

  function getSearchHistory() {
    if (localStorage.getItem("cities") === null) {
      cities = [];
    } else {
      cities = JSON.parse(localStorage.getItem("cities"));
    }
  }
  function setSearchHistory() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  // eventlisters section

  // Eventlistener for history selection
  $("#delete-history").on("click", function () {
    $(".search-item").remove();
    cities.splice(0, cities.length - 1);
    setSearchHistory();
  });

  // eventlistenr for search button
  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    var city = $("#search").val();

    if (city === "") {
      console.log("Invalid City");
      return;
    }
    // Get weather and city data from API - save history to Local storage
    getWeather(city);
    displayCity(city);
    saveToHistory(city);

    // clear the search field
    $("#search").val("");
  });
});





