
"use client"; // Required for Next.js App Router (app directory)

import { useState, useEffect } from "react";
interface CsvItem {
  created_at: string;
  filename: string;
}
const CsvDataComponent = () => {
  const [csvData, setCsvData] = useState<CsvItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at_asc"); // Default sorting

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch("/api/csv");
        const result = await response.json();
        console.log("Raw API Data:", result?.data);

        if (result.success) {
          // Convert API response to structured data with "created_at" and "filename"
          const formattedData: CsvItem[]  = result.data.map((item: Record<string, string>) => {
            const keys = Object.values(item);
            console.log(keys);
            return {
              created_at: keys[0],  // Assuming first key is the created_at timestamp
              filename: keys[1] // Assuming second key's value is the filename
            };
          });

          setCsvData(formattedData);
        } else {
          setError("Failed to fetch CSV data");
        }
      } catch (err) {
        console.log(err)
        setError("Error fetching CSV data");
      } finally {
        setLoading(false);
      }
    };

    fetchCsvData();
  }, []);

  // Sorting function
  const sortData = (data: CsvItem[], sortBy: string) => {
    return [...data].sort((a, b) => {
      if (sortBy === "created_at_asc") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_at_desc") return new Date(b.created_at) - new Date(a.created_at);
  
      if (sortBy.startsWith("filename")) {
        const extractNumber = (filename : string) => {
          const match = filename.match(/^(\d+)/); // Match leading number if present
          return match ? parseInt(match[0], 10) : Infinity; // Convert to integer for numeric sorting
        };
  
        const numA = extractNumber(a.filename);
        const numB = extractNumber(b.filename);
  
        if (numA !== numB) {
          return sortBy === "filename_asc" ? numA - numB : numB - numA;
        }
  
        return sortBy === "filename_asc"
          ? a.filename.localeCompare(b.filename, undefined, { numeric: true })
          : b.filename.localeCompare(a.filename, undefined, { numeric: true });
      }
  
      return 0;
    });
  };
  

  const sortedData = sortData(csvData, sortBy);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">CSV Data</h2>

      {/* Sorting Dropdown */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="mb-4 p-2 bg-black border rounded"
      >
        <option value="created_at_asc">Sort by Created At Ascending</option>
        <option value="filename_asc">Sort by Filename Ascending</option>
        <option value="filename_desc">Sort by Filename Descending</option>
      </select>

      {/* CSV Data Table */}
      <table className="min-w-full bg-black border">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Filename</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{row.created_at}</td>
              <td className="px-4 py-2">{row.filename}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvDataComponent;
