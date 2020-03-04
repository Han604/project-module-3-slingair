let flightElement = document.getElementById('flight')
let nameElement = document.getElementById('name')
let emailElement = document.getElementById('email')
let seatElement = document.getElementById('seat')
let referenceElement = document.getElementById('reference')
let urlParams = new URLSearchParams(window.location.search);
const selection = urlParams.get('selection');
const givenName = urlParams.get('givenName');
const surName = urlParams.get('surName');
const email = urlParams.get('email');
const flightNumber = urlParams.get('flightnumber');
const referenceId = urlParams.get('referenceid')
flightElement.innerText = flightNumber;
nameElement.innerText = `${givenName} ${surName}`;
seatElement.innerText = selection;
emailElement.innerText = email;
referenceElement.innerText = referenceId;
console.log(selection, givenName, surName, email, flightNumber)