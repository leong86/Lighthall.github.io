const firebaseConfig = {
  apiKey: "AIzaSyCxj2zmJYk3Dk0NTxt7TU5sm1R1UviJZcQ",
  authDomain: "test-88515.firebaseapp.com",
  databaseURL: "https://test-88515-default-rtdb.firebaseio.com",
  projectId: "test-88515",
  storageBucket: "test-88515.appspot.com",
  messagingSenderId: "962534041414",
  appId: "1:962534041414:web:73a7c877092aa481276747"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database
var dbRef = firebase.database().ref();

// ---------------------------------------------------------------
  function incrementCount() {
    clickCount++;
    localStorage.setItem("clickCount", clickCount);
    document.getElementById("clickCount").innerHTML = clickCount;
    getLocation();
    recordClickTime();
}

function resetCount() {
    clickCount = 0;
    localStorage.setItem("clickCount", clickCount);
    document.getElementById("clickCount").innerHTML = clickCount;
}

// Show your position 
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}

// Get the user's country based on their IP address
function recordClickTime() {
  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      let country = data.country_name;
      let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;

      // save the click data to Firebase Realtime Database
      dbRef.child("clicks").child(country).set({
        country: country,
        clickCount: clickCount + 1,
        timestamp: new Date().getTime(),
      });

      let tableRows = document.querySelectorAll("#clickTableBody tr");
      let rowFound = false;
      // Loop through the existing rows to find the one for the user's country
      tableRows.forEach((row) => {
        if (row.cells[0].innerText === country) {
          // Update the click count for the existing row
          row.cells[1].innerText = parseInt(row.cells[1].innerText) + 1;
          rowFound = true;
        }
      });
      // If a row for the country wasn't found, create a new one
      if (!rowFound) {
        let tableRow = document.createElement("tr");
        let countryCell = document.createElement("td");
        let clicksCell = document.createElement("td");
        let countryText = document.createTextNode(country);
        let clicksText = document.createTextNode("1");
        countryCell.appendChild(countryText);
        clicksCell.appendChild(clicksText);
        tableRow.appendChild(countryCell);
        tableRow.appendChild(clicksCell);
        document.getElementById("clickTableBody").appendChild(tableRow);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
