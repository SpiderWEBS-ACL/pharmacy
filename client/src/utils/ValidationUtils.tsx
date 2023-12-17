export const validateField = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateUsername = (value: string): boolean => {
  if (value == "") return true;
  return value.length >= 3;
};

export const validatePassword = (value: string): boolean => {
  if (value == "") return true;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(value);
};

export const validateMobile = (value: string): boolean => {
  if (value != undefined && value!= "") {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(value);
  }
  return true;
};

export const validateEmail = (value: string): boolean => {
  if (value == "") return true;
  const emailRegex = /[^@]+@.+\.\w{2,3}$/;
  return emailRegex.test(value);
};
