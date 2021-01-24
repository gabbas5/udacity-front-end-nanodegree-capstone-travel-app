const getGeonameData = async (destination) => {
    const requestBody = {
        BASE_URL: `http://api.geonames.org/searchJSON?formatted=true&q=${destination}`,
    };

    const geonameResponse = await fetch('/geo-name-locations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const geonameData = await geonameResponse.json();
    return geonameData;
};

export { getGeonameData };
