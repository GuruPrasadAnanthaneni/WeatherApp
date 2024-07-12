var apiKey = "143507dfa60df05aea721e933fca1dc3";
var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?id=524901";

var searchBox = document.querySelector(".search .input1");
var searchBtn = document.querySelector(".search button");

async function fetchWeatherData(cityName) {
    const response = await fetch(apiUrl + `&q=${cityName}&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
    console.log(data.city.name);

    function formatDate(inputDates) {
        const currentDate = new Date(); 
        const monthNames = [
            "JAN", "FEB", "MAR",
            "APR", "MAY", "JUN", "JUL",
            "AUG", "SEP", "OCT",
            "NOV", "DEC"
        ];
    
        const nextForecastDates = inputDates.filter(forecast => {
            const date = new Date(forecast.dt_txt);
            return date > currentDate;
        });

        const closestForecastDates = nextForecastDates.reduce((acc, forecast) => {
            const date = new Date(forecast.dt_txt);
            if (date.getHours() === 15) {
                acc.push(forecast);
            } else if (date.getHours() > 15) {
                if (!acc.length || date - new Date(acc[0].dt_txt) < 60 * 60 * 1000) {
                    acc = [forecast];
                }
            }
            return acc;
        }, []);

        return closestForecastDates.map(forecast => {
            const date = new Date(forecast.dt_txt);
            const monthIndex = date.getMonth();
            const day = date.getDate();
            return `${monthNames[monthIndex]} ${day}`;
        });
    }
    let weatherDays = document.querySelector('.weather_days');
    weatherDays.innerHTML = '';

    const formattedDates = formatDate(data.list);

    formattedDates.forEach((formattedDate, index) => {
        const forecast = data.list[index];
        const dayElement = document.createElement('div');
        dayElement.className = 'day'; 
        dayElement.innerHTML = `
            <h4 class="city date_month">${formattedDate}</h4>
            <h5 class="desc city_temp">${Math.round(forecast.main.temp - 273.15)}°C</h5>`;
        weatherDays.appendChild(dayElement);
    });
    document.querySelector(".weather .city").innerHTML = data.city.name;
    document.querySelector(".cloudy").innerHTML = data.list[1].weather[0].main;
    document.querySelector('.humidity').innerHTML = data.list[1].main.humidity+" %";
    document.querySelector(".wind").innerHTML = data.list[1].wind.speed+" km/h";
}
searchBtn.addEventListener("click", function () {
    var city = searchBox.value;
    fetchWeatherData(city);
});


