// Username: Has to be in lowercase and between 5 to 15 characters, can have underlines
export const regexUsername: RegExp = new RegExp("^[a-z0-9_]{5,15}$");
// Passcode: Has to be between 4 to 6 digits
export const regexPasscode: RegExp = new RegExp("^[0-9]{4,6}$");
