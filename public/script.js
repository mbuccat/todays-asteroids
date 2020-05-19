// Get today's date and display it on the home page
const todaysDate = new Date();
const dateDisplayOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
document.getElementById('date').append(todaysDate.toLocaleDateString(undefined, dateDisplayOptions));

// Query server for today's asteroid data
async function getAsteroidData() {
    try {
        const fetchRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todaysDate })
        }
        const response = await fetch('/api', fetchRequestOptions);
        if (response.ok) {
            const responseJson = await response.json();
            displayData(responseJson);  // render data on home page
            return
        }
        throw new Error('Request failed!');
    } catch (error) {
        displayErrorMessage();
    }
}

// Helper function for displaying asteroid data on the home page
// Asteroids are represented as follows:
// asteroid (list item) -> 
//     asteroid properties (unordered list) -> 
//         each property's decription and value (list item)
function displayData(responseJson) {
    const mainAsteroidList = document.getElementById('asteroid-list');

    // Only get asteroids for today's date from the reponse JSON
    const i = todaysDate.toISOString().slice(0, 10)  // YYYY-MM-DD format
    const todaysAsteroids = responseJson.near_earth_objects[i];

    // Add appropriate DOM elements for each asteroid (near earth object)
    todaysAsteroids.forEach(neo => {
            // Just to make navigating the JSON easier
            let closeApproachData = neo.close_approach_data[0];

            // Get relevant data from the JSON
            // Make sure to format large numbers
            let asteroidData = [
                closeApproachData.close_approach_date_full.slice(-5, ), // Timestamp ##:##
                
                parseInt(closeApproachData.miss_distance.kilometers).toLocaleString(),
                
                parseInt(closeApproachData.miss_distance.miles).toLocaleString(),
                
                parseInt(closeApproachData.relative_velocity.kilometers_per_second).toLocaleString(),
                
                parseInt(closeApproachData.relative_velocity.kilometers_per_hour).toLocaleString(),
                
                parseInt(closeApproachData.relative_velocity.miles_per_hour).toLocaleString(),
                
                neo.is_potentially_hazardous_asteroid,
                
                neo.is_sentry_object
            ]

            // Create asteroid element
            let asteroid = document.createElement('li');
            asteroid.setAttribute("class", "asteroid");

            // Add name to the asteroid and a link to its NASA JPL page
            let asteroidName = document.createElement('a');
            asteroidName.setAttribute("class", "asteroid-name");
            asteroidName.setAttribute("href", neo.nasa_jpl_url);
            asteroidName.appendChild(document.createTextNode(neo.name));
            asteroid.appendChild(asteroidName);

            // Create list to hold asteroid's properties
            let asteroidPropertiesList = document.createElement('ul');
            asteroidPropertiesList.setAttribute("class", "asteroid-properties-list");

            // Add each property to the asteroid's list of properties
            let asteroidProperties = makeListItems(asteroidData);
            asteroidProperties.forEach(property => {
                asteroidPropertiesList.appendChild(property);
            })

            // Add properties to asteroid
            // and the asteroid itself to the main list of asteroids
            asteroid.appendChild(asteroidPropertiesList);
            mainAsteroidList.appendChild(asteroid);
        }

    )
}

// Helper function to make adding an asteroid's properties as list items easier
function makeListItems(asteroidData) {
    const listItems = []  // to be returned
    const descriptions = [
        'Closest approach time: ',
        'Closest distance in kilometers: ',
        'Closest distance in miles: ',
        'Relative velocity in kilometers per second: ',
        'Relative velocity in kilometers per hour: ',
        'Relative velocity in miles per hour: ',
        'Potentially hazardous: ',
        'Sentry object: ',
    ]

    for (let i = 0; i < 8; i++) {
        let asteroidProperty = document.createElement('li');
        asteroidProperty.setAttribute("class", "asteroid-property");

        let dataValue = document.createElement('span');
        dataValue.setAttribute("class", "data-value");
        dataValue.appendChild(document.createTextNode(asteroidData[i]));

        // Add the property description and its value
        asteroidProperty.appendChild(document.createTextNode(descriptions[i]));
        asteroidProperty.appendChild(dataValue);

        listItems[i] = asteroidProperty;
    }

    return listItems
}

// Helper function to add an error message when asteroid data is unavailable
function displayErrorMessage() {
    const mainAsteroidList = document.getElementById('asteroid-list');

    let ErrorMessage = document.createElement('li');
    ErrorMessage.setAttribute("class", "asteroid");
    ErrorMessage.appendChild(document.createTextNode(
        'Sorry, something went wrong! We could not get the asteroid data. Please try again in an hour.'
    ));

    mainAsteroidList.appendChild(ErrorMessage);
}

getAsteroidData();
