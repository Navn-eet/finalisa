<!DOCTYPE html>
<html>
<head>
  <title>Weather Data</title>
  <style>
    /* CSS styles */

    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      text-align: left;
      padding: 8px;
    }
    tr:nth-child(even){background-color: #f2f2f2}
    th {
      background-color: #1e1e1e;
      color: white;
    }
    .weather-app {
      background-color: #1e1e1e; 
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 11px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }
    form button[type="submit"] {
      background-color: #1e1e1e; 
      border: none;
      color: white;
      padding: 5px 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 12px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
    }
  </style>
</head>
<body onload="loadData()">
  <h1>Previous seven days Data</h1>
  <button class="weather-app" onclick="location.href='index.html'">Weather App</button>
  <form method="get">
    <input type="text" name="city" placeholder="Enter city name">
    <button type="submit">Search</button>
  </form>
  <table id="weather-data-table">
    <tr>
      <th>Date Time</th>
      <th>City Name</th>
      <th>Description</th>
      <th>Temperature (°C)</th>
      <th>Humidity (%)</th>
      <th>Wind (km/h)</th>
      <th>UV</th>
    </tr>
  </table>
  <script>
    function loadData() {
      if (!navigator.onLine) {
        alert("You are offline. Data may not be updated.");
        const weatherData = JSON.parse(localStorage.getItem('weatherData'));
        const table = document.getElementById('weather-data-table');
        if (weatherData !== null) {
          console.log("Retrieving data from localStorage.");
          weatherData.forEach(item => {
            const row = document.createElement('tr');
            Object.keys(item).forEach(key => {
              if (key !== "DELETE") {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
              }
            });
            table.appendChild(row);
          });
        }
      } else {
        alert("You are online.");
      }
    }
    
    function createTable(data) {
      console.log("Retrieving data from the database.");
      const table = document.getElementById('weather-data-table');
      data.forEach(item => {
        const row = document.createElement('tr');
        Object.keys(item).forEach(key => {
          if (key !== "DELETE") {
            const cell = document.createElement('td');
            cell.textContent = item[key];
            row.appendChild(cell);
          }
        });
        table.appendChild(row);
      });
      // Store the data in local storage
      localStorage.setItem('weatherData', JSON.stringify(data));
    }
  </script>
  <!-- PHP code -->
  <?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "2329214";
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
    }

    $apiKey = "13c8d8e98039450c8de175654232005";
    $city = isset($_GET['city']) ? mysqli_real_escape_string($conn, $_GET['city']) : "Gadsden";
    $url = "http://api.weatherapi.com/v1/current.json?key=" . $apiKey . "&q=" . $city;

    try {
      $response = json_decode(@file_get_contents($url));
      if (!$response) {
        throw new Exception("Failed to get data from weather API.");
      }
    } catch (Exception $e) {
      echo "Error: " . $e->getMessage() . "<br>";
      $response = null;
    }

    $data = array();

    if (isset($response->location)) {
      $latestDateQuery = "SELECT MAX(datetime) AS latest_datetime FROM weather_data WHERE city = '$city'";
      $latestDateResult = mysqli_query($conn, $latestDateQuery);
      $latestDateRow = mysqli_fetch_assoc($latestDateResult);
      $latestDate = $latestDateRow['latest_datetime'];
      $phpWeatherData = [];

      for ($i = 0; $i <= 7; $i++) {
        $date = date('Y-m-d', strtotime('-' . $i . ' days'));
        $historyUrl = "http://api.weatherapi.com/v1/history.json?key=" . $apiKey . "&q=" . $city . "&dt=" . $date;
        $historyResponse = json_decode(file_get_contents($historyUrl));

        if (isset($historyResponse->forecast->forecastday)) {
          $dayData = $historyResponse->forecast->forecastday[0];
          $day = $dayData->day;
          $cond = $dayData->day->condition;
          $uv = $dayData->day->uv;
          $sql = "REPLACE INTO weather_data (datetime, city, description, temperature, humidity, wind, uv)
                  VALUES ('$date', '$city', '$cond->text', '$day->avgtemp_c', '$day->avghumidity', '$day->maxwind_kph', '$uv')";
          if (mysqli_query($conn, $sql)) {
            // echo " ".$city."".$date."<br>";
          } else {
            echo "Error inserting data: " . mysqli_error($conn) . "<br>";
          }
          $phpWeatherData[] = array(
            "datetime" => $date,
            "city" => $city,
            "description" => $cond->text,
            "temperature" => $day->avgtemp_c,
            "humidity" => $day->avghumidity,
            "wind" => $day->maxwind_kph,
            "uv" => $uv
          );
        } else {
          echo "Error fetching weather data for " . $city . " on " . $date . "<br>";
        }
      }
    }

    mysqli_close($conn);

    // Pass the weather data to a JavaScript function
    echo "<script>";
    echo "const weatherData = " . json_encode($phpWeatherData) . ";";
    echo "createTable(weatherData);"; // This function should create a table using the weather data
    echo "</script>";
  ?>
</body>
</html>
