const getPixabayImages = async (
    photoType,
    category,
    isSafeSearch,
    orderBy,
    imageFormat,
    destination
) => {
    const pixabayDestination = destination.split(' ').join('+');
    console.log('pixabayDestination: ', pixabayDestination);

    const pixabayRequestBody = {
        BASE_URL: `https://pixabay.com/api/?q=${pixabayDestination}&image_type=${photoType}&category=${category}&safesearch=${isSafeSearch}&order=${orderBy}&orientation=${imageFormat}`,
    };

    const pixabayResponse = await fetch('/pixabay-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pixabayRequestBody),
    });

    const pixabayData = await pixabayResponse.json();
    return pixabayData;
};

export { getPixabayImages };
