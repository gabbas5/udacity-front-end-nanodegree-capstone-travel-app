// Used for form validation, an array of form elements can be passed it
// It will then loop of them and style any with errors by adding the error class
const validateUserInput = (formElements) => {
    for (let formElement of formElements) {
        if (!formElement.value) {
            formElement.classList.add('error');
            return false;
        } else {
            formElement.classList.remove('error');
            return true;
        }
    }
};

export { validateUserInput };
