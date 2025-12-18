export interface PasswordRequirements {
  length: boolean;
  upperCase: boolean;
  lowerCase: boolean;
  number: boolean;
  specialChar: boolean;
}

export const checkPasswordRequirements = (
  pwd: string
): PasswordRequirements => {
  return {
    length: pwd.length >= 8,
    upperCase: /[A-Z]/.test(pwd),
    lowerCase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    specialChar: /[!@#$%^&*]/.test(pwd),
  };
};

export const validatePassword = (pwd: string): string | null => {
  const reqs = checkPasswordRequirements(pwd);

  if (!reqs.length) return "Password must be at least 8 characters long.";
  if (!reqs.upperCase)
    return "Password must contain at least one uppercase letter (A-Z).";
  if (!reqs.lowerCase)
    return "Password must contain at least one lowercase letter (a-z).";
  if (!reqs.number) return "Password must contain at least one number (0-9).";
  if (!reqs.specialChar)
    return "Password must contain at least one special character (!@#$%^&*).";

  return null;
};
