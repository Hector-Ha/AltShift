import validator from "validator";
import { IPersonalInformation } from "../interfaces/IUser.js";

/** Clean input */
export const cleanInput = (str: string): string => {
  if (!str) return "";
  return validator.escape(validator.trim(str));
};

/** Validate email */
export const validateEmail = (email: string): string => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address format.");
  }
  return validator.normalizeEmail(email) || email;
};

/** Sanitize user */
export const sanitizeUser = (
  input: any
): { email?: string; personalInformation?: IPersonalInformation } => {
  const sanitized: any = {};

  if (input.email) {
    sanitized.email = validateEmail(input.email);
  }

  if (input.personalInformation) {
    sanitized.personalInformation = {
      firstName: input.personalInformation.firstName
        ? cleanInput(input.personalInformation.firstName)
        : undefined,
      lastName: input.personalInformation.lastName
        ? cleanInput(input.personalInformation.lastName)
        : undefined,
      jobTitle: input.personalInformation.jobTitle
        ? cleanInput(input.personalInformation.jobTitle)
        : undefined,
      organization: input.personalInformation.organization
        ? cleanInput(input.personalInformation.organization)
        : undefined,
      DOB: input.personalInformation.DOB, // Dates safe
      profilePicture: input.personalInformation.profilePicture,
    };
  }

  return sanitized;
};

/** Sanitize document */
export const sanitizeDocumentInput = (input: any) => {
  if (input.title) {
    input.title = cleanInput(input.title);
  }
  // Content handled by slate
  return input;
};
