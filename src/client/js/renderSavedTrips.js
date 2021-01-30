const renderSavedTrips = () => {
    // Retrieve the object from storage
    const localStorageSavedTrips = JSON.parse(localStorage.getItem('tripData'));

    if (localStorageSavedTrips != null) {
        let documentFragment = new DocumentFragment();
        for (let localStorageSavedTrip of localStorageSavedTrips) {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'card--column');

            // Calcuate the number of days to go
            const daysToGo = Client.calculateDaysToGo(
                localStorageSavedTrip.departureDate
            );

            cardElement.innerHTML = Client.renderHTMLTemplate(
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
};

export { renderSavedTrips };
