const apiKey = '13c8d8e98039450c8de175654232005';
const defaultCity = 'Gadsden';

const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const locationElement = document.querySelector('#loc');
const datetimeElement = document.querySelector('.datetime p');
const tempTitle = document.querySelector('#Title');
const tempValue = document.querySelector('#valueoftitle');
const weatherConditions = document.querySelector('.text_box p:last-child');

const humidityBtn = document.querySelector('#humidityBtn');
const pressureBtn = document.querySelector('#pressureBtn');
const windBtn = document.querySelector('#windBtn');

function fetchWeatherData(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      }

      locationElement.textContent = data.location.name;

      const date = new Date(data.current.last_updated_epoch * 1000);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = days[date.getDay()];
      const dayOfMonth = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      datetimeElement.textContent = `${dayOfWeek} ${dayOfMonth}/${month}/${year}`;

      tempTitle.textContent = 'Temperature';
      tempValue.textContent = `${data.current.temp_c}°C`;
      weatherConditions.textContent = data.current.condition.text;

      const weatherIcon = document.querySelector('.weather-icon .fas');
      weatherIcon.className = 'fas';
      const weatherCode = data.current.condition.code;
      if (weatherCode >= 200 && weatherCode <= 232) {
        weatherIcon.classList.add('fa-bolt');
      } else if (weatherCode >= 300 && weatherCode <= 321) {
        weatherIcon.classList.add('fa-cloud-rain');
      } else if (weatherCode >= 500 && weatherCode <= 531) {
        weatherIcon.classList.add('fa-cloud-showers-heavy');
      } else if (weatherCode >= 600 && weatherCode <= 622) {
        weatherIcon.classList.add('fa-snowflake');
      } else if (weatherCode >= 701 && weatherCode <= 781) {
        weatherIcon.classList.add('fa-smog');
      } else if (weatherCode === 800) {
        weatherIcon.classList.add('fa-sun');
      } else if (weatherCode >= 801 && weatherCode <= 804) {
        weatherIcon.classList.add('fa-cloud');
      }

      const imageButton = document.querySelector('.image-button');
      const modal = document.querySelector('.modal');
      const closeBtn = document.querySelector('.close-btn');

      imageButton.addEventListener('click', () => {
        modal.style.display = 'block';
      });

      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      window.addEventListener('click', event => {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });

      const funFactButton = document.querySelector('#modal-button2');
      const modal2 = document.querySelector('.modal2');
      const closeBtn2 = document.querySelector('.close-btn2');

      funFactButton.addEventListener('click', () => {
        modal2.style.display = 'block';
        getFunFact();
      });

      closeBtn2.addEventListener('click', () => {
        modal2.style.display = 'none';
      });

      window.addEventListener('click', event => {
        if (event.target === modal2) {
          modal2.style.display = 'none';
        }
      });

      const suggestionButton = document.querySelector('#modal-button3');
      const suggestionModal = document.querySelector('#modal3');
      const suggestionCloseButton = document.querySelector('.close-btn3');

      suggestionButton.addEventListener('click', () => {
        suggestionModal.style.display = 'block';
        generateSuggestion(weatherCode);
      });

      suggestionCloseButton.addEventListener('click', () => {
        suggestionModal.style.display = 'none';
      });

      window.addEventListener('click', event => {
        if (event.target === suggestionModal) {
          suggestionModal.style.display = 'none';
        }
      });

      function generateSuggestion(weatherCode) {
        const sugtxt = document.querySelector('#sugtext');

        if (weatherCode >= 200 && weatherCode <= 232) {
          sugtxt.textContent = "It's thunderstorming, stay indoors and keep safe!";
        } else if (weatherCode >= 300 && weatherCode <= 321) {
          sugtxt.textContent = "It's drizzling outside, don't forget your umbrella!";
        } else if (weatherCode >= 500 && weatherCode <= 531) {
          sugtxt.textContent = "It's raining outside, bring your raincoat or umbrella!";
        } else if (weatherCode >= 600 && weatherCode <= 622) {
          sugtxt.textContent = "It's snowing outside, wear warm clothes and boots!";
        } else if (weatherCode >= 701 && weatherCode <= 781) {
          sugtxt.textContent = "It's hazy outside, avoid strenuous outdoor activities!";
        } else if (weatherCode === 800) {
          sugtxt.textContent = "It's a beautiful day, enjoy the sunshine!";
        } else if (weatherCode >= 801 && weatherCode <= 804) {
          sugtxt.textContent = "It's cloudy outside, take an umbrella in case it rains!";
        }
      }

      function getFunFact() {
        const funFact = document.querySelector('#Funfact');
        const facts = [
          'Lightning bolts can sometimes be hotter than the surface of the sun.',
          'The coldest temperature ever recorded on Earth was minus 128.6 degrees Fahrenheit (minus 89.2 degrees Celsius) in Antarctica in 1983.',
          'The largest hailstone ever recorded in the United States was nearly the size of a volleyball, weighing 1.9 pounds and measuring 7.9 inches in diameter.',
          'The wettest place on Earth is Mawsynram, a village in India, which receives an average annual rainfall of 467 inches.',
          'Hurricanes are the most powerful storms on Earth, with winds that can reach over 200 mph.',
          'Hurricanes are named alphabetically each year, with names alternating between male and female.',
          'The world\'s largest snowflake on record measured 15 inches wide and 8 inches thick. It fell in Fort Keogh, Montana in 1887.',
          'The highest temperature ever recorded was 134 degrees Fahrenheit (56.7 degrees Celsius) in Furnace Creek Ranch, California in 1913.',
          'The driest place on Earth is the Atacama Desert in Chile. Some weather stations in the desert have never recorded any rainfall.',
          'The strongest tornado ever recorded had wind speeds of 318 mph (512 km/h). It hit Moore, Oklahoma in 2013.',
          'The Great Red Spot on Jupiter is a storm that has been raging for at least 400 years. It\'s about three times the size of Earth.',
          'The world\'s largest hailstone on record measured 8 inches in diameter and weighed 1.93 pounds. It fell in Vivian, South Dakota in 2010.'
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        funFact.textContent = randomFact;
      }

      humidityBtn.addEventListener('click', () => {
        tempTitle.textContent = 'Humidity';
        tempValue.textContent = `${data.current.humidity}%`;
      });
      pressureBtn.addEventListener('click', () => {
        tempTitle.textContent = 'Pressure';
        tempValue.textContent = `${data.current.pressure_mb} hPa`;
      });
      windBtn.addEventListener('click', () => {
        tempTitle.textContent = 'Wind Speed';
        tempValue.textContent = `${data.current.wind_kph} km/h`;
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

fetchWeatherData(defaultCity);

searchButton.addEventListener('click', () => {
  const city = searchBox.value;
  fetchWeatherData(city);
  searchBox.value = '';
});

searchBox.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    searchButton.click();
  }
});


