// App.jsx
import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  const [delay, setDelay] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, number, delay }),
    });
    const data = await res.json();
    alert(data.status || "Scheduled!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold">Send Message to WhatsApp Later</h1>

        <textarea
          className="w-full p-3 rounded bg-gray-800 text-white"
          rows="4"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <input
          type="tel"
          className="w-full p-3 rounded bg-gray-800 text-white"
          placeholder="WhatsApp Number (with country code)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          className="w-full p-3 rounded bg-gray-800 text-white"
          value={delay}
          onChange={(e) => setDelay(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded w-full font-semibold"
        >
          Schedule Message
        </button>
      </form>
    </div>
  );
}
