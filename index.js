const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Handle JSONs
app.use(express.json({ limit: '1mb' }));

// Set path for public files 
app.use(express.static('public'));

// Set port for client requests
const port = process.env.PORT || 5500;
app.listen(port);
console.log(`Server started at ${port}`);

// When the client loads the site, they send the server their local timestamp
// which we use to query a NASA API for the current asteroid data
app.post('/api', async (request, response) => {
    try {
        // Get date in YYYY-MM-DD format from client's timestamp
        const dateQuery = request.body.todaysDate.slice(0,10);
        
        // Query NASA API and relay data to client
        const apiKey = process.env.API_KEY;
        const nasaEndpoint = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateQuery}&api_key=${apiKey}`;
        const nasaResponse = await fetch(nasaEndpoint);
        if (nasaResponse.ok) {
            const data = await nasaResponse.json();
            response.send(data);
            response.end();
            return
        }
        // Error can occur if the NASA API request limit is reached
        throw new Error('Request failed!');
    } catch (error) {
        console.log(error)
        response.status(404).end();
    }
});
