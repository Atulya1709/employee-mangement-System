"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditCityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // ✅ Get city ID from query string

  const [city, setCity] = useState({ name: "", note: "", state_id: "" });
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch states for dropdown
  const fetchStates = async () => {
    try {
      const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_name: "states" }),
      });
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      if (Array.isArray(data.data)) setStates(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch city details
  const fetchCity = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://crud.parxfit.com/api/master/show/${id}?table_name=cities`
      );
      if (!res.ok) throw new Error(`Failed to fetch city: ${res.status}`);
      const data = await res.json();
      setCity({
        name: data?.data?.name || "",
        note: data?.data?.note || "",
        state_id: data?.data?.state_id || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCity();
  }, [id]);

  // Update city
  const updateCity = async () => {
    if (!city.name.trim() || !city.state_id) {
      setError("City name and state are required");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`https://crud.parxfit.com/api/master/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_name: "cities",
          name: city.name.trim(),
          note: city.note.trim(),
          state_id: city.state_id,
        }),
      });

      if (!res.ok) {
        let msg = `HTTP error: ${res.status}`;
        try {
          const errData = await res.json();
          msg = errData.message || msg;
        } catch {}
        throw new Error(msg);
      }

      alert("City updated successfully!");
      router.push("/dashboard/city");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-5 pt-20 bg-gray-100 min-h-screen ml-64">
      {/* Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Edit City</h1>
        <button
          type="button"
          onClick={() => router.push("/dashboard/city")}
          className="px-5 py-2 bg-gray-500 text-white rounded-xl"
          disabled={isUpdating}
        >
          ← Back
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-3xl mx-auto mt-24 p-8">
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Loading city data...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-md text-center">{error}</div>
        ) : (
          <form className="space-y-6">
            {/* City Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Name *
              </label>
              <input
                type="text"
                value={city.name}
                onChange={(e) => setCity({ ...city, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
                required
              />
            </div>

            {/* City Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Note
              </label>
              <textarea
                value={city.note}
                onChange={(e) => setCity({ ...city, note: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
              />
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={city.state_id}
                onChange={(e) => setCity({ ...city, state_id: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isUpdating}
                required
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={updateCity}
                disabled={isUpdating || loading}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl"
              >
                {isUpdating ? "Updating..." : "Update City"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/city")}
                disabled={isUpdating}
                className="flex-1 py-3 bg-gray-400 text-white rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
