const scanReceipt = async (base64Image) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const extractionPrompt = `Analyze this receipt image and extract the following information. Return ONLY a valid JSON object (no markdown, no backticks, no explanation) with this exact structure:
{
  "description": "Store/merchant name or a short description of the purchase",
  "total": <total amount as a number>,
  "currency": "3-letter currency code from the receipt (e.g., USD, INR, EUR, GBP). If not found, guess based on context or return USD.",
  "items": [
    { "name": "item name", "price": <price as a number> }
  ]
}

Rules:
- Include ALL line items from the receipt
- Include tax, tips, service charges as separate items
- The "total" should be the final total on the receipt
- If you can't read the store name, derive a short description from the items (e.g. "Restaurant Dinner", "Grocery Shopping")
- Prices must be numbers, not strings
- Return ONLY the JSON object, nothing else`;

  if (!geminiApiKey || geminiApiKey.trim() === '') {
    throw new Error("No Gemini API Key found in .env file.");
  }

  try {
    let resultText = '';

    // Prefer Gemini if available (Generous Free Tier)
    if (geminiApiKey && geminiApiKey.trim() !== '') {
       // Robustly separate mimeType and raw base64 data
       let mimeType = 'image/jpeg';
       let rawBase64 = base64Image;
       
       if (base64Image.startsWith('data:')) {
         const parts = base64Image.split(',');
         if (parts.length === 2) {
           const matchMime = parts[0].match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)/);
           if (matchMime) mimeType = matchMime[1];
           rawBase64 = parts[1];
         }
       }

       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           contents: [{
             parts: [
               { text: extractionPrompt },
               { inlineData: { mimeType, data: rawBase64 } }
             ]
           }]
         })
       });

       if (!response.ok) {
         const errBody = await response.text();
         console.error('Gemini API Error body:', errBody);
         throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
       }
       const data = await response.json();
       
       // Gemini can return multiple parts (e.g. thinking + content in 2.5)
       // Find the part that contains what looks like JSON
       const parts = data.candidates?.[0]?.content?.parts || [];
       let geminiText = '';
       for (const part of parts) {
         if (part.text && (part.text.includes('{') || part.text.includes('['))) {
           geminiText = part.text.trim();
           break;
         }
       }
       // Fallback to first part if no JSON-like part found
       if (!geminiText && parts.length > 0) {
         geminiText = parts[parts.length - 1].text?.trim() || '';
       }
       
       console.log('📋 Gemini raw response:', geminiText.substring(0, 200));
       resultText = geminiText;
    } else {
       throw new Error("Gemini API key is required but not configured correctly.");
    }

    // Clean JSON formatting if AI returned markdown anyway
    if (resultText.startsWith('```json')) resultText = resultText.substring(7).trim();
    if (resultText.startsWith('```')) resultText = resultText.substring(3).trim();
    if (resultText.endsWith('```')) resultText = resultText.substring(0, resultText.length - 3).trim();

    const parsed = JSON.parse(resultText);

    let items, description, total, currency;
    if (Array.isArray(parsed)) {
      items = parsed;
      total = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
      description = "Receipt Scan";
      currency = "USD";
    } else {
      items = parsed.items || [];
      description = parsed.description || "Receipt Scan";
      total = parsed.total || items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
      currency = parsed.currency || "USD";
    }

    items = items.map(item => ({
      name: String(item.name || "Unknown Item"),
      price: parseFloat(item.price) || 0
    }));

    currency = String(currency).trim().toUpperCase().substring(0, 3);
    if (!/^[A-Z]{3}$/.test(currency)) currency = "USD";

    return {
      success: true,
      description,
      currency,
      total: parseFloat(total) || 0,
      items
    };

  } catch (error) {
    console.error("❌ Receipt Scan Error:", error.message);
    throw new Error('Failed to parse receipt: ' + error.message);
  }
};

const getMockData = () => ({
  success: true,
  description: "Sample Receipt (Mock Data)",
  currency: "USD",
  total: 27.60,
  items: [
    { name: "Demo Cheeseburger", price: 15.00 },
    { name: "Demo Fries", price: 4.50 },
    { name: "Demo Shake", price: 6.00 },
    { name: "Demo Tax", price: 2.10 }
  ]
});

module.exports = { scanReceipt };
