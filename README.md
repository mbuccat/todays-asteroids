# Today's Asteroids
**A site that displays information about near earth objects for the current day.**\
View it here: https://todays-asteroids.herokuapp.com/

Data is fetched from the _Asteroids - NeoWs API_ maintained by NASA's JPL Asteroid team.\
It can be found here: https://api.nasa.gov/.

## To Run Locally
1. Fork this repository.

2. Clone your fork.

3. Within your cloned repository, create a `.env` file to hold an `API_KEY` variable (see `.env_sample` for help). You can use `DEMO_KEY` as an API key or sign up for a NASA developer key here: https://api.nasa.gov/.

4. In your terminal, use `npm i` to install dependencies.

5. Then, use `npm start`. The site will be available at localhost port 5500.