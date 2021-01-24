import { validateUserInput } from './js/validateUserInput';
import { handleSubmit, saveTrip, removeTrip } from './js/formHandler';
import { getGeonameData } from './js/getGeonameData';
import { getWeatherBitData } from './js/getWeatherBitData';
import { getPixabayImages } from './js/getPixabayImages';

import './styles/resets.scss';
import './styles/base.scss';
import './styles/form.scss';
import './styles/footer.scss';
import './styles/header.scss';
import './styles/main.scss';
import './styles/card.scss';

export {
    validateUserInput,
    handleSubmit,
    saveTrip,
    removeTrip,
    getWeatherBitData,
    getGeonameData,
    getPixabayImages,
};
