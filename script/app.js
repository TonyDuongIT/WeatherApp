const key = "c3a7d04abef6d88b4796d2ba4957886c";

const container = document.querySelector(".container");
const form = document.querySelector(".form");
const searchBox = document.querySelector(".search-box");
const alert = document.querySelector(".alert");
const icon_wrapper = document.querySelector(".icon-container");

const details = document.querySelector(".details");
const condition = document.querySelector(".condition");
const loc = document.querySelector(".location");
const temp = document.querySelector(".temperature");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const weatherContent = document.querySelector(".weather-content");
const icon = document.querySelector("[data-icon]");

const getWeather = async cityName => {
  // const proxy = "https://cors-anywhere.herokuapp.com/";
  const base = `https://api.openweathermap.org/data/2.5/weather`;
  let query = "";
  let country = "";

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

const updateUI = (data, cityName) => {
  // console.log(data);
  if (data.cod != "200") {
    alert.style.display = "inline-block";
    if (cityName.length === 0) {
      alert.textContent = "Field is empty, please enter a location!";
    } else {
      alert.textContent = "City not found, please try again!";
    }
  } else {
    alert.style.display = "none";
    weatherContent.style.display = "block";
    // icon_wrapper.style.display = "inline-block";
    loc.textContent = `${data.name}, ${data.sys.country}`;
    condition.textContent = `${data.weather[0].description}`;
    // temp.textContent = `${data.main.temp}`;
    // pressure.textContent = `${data.main.pressure}`;
    // humidity.textContent = `${data.main.humidity}`;

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

    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );

    if (data.weather[0].icon.includes("d")) {
      if (container.classList.contains("night")) {
        container.classList.remove("night");
      }
      if (container.classList.contains("day")) {
        container.classList.remove("day");
      }
      container.classList.add("day");
      const day = document.querySelector(".day");

      day.style.backgroundImage = `url("https://source.unsplash.com/featured/?day,${data.name}")`;
      console.log("log", day.style.backgroundImage);
      day.style.backgroundRepeat = "no-repeat";
      day.style.backgroundPostition = "center center";
      day.style.backgroundSize = "cover";
      container.style.color = "white";
    } else {
      if (container.classList.contains("day")) {
        container.classList.remove("day");
      }
      if (container.classList.contains("night")) {
        container.classList.remove("night");
      }
      container.classList.add("night");
      const day = document.querySelector(".night");
      day.style.backgroundImage = `url("https://source.unsplash.com/featured/?night,${data.name}")`;
      day.style.backgroundRepeat = "no-repeat";
      day.style.backgroundPostition = "center center";
      day.style.backgroundSize = "cover";
      container.style.color = "white";
    }
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
  }
};

form.addEventListener("submit", e => {
  e.preventDefault();
  const cityName = form.city.value.trim();
  // console.log("city name", cityName);
  form.reset();
  getWeather(cityName)
    .then(data => updateUI(data, cityName))
    .catch(err => console.log(err));

  //set local storage
  localStorage.setItem("city", cityName);
});

if (localStorage.getItem("city")) {
  getWeather(localStorage.getItem("city"))
    .then(data => updateUI(data, localStorage.getItem("city")))
    .catch(err => console.log(err));
}
