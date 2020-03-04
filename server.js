'use strict';

const request = require('request-promise')
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {flights} = require('../project-module-3-slingair/test-data/flightSeating')

const PORT = process.env.PORT || 8000;

const getAllFlights = async () => {
    try {
        const options = {
            uri: `https://journeyedu.herokuapp.com/slingair/flights`,
            headers: { 
                'Accept': 'application/json'
            }
        }
        const data = await request(options)
        return JSON.parse(data);
    } catch (err) {console.log(err)}
}

const getSpecificFlightSeating = async (flightNumber) => {
    try {
        const options = {
            uri: `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`,
            headers: { 
                'Accept': 'application/json'
            }
        }
        const data = await request(options)
        return JSON.parse(data);
    } catch (err) {console.log(err)}
}

const fetchUser = async(referenceId) => {
    try {
        const options = {
            uri: `https://journeyedu.herokuapp.com/slingair/users/${referenceId}`,
            headers: { 
                'Accept': 'application/json'
            }
        }
        const data = await request(options)
        return JSON.parse(data);
    } catch (err) {console.log(err)}
}

const bookUser = async (userData) => {
    try {
        const options = {
            method: 'POST',
            uri: `https://journeyedu.herokuapp.com/slingair/users`,
            body: userData,
            json: true,
            headers: { 
                'Accept': 'application/json'
            }
        }
        const data = await request(options)
        return JSON.parse(data);
    } catch (err) {console.log(err.message)}
}

const seatHandler = async (req, res) => {
    const flightId = req.params.flightNumber;
    const allFlights = (await getAllFlights()).flights;
    if (allFlights.find(flight => flight === flightId)) {
        const seating = (await getSpecificFlightSeating(flightId))[flightId];
        res.send({data: seating})
    } else {
        console.log('invalid flight number')
    }
}

const handleConfirmation = async (req, res) => {
    const {seat, givenName, surname, email, flight} = req.body
    console.log(seat, givenName, surname, email, flight);
    const payload = {givenName, seat, surname, email, flight};
    console.log(payload)
    const bookingInfo = await bookUser(payload)
    res.send({success:'successful'})
}

const handleUser = async (req, res) => {
    const refId = req.params.user;
    const userData = await fetchUser(refId)
    console.log(userData.data)
    res.send({data: userData.data,
            status: userData.status})
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    .use(express.static('public'))
    
    // endpoints
    .get('/:flightNumber', seatHandler)
    .post('/confirmation', handleConfirmation)
    .get('/fetchUser/:user', handleUser)
    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));