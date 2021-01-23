import { handleSubmit } from "../client/js/formHandler";

describe("Get Sentiment Analysis function", () => {
  // https://jestjs.io/docs/en/expect#tobedefined
  test("Check that the handleSubmit function is not undefined", () => {
    expect(handleSubmit).toBeDefined();
  });

  // TODO: Look more into this in the future as well for testing API calls
  // https://jestjs.io/docs/en/asynchronous#asyncawait
  //   test("Call the API and check the data returned is an object with success response", () => {
  //     expect(handleSubmit).toBeDefined();
  //   });

  //   test("Call the API with a bad request and check for an error response", () => {
  //     expect(handleSubmit).toBeDefined();
  //   });
});
