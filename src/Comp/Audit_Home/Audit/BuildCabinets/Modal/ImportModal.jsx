import React, { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { trueLoad, falseLoad } from "../../../../../../Store/Store";
import { auth, db } from "../../../../../../Firebase/Firebase";
import { RoutingStore } from "../../../../../../Store/Store";
import { CurrentLocation } from "../../../../../../Store/Store";
import { BlankCurrentLocation } from "../../../../../../Store/Init_State";

export default function ImportModal() {
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setHold = CurrentLocation((state) => state.setHoldItem);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);

  const [fileData, setFileData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [headers, setHeaders] = useState([]);

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

      setFileData(parsedData);
      console.log("Parsed File Data:", parsedData);
      let indexOfHeders = -1;
      while (indexOfHeders === -1) {
        indexOfHeders = parsedData.findIndex((row) => row.includes("dcTrack Location Code*"));
      }
      setHeaders(parsedData[indexOfHeders]);
      setLocations(parsedData.filter((row) => row[parsedData[indexOfHeders].indexOf("Object *")] === "LOCATION"));
    };
    reader.readAsArrayBuffer(file);
  };

  async function saveLocation() {
    trueLoad();
    let Locations = {};
    locations.forEach((location, index) => {
      let newLocation = {};
      headers.forEach((header, index) => {
        newLocation[header] = location[index] === undefined ? "" : location[index];
      });
      Locations[index] = newLocation;
    });
    console.log("Locations", Locations);

    for (const key of Object.keys(Locations)) {
      const UUID = uuidv4().replace(/[\/[\]~*.]/g, "_");
      const LocationsList = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot");
      console.log("LocationsList", Locations[key]);
      await setDoc(
        LocationsList,
        {
          [`${UUID}`]: Locations[key],
        },
        { merge: true }
      ).then(() => {
        const LocationsList = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");
        let InicialStateCopy = JSON.parse(JSON.stringify(BlankCurrentLocation));
        InicialStateCopy.Location = UUID;
        InicialStateCopy.AllItems[UUID] = Locations[key];
        setDoc(
          LocationsList,
          {
            [`${UUID}`]: InicialStateCopy,
          },
          { merge: true }
        );
      });
      setHoldItemTrigger();
      setHold({});
      setAuditModal(-1);
    }
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
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index in row ? (row[index] === false ? "false" : row[index]) : ""}
                  </td>
                ))}
              </tr>
            ))}
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
