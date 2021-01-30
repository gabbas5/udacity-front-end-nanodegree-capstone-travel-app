let projectData = {};
const savedTrips = document.getElementById('savedTrips');

// Render saved trips
document.addEventListener('DOMContentLoaded', () => {
    Client.renderSavedTrips();
});

const handleSubmit = async (event) => {
    event.preventDefault();

    // Get destination and leaving date formsFields
    const destination = document.getElementById('destination');
    const departureDate = document.getElementById('departureDate');

    // Validate the form
    const formElements = [destination, departureDate];
    const isFormValid = Client.validateUserInput(formElements);
    if (!isFormValid) return;

    const tripInfo = document.getElementById('tripInfo');

    let geonameData;
    let weatherData;
    let pixabayData;

    try {
        // Get location details from GeoNamesData
        geonameData = await Client.getGeonameData(destination.value);
        if (geonameData.geonames.length === 0) return;

        // Set latitude and longitude co-ords for the destination
        const lat = geonameData.geonames[0].lat;
        const lon = geonameData.geonames[0].lng;

        const daysToGo = Client.calculateDaysToGo(departureDate.value);
        // Get weather forecast from WeatherBit
        weatherData = await Client.getWeatherBitData(daysToGo, lat, lon);

        pixabayData = await Client.getPixabayImages(
            'photo',
            'travel',
            true,
            'popular',
            'horizontal',
            destination.value
        );

        // Now we have all of the data, set the HTML
        let destinationImage = 'images/placeholder.jpg';
        if (pixabayData.hits.length > 0) {
            destinationImage = pixabayData.hits[0].webformatURL;
        }

        const innerCard = Client.renderHTMLTemplate(
            destinationImage,
            destination.value,
            daysToGo,
            weatherData.data,
            geonameData.geonames.id
        );
        tripInfo.innerHTML = `<div class="card">
        ${innerCard}</div>
        `;

        projectData = {
            id: geonameData.geonames[0].geonameId,
            departureDate: departureDate.value,
            destination: destination.value,
            leavingDate: departureDate.value,
            geonameData: { ...geonameData.geonames[0] },
            weatherData: [...weatherData.data],
            pixabayData: { ...pixabayData.hits[0] },
        };
    } catch (error) {
        console.error(error);
    }
};

const saveTrip = async () => {
    const tripData = await getTripData();

    // Check if the trip has alread been saved
    if (isTripSaved(projectData.id, tripData)) {
        return;
    }

    // I think I need to wait for the response here...?
    postProjectdata('/save-trip', projectData).then(async (savedTrip) => {
        // Put the object into storage
        const updatedTripData = await getTripData();
        localStorage.setItem('tripData', JSON.stringify(updatedTripData));
        // Now we have all of the data, set the HTML
        const daysToGo = Client.calculateDaysToGo(savedTrip.departureDate);
        let destinationImage = savedTrip.pixabayData.webformatURL;
        if (!destinationImage) destinationImage = 'images/placeholder.jpg';

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'card--column');

        cardElement.innerHTML = Client.renderHTMLTemplate(
            destinationImage,
            savedTrip.destination,
            daysToGo,
            savedTrip.weatherData,
            savedTrip.id,
            false
        );

        savedTrips.prepend(cardElement);
    });
};

const removeTrip = async (url = '/remove-saved-trip', data = {}) => {
    const parentCardElelement = event.target.closest('.card');
    // Could I update this to take advantage of event bubbling? I could convert the trip HTML to a list of cards, perhaps more semantic as well...
    const tripId = event.target.dataset.tripId;
    data = { id: tripId };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const tripData = await response.json();

    // Update local storage
    localStorage.setItem('tripData', JSON.stringify(tripData));

    parentCardElelement.remove();
};

const getTripData = async () => {
    const response = await fetch('/get-saved-trips');
    const tripData = await response.json();
    return tripData;
};

const postProjectdata = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

const isTripSaved = (tripToSaveID, savedTrips) => {
    if (savedTrips.length !== 0) {
        for (let trip of savedTrips) {
            if (trip.geonameData.geonameId === tripToSaveID) {
                return true;
            }
        }
        return false;
    }
};

export { handleSubmit, saveTrip, removeTrip };
