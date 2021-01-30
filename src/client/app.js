import { validateUserInput } from './js/validateUserInput';
import { calculateDaysToGo } from './js/calculateDaysToGo';
import { renderHTMLTemplate } from './js/renderHTMLTemplate';
import { renderSavedTrips } from './js/renderSavedTrips';
import { handleSubmit, saveTrip, removeTrip } from './js/formHandler';
import { getGeonameData } from './js/getGeonameData';
import { getWeatherBitData } from './js/getWeatherBitData';
import { getPixabayImages } from './js/getPixabayImages';

import './styles/index.scss';

export {
    validateUserInput,
    calculateDaysToGo,
    renderHTMLTemplate,
    renderSavedTrips,
    handleSubmit,
    saveTrip,
    removeTrip,
    getWeatherBitData,
    getGeonameData,
    getPixabayImages,
};
