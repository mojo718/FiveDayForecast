




// Display the current date in the header (added current time)
var currentDay = dayjs().format("dddd, MMMM D, YYYY h:mm A");
$("#currentDay").text(currentDay);


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

init();

function init(){ }


//create eventlistener for search button







