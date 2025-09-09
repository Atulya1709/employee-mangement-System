"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://crud.parxfit.com/api/users");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees(stored);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch master data (roles, countries, states, cities)
  const fetchMasterData = async (table, setter) => {
    try {
      const res = await fetch(
        "https://crud.parxfit.com/api/master/data-filter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table_name: table }),
        }
      );
      const data = await res.json();
      setter(data?.data || []);
    } catch (err) {
      console.error(`Failed to fetch ${table}:`, err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchMasterData("roles", setRoles);
    fetchMasterData("countries", setCountries);
    fetchMasterData("states", setStates);
    fetchMasterData("cities", setCities);
  }, []);

  //  Helpers to map ID → Name
  const getRoleName = (id) => roles.find((r) => r.id === id)?.name || "N/A";

  const getCountryName = (id) =>
    countries.find((c) => c.id === id)?.name || "N/A";

  const getStateName = (id) => states.find((s) => s.id === id)?.name || "N/A";

  const getCityName = (id) => cities.find((c) => c.id === id)?.name || "N/A";

  const handleDelete = async (id) => {
    try {
      await fetch(`https://crud.parxfit.com/api/users/${id}`, {
        method: "DELETE",
      });
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="p-2  ">
      <div className="">
        {/*  Header */}
        <div className="fixed top-0 left-64 right-0 flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-[calc(100%-16rem)]">
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <Link href="/dashboard/employee/new">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
               Add New
            </button>
          </Link>
        </div>

        {/*  Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-20">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="p-6 text-gray-500">Loading...</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr >
                    {[
                      "Name",
                      "Email",
                      "Mobile",
                      "Role",
                      "Country",
                      "State",
                      "City",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-gray-700 font-semibold uppercase tracking-wide text-xs text-left"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {emp.f_name} {emp.l_name}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{emp.email}</td>
                      <td className="px-6 py-3 text-gray-700">{emp.mobile}</td>
                      <td className="px-6 py-3 text-gray-700">
                        {getRoleName(emp.role_id)}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {getCountryName(emp.country_id)}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {getStateName(emp.state_id)}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {getCityName(emp.city_id)}
                      </td>
                      <td className="px-6 py-3 flex items-center space-x-4">
                        <Link
                          href={`/dashboard/employee/edit?id=${emp.id}`}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-gray-500 italic"
                      >
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
