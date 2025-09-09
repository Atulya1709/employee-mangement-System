"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import { Edit, Trash } from "lucide-react";

export default function CountryTable() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://crud.parxfit.com/api/master/data-filter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table_name: "countries" }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch countries: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setCountries(data.data);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const deleteCountry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country?"))
      return;

    setDeletingId(id);
    try {
      const response = await fetch(
        `https://crud.parxfit.com/api/master/destroy/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table_name: "countries" }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to delete country: ${response.status}`);

      setCountries(countries.filter((country) => country.id !== id));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete country");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-5">
      {/*  Header */}
      <div className="fixed top-0 left-64 right-0 flex justify-between items-center px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
        <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
        <Link
          href="/dashboard/country/new"
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Add New
        </Link>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/*  Error Message */}
      {error && <p className="text-red-500 py-2 text-center">{error}</p>}

      {/*  Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-20">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table Head */}
              <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  {["#", "Name", "Note", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-gray-700 font-semibold uppercase tracking-wider text-xs text-left"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {countries.length > 0 ? (
                  countries.map((country, index) => (
                    <tr
                      key={country.id || index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {country.name}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {country.note || "-"}
                      </td>
                      <td className="px-6 py-3 flex items-center gap-3">
                        {/* Edit Button */}
                        <Link
                          href={`/dashboard/country/edit?id=${country.id}`}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition"
                         
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteCountry(country.id)}
                          disabled={deletingId === country.id}
                          className={`p-2 rounded-full transition ${
                            deletingId === country.id
                              ? "bg-gray-300 cursor-not-allowed text-gray-600"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title="Delete"
                        >
                          {deletingId === country.id ? (
                            "..."
                          ) : (
                            <Trash className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-2">📭</span>
                        <p className="italic">No countries found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
