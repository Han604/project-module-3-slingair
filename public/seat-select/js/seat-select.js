const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const givenName = document.getElementById('givenName');
const surName = document.getElementById('surname');
const email = document.getElementById('email');
const referenceButton = document.getElementById('reference-button');
const reference = document.getElementById('reference')
const flightsArray = [];
let selection = '';

const renderSeats = (data) => {
    document.querySelector('.form-container').style.display = 'block';
    const seatsSection = document.getElementById('seats-section')
    seatsSection.innerHTML =''
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li')
            const specificSeat = data.find(item => item.id === seatNumber)
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`  
            if (specificSeat.isAvailable === true) {
                seat.innerHTML = seatAvailable;
            } else {
                seat.innerHTML = seatOccupied;
            }
            row.appendChild(seat);
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}


const toggleFormContent = (event) => {
    const flightNumber = flightInput.value;
    console.log('toggleFormContent: ', flightNumber);
    const flightNumberSplit = flightNumber.split('')
    flightNumberSplit.forEach(item => {
        if (isNaN(item)) {
            item = item.toUpperCase()
        }
    })
    if (flightNumberSplit.length !== 5) {
        console.log('please insert a valid flight number')
    }
    if (flightNumberSplit[0].toUpperCase() == 'S' &&
        flightNumberSplit[1].toUpperCase() == 'A' &&
        !isNaN(flightNumberSplit[2]) && 
        !isNaN(flightNumberSplit[3]) && 
        !isNaN(flightNumberSplit[4])) {
            fetch(`/${flightNumber.toUpperCase()}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => renderSeats(data.data));
    } else {console.log('please insert a valid flight number')}
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?
    
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
}

const handleConfirmSeat = (event) => {
    event.preventDefault();
    data = {
        seat: selection,
        givenName: givenName.value,
        surname: surName.value,
        email: email.value,
        flight: flightInput.value.toUpperCase()
    }
    fetch ('/confirmation', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        return res.json()})
    .then(res=>{
        if (res.success === 'successful') {
            window.location.href = `/seat-select/confirmed.html?selection=${data.seat}&givenName=${data.givenName}&surName=${data.surname}&email=${data.email}&flightnumber=${data.flight}`
        }
    })
        // TODO: everything in here!
}

const handleReference = (event) => {
    event.preventDefault()
    console.log('working')
    fetch (`/fetchUser/${reference.value}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log('working2')
        console.log(res)
        const {data, status} = res
        console.log('data',data, 'status', status)
        if (status === 200) {
            window.location.href = `/seat-select/confirmed.html?selection=${data.seat}&givenName=${data.givenName}&surName=${data.surname}&email=${data.email}&flightnumber=${data.flight}`
        } else {
            console.log('try again fuckboy')
        }
    })
}
referenceButton.addEventListener('onclick', handleReference)
flightInput.addEventListener('blur', toggleFormContent);