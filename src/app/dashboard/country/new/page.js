"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CountriesPage() {
  const [formData, setFormData] = useState({
    table_name: "countries",
    name: "",
    note: "",
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://crud.parxfit.com/api/master/data-filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ table_name: "countries" }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch countries");

      const data = await res.json();
      console.log("API Response:", data);
      setCountries(data.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to fetch countries"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://crud.parxfit.com/api/master", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add country");

      await res.json();
      alert("Country added successfully!");
      setFormData({ ...formData, name: "", note: "" });
      fetchCountries();
    } catch (error) {
      console.error("Error adding country:", error);
      setError("Failed to add country"); 
    }
  };

  return (
    <div className="p-2">
      {/*  Header */}
      <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Add Country</h1>
        <Link href="/dashboard/country">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ← Back
          </button>
        </Link>
      </div>

      {/*  Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-xl mx-auto mt-24 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Country Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {loading ? "Saving..." : "Save Country"}
          </button>
        </form>
      </div>

      {/*  Country List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-2xl mx-auto mt-10 p-6">
        <h2 className="text-lg font-semibold mb-4">All Countries</h2>
        {loading ? (
          <p>Loading...</p>
        ) : countries.length > 0 ? (
          <ul className="divide-y">
            {countries.map((c) => (
              <li key={c.id} className="py-2 flex justify-between items-center">
                <span>
                  <strong>{c.name}</strong> — {c.note}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No countries found.</p>
        )}
      </div>
    </div>
  );
}
