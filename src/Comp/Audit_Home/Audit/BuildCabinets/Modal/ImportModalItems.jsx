import React, { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { trueLoad, falseLoad } from "../../../../../../Store/Store";
import { RoutingStore } from "../../../../../../Store/Store";
import { CurrentLocation } from "../../../../../../Store/Store";
import { MLTStore } from "../../../../../../Store/Store";

export default function ImportModalItems() {
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setHold = CurrentLocation((state) => state.setHoldItem);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setImportAllLocations = CurrentLocation((state) => state.setImportAllLocations);
  const rows = MLTStore((state) => state.data.rows);

  const [fileData, setFileData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [headers, setHeaders] = useState({});

  // Handle file selection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming first sheet is the main sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const lastLine = parsedData.length - 1;
      console.log("data", parsedData);
      let holdHeaders = {};
      parsedData.forEach((row, index) => {
        if (row[0] === "# Operation *") holdHeaders[index] = row;
      });
      setHeaders(holdHeaders);
      let headersStopStart = [];
      Object.keys(holdHeaders).forEach((key) => {
        headersStopStart.push(key);
      });
      headersStopStart.push(lastLine);
      console.log(headersStopStart);
      let headerStopStopIndex = 0;
      parsedData.forEach((row, index) => {
        // console.log(index, ":", parseInt(headersStopStart[headerStopStopIndex]));
        if (index > parseInt(headersStopStart[headerStopStopIndex]) && index < parseInt(headersStopStart[headerStopStopIndex + 1])) {
          let newRow = {};
          holdHeaders[headersStopStart[headerStopStopIndex]].forEach((header, index) => {
            newRow[header] = row[index];
          });
          if (newRow["Object *"] === undefined) return;
          setAssets((prev) => [...prev, newRow]);
        } else if (parseInt(headersStopStart[headerStopStopIndex + 1]) === index) headerStopStopIndex = headerStopStopIndex + 1;
      });
      console.log("assets", assets);
      setFileData(parsedData);
      // setFileData(parsedData);
      // console.log("Parsed File Data:", parsedData);
      // let indexOfHeders = -1;
      // while (indexOfHeders === -1) {
      //   indexOfHeders = parsedData.findIndex((row) => row.includes("dcTrack Location Code*"));
      // }
      // setHeaders(parsedData[indexOfHeders]);
      // setAssets(parsedData.filter((row) => row[parsedData[indexOfHeders].indexOf("Object *")] === "LOCATION"));
    };
    reader.readAsArrayBuffer(file);
  };

  console.log(assets);
  console.log(AllItems);

  async function saveLocation() {
    trueLoad();
    let allItemsCopy = JSON.parse(JSON.stringify(AllItems));
    let allItemsdcTrackLocationCode = "";
    let filteredItem = Object.values(AllItems).find((item) => item.hasOwnProperty("dcTrack Location Code*"));
    if (filteredItem) {
      allItemsdcTrackLocationCode = filteredItem["dcTrack Location Code*"];
    } else {
      console.log("No matching item found");
    }
    console.log(allItemsdcTrackLocationCode);
    // assets.forEach((location, index) => {
    assets.forEach((location) => {
      console.log(location);
      console.log(location["Location  *"]);
      if (location["Location  *"] === allItemsdcTrackLocationCode) {
        const UUID = uuidv4().replace(/[\/[\]~*.]/g, "_");
        let cleanedLocation = Object.fromEntries(
          Object.entries(location).map(([key, value]) => {
            let newValue = value === undefined ? "" : value;
            if (key === "Object *" && newValue === "CABINET") {
              newValue = "Cabinet";
            }
            return [key, newValue];
          })
        );
        let withRUHeight = { ...cleanedLocation };
        withRUHeight["RUHeight"] = rows[rows.findIndex((row) => row["Model"] === cleanedLocation["Model *"])]["RUHeight"];
        allItemsCopy[UUID] = withRUHeight;
      }
    });
    console.log("AllItems", allItemsCopy);
    setImportAllLocations(allItemsCopy);
    setHoldItemTrigger();
    setHold({});
    setAuditModal(-1);

    //!

    //!
    falseLoad();
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="text-sm">Uses proper dcTrack import format</p>
      </div>
      <label className="block">
        <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" id="fileInput" />
        <button onClick={() => document.getElementById("fileInput").click()} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Upload CSV/XLSX
        </button>
      </label>
      {fileData && (
        <div>
          {preview()}
          {saveLocationsButton()}
        </div>
      )}
    </div>
  );

  function preview() {
    return (
      <div className="mt-4 p-2 border rounded-lg bg-gray-100">
        <h3 className="font-bold">Preview:</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))} */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* {assets.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index in row ? (row[index] === false ? "false" : row[index]) : ""}
                  </td>
                ))}
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    );
  }

  function saveLocationsButton() {
    return (
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600" onClick={() => saveLocation()}>
        Save Locations
      </button>
    );
  }
}
