import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const res = await fetch("http://127.0.0.1:5000/pair-projects");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      alert("Error uploading or fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Employee Collaboration App</h1>

      <div className="mb-4">
        <label className="flex flex-col items-center px-4 py-6 bg-blue-50 text-blue-700 rounded-lg shadow cursor-pointer hover:bg-blue-100 transition">
          <span className="mb-2 text-sm font-semibold">Select CSV File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {file && (
          <p className="mt-2 text-gray-700">Selected file: {file.name}</p>
        )}
        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Upload & Analyze"}
        </button>
      </div>

      {data.length > 0 && (
        <div className="overflow-x-auto w-full max-w-4xl mt-8">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border">Employee ID #1</th>
                <th className="px-4 py-2 border">Employee ID #2</th>
                <th className="px-4 py-2 border">Project ID</th>
                <th className="px-4 py-2 border">Days Worked</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="text-center even:bg-gray-50">
                  <td className="px-4 py-2 border">{row.Emp1}</td>
                  <td className="px-4 py-2 border">{row.Emp2}</td>
                  <td className="px-4 py-2 border">{row.ProjectID}</td>
                  <td className="px-4 py-2 border">{row.daysWorked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
