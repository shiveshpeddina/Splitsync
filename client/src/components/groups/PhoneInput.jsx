import React, { useState, useEffect } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const COUNTRIES = [
  { flag: "🇮🇳", name: "India", code: "+91", iso: "IN" },
  { flag: "🇦🇪", name: "UAE", code: "+971", iso: "AE" },
  { flag: "🇺🇸", name: "USA", code: "+1", iso: "US" },
  { flag: "🇬🇧", name: "UK", code: "+44", iso: "GB" },
  { flag: "🇸🇬", name: "Singapore", code: "+65", iso: "SG" },
  { flag: "🇦🇺", name: "Australia", code: "+61", iso: "AU" },
  { flag: "🇨🇦", name: "Canada", code: "+1", iso: "CA" },
  { flag: "🇩🇪", name: "Germany", code: "+49", iso: "DE" },
  { flag: "🇯🇵", name: "Japan", code: "+81", iso: "JP" },
  { flag: "🇫🇷", name: "France", code: "+33", iso: "FR" },
  { flag: "🇮🇹", name: "Italy", code: "+39", iso: "IT" },
  { flag: "🇧🇷", name: "Brazil", code: "+55", iso: "BR" },
  { flag: "🇲🇾", name: "Malaysia", code: "+60", iso: "MY" },
  { flag: "🇹🇭", name: "Thailand", code: "+66", iso: "TH" },
  { flag: "🇿🇦", name: "South Africa", code: "+27", iso: "ZA" },
  { flag: "🇳🇿", name: "New Zealand", code: "+64", iso: "NZ" },
  { flag: "🇳🇱", name: "Netherlands", code: "+31", iso: "NL" },
  { flag: "🇵🇭", name: "Philippines", code: "+63", iso: "PH" },
  { flag: "🇮🇩", name: "Indonesia", code: "+62", iso: "ID" },
  { flag: "🇵🇰", name: "Pakistan", code: "+92", iso: "PK" },
];

export default function PhoneInput({ onValidNumber, errorMsg }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [internalError, setInternalError] = useState("");

  const handleChange = (e) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);
    validate(rawVal, selectedCountry.iso);
  };

  const handleCountryChange = (e) => {
    const iso = e.target.value;
    const country = COUNTRIES.find((c) => c.iso === iso);
    setSelectedCountry(country);
    validate(inputValue, country.iso);
  };

  const validate = (value, iso) => {
    if (!value) {
      setIsValid(false);
      setInternalError("");
      setFormattedNumber("");
      onValidNumber(null);
      return;
    }

    try {
      const phone = parsePhoneNumberFromString(value, iso);
      if (phone && phone.isValid()) {
        setIsValid(true);
        setInternalError("");
        setFormattedNumber(phone.formatInternational());
        onValidNumber(phone.number); // E.164 format
      } else {
        setIsValid(false);
        setInternalError("Invalid phone number for selected country");
        setFormattedNumber("");
        onValidNumber(null);
      }
    } catch (err) {
      setIsValid(false);
      setInternalError("Invalid phone number format");
      onValidNumber(null);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex rounded-md shadow-sm">
        <select
          value={selectedCountry.iso}
          onChange={handleCountryChange}
          className="flex-shrink-0 bg-gray-50 border border-gray-300 text-gray-900 rounded-l-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 max-w-[120px]"
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <div className="relative flex-grow flex items-stretch focus-within:z-10">
          <input
            type="tel"
            value={inputValue}
            onChange={handleChange}
            placeholder="Phone number"
            className="block w-full border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-green-500 text-lg">✓</span>
            </div>
          )}
        </div>
      </div>
      {formattedNumber && isValid && (
        <p className="text-xs text-green-600 mt-1">Formatted: {formattedNumber}</p>
      )}
      {(internalError || errorMsg) && inputValue.length > 0 && !isValid && (
        <p className="text-xs text-red-600 mt-1">{errorMsg || internalError}</p>
      )}
    </div>
  );
}
