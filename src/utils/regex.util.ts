// Username: Has to be in lowercase and between 5 to 15 characters, can have underlines but not in the begining
export const regexUsername: RegExp = /^[^_][a-z0-9_]{4,14}$/g;
// Passcode: Has to be between 4 to 6 digits
export const regexPasscode: RegExp = /^[0-9]{4,6}$/g;
