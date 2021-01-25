let projectData = {};
const savedTrips = document.getElementById('savedTrips');

// Create a seperate module?
const calcuateDaysToGo = (futureDate) => {
    const differenceInDays = new Date(futureDate) - new Date();
    let daysToGo = new Date(differenceInDays) / (24 * 3600 * 1000);
    daysToGo = Number(Math.round(daysToGo));
    return daysToGo;
};

// TODO: Move to separate file, view template?
const renderHTMLTemplate = (
    destinationImage,
    destination,
    daysToGo,
    weatherData,
    savedTripId,
    save = true
) => {
    return `
        <div class="card__image">
            <img src="${destinationImage}">
        </div>
        <div class="card__body">
            <div class="card__text">
                ${
                    save
                        ? '<h2>' + destination + '</h2>'
                        : '<h4>' + destination + '</h4>'
                }
                <p>Your trip is in ${daysToGo} days time</p>
            </div>
            <div class="card__weather">
                <div class="card__weather--icon">
                    <img src="icons/${weatherData[0].weather.icon}.png" alt="">
                </div>
                <div class="card__weather--info">
                    <p class="temp">
                        ${weatherData[0].temp}<sup>&#8451;</sup>
                    </p>
                    <p>${weatherData[0].weather.description}</p>
                </div>
            </div>
        </div>
        <div class="card__footer">
            <button 
                class="btn btn__save" 
                type="button" 
                data-trip-id="${savedTripId}" 
                onclick="return ${
                    save ? 'Client.saveTrip()' : 'Client.removeTrip()'
                }">
                    ${
                        save
                            ? '<i class="far fa-heart"></i>'
                            : '<i class="far fa-trash-alt"></i>'
                    }
                    ${save ? 'Save' : 'Remove'} Trip
            </button>
        </div>
    `;
};

// TODO: Move to a separate file?
(function checkLocalStorage() {
    // Retrieve the object from storage
    const localStorageSavedTrips = JSON.parse(localStorage.getItem('tripData'));

    if (localStorageSavedTrips != null) {
        let documentFragment = new DocumentFragment();
        for (let localStorageSavedTrip of localStorageSavedTrips) {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'card--column');

            // Calcuate the number of days to go
            const daysToGo = calcuateDaysToGo(
                localStorageSavedTrip.departureDate
            );

            cardElement.innerHTML = renderHTMLTemplate(
                localStorageSavedTrip.pixabayData.webformatURL,
                localStorageSavedTrip.destination,
                daysToGo,
                localStorageSavedTrip.weatherData,
                localStorageSavedTrip.id,
                false
            );

            documentFragment.appendChild(cardElement);
        }
        savedTrips.appendChild(documentFragment);
    }
})();

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

        const daysToGo = calcuateDaysToGo(departureDate.value);
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

        const innerCard = renderHTMLTemplate(
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
        const daysToGo = calcuateDaysToGo(savedTrip.departureDate);
        let destinationImage = savedTrip.pixabayData.webformatURL;
        if (!destinationImage) destinationImage = 'images/placeholder.jpg';

        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'card--column');

        cardElement.innerHTML = renderHTMLTemplate(
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
    // TODO: Could I replace this whis event bubbling?
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
