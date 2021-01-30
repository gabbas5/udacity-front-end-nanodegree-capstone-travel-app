import { handleSubmit } from '../client/js/formHandler';

describe('Get Sentiment Analysis function', () => {
    // https://jestjs.io/docs/en/expect#tobedefined
    test('Check that the handleSubmit function is not undefined', () => {
        expect(handleSubmit).toBeDefined();
    });
});
