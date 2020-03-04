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
getAllFlights().then(data => { console.log(data)})