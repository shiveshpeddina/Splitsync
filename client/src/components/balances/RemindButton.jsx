import React, { useState } from "react";
import { fmt } from '../../utils/currencyUtils';

export default function RemindButton({ creditorName, amount, currency = 'INR', groupName, targetPhone }) {
  const [copied, setCopied] = useState(false);

  const formattedAmount = fmt(amount, currency);
  const message = `Hey, just a friendly reminder from ${creditorName} to settle up ${formattedAmount} in '${groupName}' on SplitSync!`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, "_blank");
  };

  return (
    <div className="flex gap-2">
      {targetPhone ? (
        <button
          onClick={handleWhatsApp}
          className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition"
        >
          Remind on WhatsApp
        </button>
      ) : null}
      <button
        onClick={handleCopy}
        className="bg-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-md hover:bg-gray-300 transition"
      >
        {copied ? "Copied!" : "Copy Reminder"}
      </button>
    </div>
  );
}
