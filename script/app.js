//Openweather API key
const key = "c3a7d04abef6d88b4796d2ba4957886c";

//--Init selectors
//container wrap around everything
const container = document.querySelector(".container");

const form = document.querySelector(".form");
const searchBox = document.querySelector(".search-box");
const alert = document.querySelector(".alert");

//background image
const bgimg = document.querySelector(".bg-img>img");

//weather content wrapper
const weatherContent = document.querySelector(".weather-content");
const details = document.querySelector(".details");

//weather condition text display. Eg: clear, clouds, rain, etc.
const condition = document.querySelector(".condition");

//location text display. Eg: London, GB
const loc = document.querySelector(".location");

//detail (temperature, pressure, humidity) text display
const temp = document.querySelector(".temperature");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");

//weather icon container
const icon = document.querySelector("[data-icon]");

//match mobile media query
const mobile = window.matchMedia("(max-width: 500px)");

//Getting the weather information by calling Openweather API
const getWeather = async cityName => {
  // const proxy = "https://cors-anywhere.herokuapp.com/";
  const base = `https://api.openweathermap.org/data/2.5/weather`;
  let query = "";
  let country = "";

  // Check if user type in "city name, country" or just "city name"
  // In most case, alert box will show up if user type in just only "username" saying
  // that "city is not found" even if the city name is correct
  if (cityName.includes(",")) {
    country = cityName
      .slice(cityName.lastIndexOf(",") + 1, cityName.length)
      .trim();
    const cityN = cityName.slice(0, cityName.indexOf(",")).trim();
    query = `?q=${cityN},${country}&appid=${key}&units=metric`;
  } else {
    const cityN = cityName.slice(0, cityName.indexOf(",")).trim();
    query = `?q=${cityN}&appid=${key}&units=metric`;
  }

  const response = await fetch(base + query);
  const data = await response.json();
  return data;
};

//Updating the UI
const updateUI = (data, cityName) => {
  //show the alert box if user typed in the wrong city or leave the search bar empty
  if (data.cod != "200") {
    alert.style.display = "inline-block";

    //styling for mobile view
    if (mobile.matches) {
      weatherContent.style.marginTop = "0.5em";
      weatherContent.children[1].style.marginTop = "0em";
    } else {
      //styling if it's not mobile view
      weatherContent.style.marginTop = "1em";
      weatherContent.children[1].style.marginTop = "2em";
    }
    if (cityName.length === 0) {
      alert.textContent = "Field is empty, please enter a location!";
    } else {
      alert.textContent = "City not found, please try again!";
    }
  } else {
    //If user type in the correct city name and country, proceed to update the UI
    alert.style.display = "none";
    weatherContent.style.display = "block";

    if (mobile.matches) {
      weatherContent.style.marginTop = "2em";
      weatherContent.children[1].style.marginTop = "1em";
    } else {
      weatherContent.style.marginTop = "2em";
      weatherContent.children[1].style.marginTop = "2.5em";
    }
    loc.textContent = `${data.name}, ${data.sys.country}`;
    condition.textContent = `${data.weather[0].description}`;

    details.innerHTML = `
    <div class="detail">
      <div class="label">Temp</div>
      <div class="value temperature">${data.main.temp}<span class="unit">&deg;C</span></div>
    </div>
    <div class="detail">
      <div class="label">Pressure</div>
      <div class="value pressure">${data.main.pressure}<span class="unit">hPa</span></div>
    </div>
    <div class="detail">
      <div class="label">Humidity</div>
      <div class="value humidity">${data.main.humidity}<span class="unit">%</span></div>`;

    //update weather icon
    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );

    //---Inserting icon background based on the weather condition
    // if the weather is clear or not
    if (data.weather[0].main.includes("Clear")) {
      if (icon.classList.contains("other")) {
        icon.classList.remove("other");
      }
      icon.classList.add("clear");
    } else {
      if (icon.classList.contains("clear")) {
        icon.classList.remove("clear");
      }
      icon.classList.add("other");
    }

    //---Inserting background image based on the location that user typed in
    //and based on the day/night cycle

    //Images are from source.unsplash.com
    //I use the url:"https://source.unsplash.com/featured/?{KEYWORD},{KEYWORD}" to get a random
    //image relating to the search term {KEYWORD}
    //For instance, if i want to get an image that is related to the search terms: "Hanoi" and "day"
    //simply just type "https://source.unsplash.com/featured/?Hanoi,day"

    // container.classList.add("day_night");
    // const day_night = document.querySelector(".day_night");
    container.style.color = "white";
    bgimg.parentElement.style.display = "block";

    //If it is day time
    if (data.weather[0].icon.includes("d")) {
      console.log("day");
      //Insert background image

      bgimg.setAttribute(
        "src",
        `https://source.unsplash.com/featured/?day,${data.name}`
      );
    } else {
      console.log("night");
      //If it is night time
      //Insert background image
      bgimg.setAttribute(
        "src",
        `https://source.unsplash.com/featured/?night,${data.name}`
      );
      // day_night.style.backgroundImage = `url("https://source.unsplash.com/featured/?night,${data.name}")`;
      // day_night.style.backgroundRepeat = "no-repeat";
      // day_night.style.backgroundPostition = "center center";
      // day_night.style.backgroundSize = "cover";
      // container.style.color = "white";
    }
  }
};

//Loading animation
const loader = document.querySelector(".loader");
bgimg.onload = () => {
  console.log("loaded");
  loader.classList.add("hidden");
};

//Animation for icon image
function Fade() {
  icon.classList.toggle("active");
}

icon.addEventListener("animationstart", animateStart);
icon.addEventListener("animationend", animateEnd);

function animateStart() {
  // this.style.opacity = "0";
}

function animateEnd() {
  icon.classList.remove("active");
}

//Add form event listener
form.addEventListener("submit", e => {
  e.preventDefault();
  loader.classList.remove("hidden");
  const cityName = form.city.value.trim();
  form.reset();
  getWeather(cityName)
    .then(data => {
      updateUI(data, cityName);

      //set local storage
      if (data.cod == 200) {
        localStorage.setItem("city", cityName);
      }
    })
    .catch(err => console.log(err));
});

//Updating the UI based on the data in Local Storage
if (localStorage.getItem("city")) {
  getWeather(localStorage.getItem("city"))
    .then(data => updateUI(data, localStorage.getItem("city")))
    .catch(err => console.log(err));
}
