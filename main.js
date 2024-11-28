var showingPassword = false; // Wachtwoord zichtbaarheid
var switched = false; // Kaarten omgewisseld status

function switchCards() {
  var formCardElement = document.getElementById("form-section"); // Zoek formulier kaart
  var credentialsCardElement = document.getElementById("credentials-section"); // Zoek inloggegevens kaart

  if (formCardElement && credentialsCardElement) { // Controleer of beide bestaan
    var parent = formCardElement.parentNode; // Vind ouder

    if (!switched) { // Als niet omgewisseld
      parent.insertBefore(formCardElement, credentialsCardElement); // voeg toe en wissel volgorde om
      parent.insertBefore(credentialsCardElement, formCardElement);  // voeg toe en wissel volgorde om
    } else { // Als omgewisseld
      parent.insertBefore(credentialsCardElement, formCardElement);  // voeg toe en wissel volgorde om
      parent.insertBefore(formCardElement, credentialsCardElement);  // voeg toe en wissel volgorde om
    }

    switched = !switched; // Toggle status
  }
}

function showPassword(index) {
  var passwordInput = document.getElementById("password" + index); // Zoek wachtwoordveld
  var showButton = document.getElementById("showButton" + index); // Zoek knop om wachtwoord te tonen

  passwordInput.type = "text"; // Verander type naar tekst
  showButton.textContent = "Verberg"; // Verander knoptekst

  showingPassword = true; // Wachtwoord zichtbaar
}

function hidePassword(index) {
  var passwordInput = document.getElementById("password" + index); // Zoek wachtwoordveld
  var showButton = document.getElementById("showButton" + index); // Zoek knop om wachtwoord te tonen

  passwordInput.type = "password"; // Verander type naar wachtwoord
  showButton.textContent = "Toon"; // Verander knoptekst

  showingPassword = false; // Wachtwoord verborgen
}

function showAllPasswords() {
  var savedCredentialsContainer = document.getElementById("credentials"); // Zoek container voor inloggegevens

  var passwordInputs = savedCredentialsContainer.querySelectorAll('input[type="password"]'); // Zoek alle wachtwoordvelden
  passwordInputs.forEach(function(input) {
    input.type = "text"; // Verander type naar tekst
  });
}

function hideAllPasswords() {
  var savedCredentialsContainer = document.getElementById("credentials"); // Zoek container voor inloggegevens

  var passwordInputs = savedCredentialsContainer.querySelectorAll('input[type="text"]'); // Zoek alle tekstvelden
  passwordInputs.forEach(function(input) {
    input.type = "password"; // Verander type naar wachtwoord
  });
}

function deleteCredential(index) {
  var credentials = JSON.parse(localStorage.getItem("credentials")) || []; // Haal opgeslagen inloggegevens op

  credentials.splice(index, 1); // Verwijder opgegeven inloggegevens
  localStorage.setItem("credentials", JSON.stringify(credentials)); // Sla bijgewerkte inloggegevens op

  displaySavedCredentials(credentials); // Laat bijgewerkte inloggegevens zien
}

function displaySavedCredentials(credentials) {
  var savedCredentialsContainer = document.getElementById("credentials"); // Zoek container voor inloggegevens

  if (credentials.length === 0) { // Als er geen inloggegevens zijn
    savedCredentialsContainer.innerHTML = `<div style="margin-bottom: 3px;"><h1>Inloggegevens zijn leeg</h1></div>`; // Toon melding
    return;
  }

  // HTML voor knoppen
  savedCredentialsContainer.innerHTML = `
    <div class="row" style="flex-flow: column wrap; align-content: flex-end;">
      <div class="column" style="margin-top: 10px;">
        <button class="show-all-button" id="showAllButton" onmousedown="showAllPasswords()" onmouseup="hideAllPasswords()">Toon alles</button>
        <button class="remove-all-button" onclick="clearLocalStorage()">Verwijder alles</button>
      </div>
    </div>
  `;

  credentials.forEach(function(credential, index) { // Voor elke set inloggegevens
    // HTML voor elke set inloggegevens
    var addHtml = `
        <div class="card" style="margin-bottom: 3px;">
            <div class="card-heading">
                <h1>${credential.username}</h1>
            </div>
            <div class="card-body">
                <div class="row">
                  <div class="column" style="flex: 45%">
                    <input type="password" class="column" style="align-content: center;" id="password${index}" value="${credential.password}" readonly></input>
                  </div>
                  <div class="column" style="flex: 30%;">
                      <button class="show-button" id="showButton${index}" onmousedown="showPassword(${index})" onmouseup="hidePassword(${index})">Toon</button>
                      <button class="remove-button" onclick="deleteCredential(${index})" >Verwijder</button>
                  </div>
                </div>
            </div>
        </div>
    `;

    savedCredentialsContainer.insertAdjacentHTML('afterbegin', addHtml); // Voeg HTML toe
  });
}

function clearLocalStorage() {
  localStorage.removeItem("credentials"); // Verwijder opgeslagen inloggegevens
  displaySavedCredentials([]); // Laat leeg scherm zien

  alert("Gegevens zijn verwijderd"); // Toon melding
}

function handleSubmit(event) {
  event.preventDefault(); // Voorkom standaardgedrag

  var data = new FormData(event.target); // Haal gegevens op

  var username = data.get('username'); // Haal gebruikersnaam op
  var password = data.get('password'); // Haal wachtwoord op

  if (username && password) { // Als beide zijn ingevuld
    var credentials = JSON.parse(localStorage.getItem("credentials")) || []; // Haal opgeslagen inloggegevens op

    credentials.push({ username: username, password: password }); // Voeg nieuwe toe

    localStorage.setItem("credentials", JSON.stringify(credentials)); // Sla op
    displaySavedCredentials(credentials); // Laat zien

    form.reset(); // Reset formulier

    alert("Inloggegevens succesvol opgeslagen!"); // Toon melding
  } else {
    alert("Geef zowel de gebruikersnaam als het wachtwoord op."); // Toon melding
  }
}

var form = document.querySelector("form"); // Zoek formulier
form.addEventListener('submit', handleSubmit); // Voeg eventlistener toe

window.onload = function() { // Wanneer pagina geladen is
  var savedCredentials = JSON.parse(localStorage.getItem("credentials")) || []; // Haal opgeslagen inloggegevens op
  displaySavedCredentials(savedCredentials); // Laat zien
};
