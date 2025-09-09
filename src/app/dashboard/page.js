"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ For redirect
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function DashboardMain() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 
  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      router.replace("/login"); 
    }
  }, [router]);

  //  Fetch Employees from API
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://crud.parxfit.com/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();

      // 🔹 Flatten API response
      const employeesData = (data.users || []).map((u) => ({
        id: u.id,
        name: `${u.f_name} ${u.l_name}`,
        email: u.email,
        mobile: u.mobile,
        role: u.role?.name || "N/A",
        country: u.country?.name || "N/A",
        state: u.state?.name || "N/A",
        city: u.city?.name || "N/A",
      }));

      setEmployees(employeesData);
      setFiltered(employeesData);
      localStorage.setItem("employees", JSON.stringify(employeesData));
    } catch (error) {
      console.error("Error fetching employees:", error);
     
      const stored = JSON.parse(localStorage.getItem("employees")) || [];
      setEmployees(stored);
      setFiltered(stored);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("employees")) || [];
    if (stored.length > 0) {
      setEmployees(stored);
      setFiltered(stored);
      setLoading(false);
    }
    fetchEmployees();
  }, []);

  
  useEffect(() => {
    const delay = setTimeout(() => {
      setFiltered(
        employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.state.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, 300);

    return () => clearTimeout(delay);
  }, [search, employees]);

  const presentCount = 3;
  const projectCount = 20;

  const barData = [
    { name: "Employees", value: employees.length },
    { name: "Present", value: presentCount },
    { name: "Projects", value: projectCount },
  ];

  const pieData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: employees.length - presentCount },
  ];

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <main className="p-4 pt-20">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-50 shadow-md">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 animate-pulse">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </section>
      ) : (
        <>
          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-100 p-4 rounded text-center font-semibold">
              Total Employees: {employees.length}
            </div>
            <div className="bg-green-100 p-4 rounded text-center font-semibold">
              Present Today: {presentCount}
            </div>
            <div className="bg-yellow-100 p-4 rounded text-center font-semibold">
              Projects: {projectCount}
            </div>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Attendance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Employees Table */}
          <section className="overflow-x-auto bg-white shadow-md rounded-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-left">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Country</th>
                  <th className="p-3 text-left">State</th>
                  <th className="p-3 text-left">City</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className={`border-b hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium text-gray-800">{emp.name}</td>
                      <td className="p-3 text-gray-600">{emp.email}</td>
                      <td className="p-3 text-gray-600">{emp.mobile}</td>
                      <td className="p-3 text-gray-600">{emp.role}</td>
                      <td className="p-3 text-gray-600">{emp.country}</td>
                      <td className="p-3 text-gray-600">{emp.state}</td>
                      <td className="p-3 text-gray-600">{emp.city}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500 italic">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            {/* Search Input */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Employee</h2>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type name, email, or state..."
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Results */}
              <div className="max-h-60 overflow-y-auto">
                {filtered.length > 0 ? (
                  <ul className="divide-y">
                    {filtered.map((emp) => (
                      <li key={emp.id} className="p-3 hover:bg-gray-100 rounded">
                        <p className="font-semibold">{emp.name}</p>
                        <p className="text-sm text-gray-600">{emp.email}</p>
                        <p className="text-sm text-gray-500">{emp.state}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-center">
                    No matching employees
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
