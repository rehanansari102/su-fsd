/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data.csv");
    const fileContent = fs.readFileSync(filePath, "utf8");
 
    // Parse CSV data
    const { data } = Papa.parse(fileContent, { header: false });

    return Response.json({ success: true, data });
  } catch (error) {
    console.log(error)
    return Response.json({ success: false, error: "Error reading CSV file" }, { status: 500 });
  }
}