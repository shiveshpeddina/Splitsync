export const toBase = (amount, currencyCode, rates) => {
  if (!amount || isNaN(amount) || currencyCode === 'INR') return amount;
  const rate = rates[currencyCode];
  if (!rate) return amount;
  return amount / rate; // If 1 INR = 0.012 USD, 100 USD / 0.012 = 8333.33 INR
};

export const fromBase = (inrAmount, targetCurrency, rates) => {
  if (!inrAmount || isNaN(inrAmount) || targetCurrency === 'INR') return inrAmount;
  const rate = rates[targetCurrency];
  if (!rate) return inrAmount;
  return inrAmount * rate;
};

export const convert = (amount, fromCode, toCode, rates) => {
  if (fromCode === toCode) return amount;
  const inrAmount = toBase(amount, fromCode, rates);
  return fromBase(inrAmount, toCode, rates);
};

export const fmt = (amount, currencyCode, locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    // Fallback if currency code is not supported by Intl
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};
