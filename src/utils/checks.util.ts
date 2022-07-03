import { regexUsername, regexPasscode } from './regex.util';
import { formatUsername } from "./formats.util";

export const isUsername = (username: string): boolean => {
  if (!username) return false;
  return regexUsername.test(formatUsername(username));
};

export const isPasscode = (passcode: string): boolean => {
  if (!passcode) return false;
  return regexPasscode.test(passcode);
};
