import { validateUserInput } from "../client/js/validateUserInput";

describe("Validate URL function", () => {
  test("It should return either true or false depending on if the URL entered is valid", () => {
    const validURL = "http://www.google.com";
    expect(validateUserInput(validURL)).toBeTruthy();

    const invalidURL = "";
    expect(validateUserInput(invalidURL)).toBeFalsy();
  });
});
