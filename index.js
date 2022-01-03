const card = document.querySelector("#card");
const loader = document.querySelector("#loaderContainer");
const loaderImg = document.querySelector("#loaderImg");
const humidityElem = document.querySelector("#humidity");
const windElem = document.querySelector("#wind");
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=4e1567a23c7ba9bb05bb3eb7d19d4c6f`;
      weatherFetch(URL);
    },
    (error) => {
      if (error.code == error.PERMISSION_DENIED){

        const URL = `https://api.openweathermap.org/data/2.5/weather?q=argentina&lang=es&units=metric&appid=4e1567a23c7ba9bb05bb3eb7d19d4c6f`;
        weatherFetch(URL);
    }
    });
  }
  
});

const weatherFetch = (URL) => {
  fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getSvg(data)
      getCountry(data);
      getTemperature(data);
      getHumidityAndWind(data);
      if (data) {
        loader.classList.toggle("loaderHidden");
      }
    })
    .catch((error) => {
      if (error) {
        document.querySelector("#widgetError").style.transform =
          "translateY(0px)";
        document.querySelector("#widgetError").style.visibility = "visible";
        loader.classList.toggle("loaderHidden");
        setTimeout(() => {
          document.querySelector("#widgetError").style.transform ="translateY(-350%)";
          document.querySelector("#widgetError").style.visibility = "hidden";
        }, 3000);
      }
    });
};

const inputSearch = document.querySelector("input");
inputSearch.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    let city = inputSearch.value.replace(/" "/i, "");
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&units=metric&appid=4e1567a23c7ba9bb05bb3eb7d19d4c6f`;
    weatherFetch(URL);
    loader.classList.toggle("loaderHidden");
  }
});

const getTemperature = (data) => {
  const descriptionDay = document.querySelector("#descriptionDay");
  const getTemp = document.querySelector("#tempDay");
  let { temp } = data.main;
  temp = Math.round(temp);
  const { description } = data.weather[0];
  getTemp.textContent = temp + " °C";
  descriptionDay.textContent = description;
};

const getCountry = (data) => {
  const country = document.querySelector("#country");
  country.textContent = data.name + ", " + data.sys.country;
};

const getHumidityAndWind = (data) => {
  const { speed } = data.wind;
  const { humidity } = data.main;
  const windSpeed = speed * 3.6;
  const windSpeedKm = windSpeed.toFixed(1);
  humidityElem.textContent = `Humedad ${humidity}%`;
  windElem.textContent = `Viento ${windSpeedKm} km/h`;
};

const getSvg = (data) => {
  const svgImg = document.querySelector("#svgImg");
  const body = document.querySelector("body");

  switch (data.weather[0].main) {
    case "Thunderstorm":
      svgImg.src = "animated/thunder.svg";
      bodyStyle = "background-image: url(/assets/thunder.jpg)";
      break;
    case "Drizzle":
      svgImg.src = "animated/rainy-2.svg";
      body.style.backgroundImage = "url(/assets/drizzle.jpg)";
      break;

    case "Rain":
      svgImg.src = "animated/rainy-7.svg";
      body.style.backgroundImage = "url(assets/rain.jpg)";
      break;

    case "Snow":
      svgImg.src = "animated/snowy-6.svg";
      body.style.backgroundImage = "url(/assets/snow.jpg)";
      break;
    case "Clear":
      svgImg.src = "animated/day.svg";
      body.style.backgroundImage = "url(assets/clear.jpg)";
      break;
    case "Atmosphere":
      svgImg.src = "animated/weather.svg";
      body.style.backgroundImage = "url(/assets/atmosphere.jpg)";
      break;
    case "Clouds":
      svgImg.src = "/animated/cloudy.svg";
      body.style.backgroundImage = "url(/assets/cloudy.jpg)";

      break;
    default:
      svgImg.src = "animated/cloudy-day-1.svg";
      body.style.backgroundImage = "url(assets/clear.jpg)";
  }
};
