import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserSearchInput({ onUserSelected }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (query.length >= 2) {
      setLoading(true);
      timeoutId = setTimeout(async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/search?q=${query}`);
          setResults(res.data);
        } catch (err) {
          console.error("Error searching users:", err);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setResults([]);
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      />
      {loading && <div className="absolute top-10 right-3 text-xs text-gray-400">Loading...</div>}
      
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                onUserSelected(r);
                setQuery("");
                setResults([]);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex gap-3 items-center"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{r.name}</span>
                <span className="text-xs text-gray-500">{r.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
