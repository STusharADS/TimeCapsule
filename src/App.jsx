import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW7vVm7lDXch02TguA_VGsqQi2wkJ_VWw",
  authDomain: "timecapsule-c5bb7.firebaseapp.com",
  projectId: "timecapsule-c5bb7",
  storageBucket: "timecapsule-c5bb7.appspot.com",
  messagingSenderId: "264892131017",
  appId: "1:264892131017:web:381f617388eb5a084f8f18",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // HH:MM in 24-hour (from input)
  const [ampm, setAmpm] = useState("AM"); // AM or PM
  const [loading, setLoading] = useState(false);

  // Convert date + time + AM/PM to a Date object
  const getScheduledDate = () => {
    if (!date || !time) return null;
    let [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (ampm === "PM" && hour < 12) {
      hour += 12;
    } else if (ampm === "AM" && hour === 12) {
      hour = 0;
    }

    const scheduled = new Date(date);
    scheduled.setHours(hour, minute, 0, 0);
    return scheduled;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scheduledAt = getScheduledDate();
    if (!message || !number || !scheduledAt) {
      alert("Please fill in all fields correctly.");
      return;
    }

    if (scheduledAt < new Date()) {
      alert("Scheduled time must be in the future.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "scheduledMessages"), {
        message,
        number,
        scheduledAt,
        createdAt: serverTimestamp(),
      });

      alert("Message scheduled successfully.");
      setMessage("");
      setNumber("");
      setDate("");
      setTime("");
      setAmpm("AM");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to schedule message. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center p-4">
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
          placeholder="WhatsApp Number (with country code, e.g. +1234567890)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />

        {/* Date picker */}
        <div>
          <label htmlFor="date" className="block mb-1 font-semibold">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]} // no past dates
          />
        </div>

        {/* Time picker + AM/PM */}
        <div className="flex space-x-2 items-center">
          <div className="flex-1">
            <label htmlFor="time" className="block mb-1 font-semibold">
              Select Time
            </label>
            <input
              id="time"
              type="time"
              className="w-full p-3 rounded bg-gray-800 text-white"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              step="60"
            />
          </div>
          <div>
            <label htmlFor="ampm" className="block mb-1 font-semibold">
              AM/PM
            </label>
            <select
              id="ampm"
              className="p-3 rounded bg-gray-800 text-white"
              value={ampm}
              onChange={(e) => setAmpm(e.target.value)}
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`p-3 rounded w-full font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {loading ? "Scheduling..." : "Schedule Message"}
        </button>
      </form>
    </div>
  );
}
