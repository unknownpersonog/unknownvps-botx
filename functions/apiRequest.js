require('dotenv').config();

var headers = {
    'X-Access-Token': process.env.ACCESS_TOKEN,
    'Content-Type': 'application/json'
}

async function makeRequest(method, endpoint, data) {
    // If method is 'GET' and data is supplied, return an error
    if (method === 'GET' && data) {
        return console.log('Error: Data cannot be sent with a GET request');
    }

    // If data is supplied, use 'POST' method
    if (data) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${process.env.API_ENDPOINT}${endpoint}`, {
        method: method,
        headers: headers,
        // If data is supplied, include it in the body of the request
        body: data ? JSON.stringify(data) : null
    });

    try {
        const data = await response.json();
        if (response.status === 200) {
            return {message: data.message, data: data, headers: response.headers, response: response}
        }
        else {
            return {message: data.error, data: data, headers: response.headers, response: response}
        }
    } catch (err) {
        return console.log('Internal Server Error (Probably Faulty URL)');
    }
}

module.exports = makeRequest;
