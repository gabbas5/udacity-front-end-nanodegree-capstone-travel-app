// This function will render the trips details in a card format
// Styling will be different for saved trips and the trip search result, this can be set using the save parameter
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

export { renderHTMLTemplate };
