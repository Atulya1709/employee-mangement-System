"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddCity() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    state_id: "",
    note: "",
  });
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch States for dropdown
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("https://crud.parxfit.com/api/master/data-filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table_name: "states" }),
        });
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setStates(data.data);
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  // handleChange for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://crud.parxfit.com/api/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_name: "cities",
          name: formData.name,
          state_id: formData.state_id,
          note: formData.note,
          action: "insert",
        }),
      });

      if (!res.ok) throw new Error("Failed to add city");

      alert("City added successfully!");
      router.push("/dashboard/city"); // redirect to cities list
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Add City</h1>
        <Link href="/dashboard/city">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ← Back
          </button>
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-xl mx-auto mt-24 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* City Name */}
          <input
            type="text"
            name="name"
            placeholder="City Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* State Dropdown */}
          <select
            name="state_id"
            value={formData.state_id}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>

          {/* Note */}
          <input
            type="text"
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {loading ? "Saving..." : "Save City"}
          </button>
        </form>
      </div>
    </div>
  );
}
