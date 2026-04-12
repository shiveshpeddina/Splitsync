/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (basic international format)
 */
export const isValidPhone = (phone) => {
  const re = /^\+?[\d\s-]{10,15}$/;
  return re.test(phone);
};

/**
 * Validate amount (positive number)
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

/**
 * Validate required string
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim().length > 0;
};

/**
 * Validate min length
 */
export const minLength = (value, min) => {
  return String(value).trim().length >= min;
};

/**
 * Validate max length
 */
export const maxLength = (value, max) => {
  return String(value).trim().length <= max;
};

/**
 * Run multiple validators and return error messages
 * rules: [{ test: fn, message: 'Error message' }]
 */
export const validate = (value, rules) => {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Validate expense form
 */
export const validateExpenseForm = (data) => {
  const errors = {};

  if (!isRequired(data.description)) errors.description = 'Description is required';
  if (!isValidAmount(data.amount)) errors.amount = 'Enter a valid amount';
  if (!isRequired(data.currency)) errors.currency = 'Select a currency';
  if (!isRequired(data.payerId)) errors.payerId = 'Select who paid';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate group form
 */
export const validateGroupForm = (data) => {
  const errors = {};

  if (!isRequired(data.name)) errors.name = 'Group name is required';
  if (!minLength(data.name, 2)) errors.name = 'Name must be at least 2 characters';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
