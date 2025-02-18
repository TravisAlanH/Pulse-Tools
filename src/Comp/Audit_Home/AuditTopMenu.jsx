import React from "react";
import { RoutingStore } from "../../../Store/Store";
import { CurrentLocation } from "../../../Store/Store";
import { PiFloppyDiskBack } from "react-icons/pi";
import { db, auth } from "../../../Firebase/Firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function AuditTopMenu() {
  const AllItems = RoutingStore((state) => state.data.AllItems);
  const Location = CurrentLocation((state) => state.data.Location);
  const setCurrentPage = RoutingStore((state) => state.setCurrentPage);
  const setAuditPage = RoutingStore((state) => state.setAuditPage);
  const CurrentLocationData = CurrentLocation((state) => state.data);
  const LocationUUID = CurrentLocation((state) => state.data.Location);

  // console.log(LocationUUID.toString(), "LocationUUID");
  // console.log(CurrentLocationData, "CurrentLocationData");
  // console.log(auth.currentUser.uid, "auth.currentUser.uid");

  async function handleSaveData() {
    console.log("saveing");
    try {
      // Ensure all necessary values exist before proceeding
      if (!auth.currentUser || !auth.currentUser.uid) {
        throw new Error("User is not authenticated.");
      }
      if (!LocationUUID) {
        throw new Error("LocationUUID is undefined.");
      }
      if (!CurrentLocationData) {
        throw new Error("CurrentLocationData is undefined.");
      }

      // Define the document reference in Firestore
      const document = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");

      // Attempt to update the document
      await updateDoc(document, {
        [`${LocationUUID}`]: CurrentLocationData,
      });

      console.log("Data successfully saved!");
    } catch (error) {
      // Log the error and provide meaningful feedback
      console.error("Error saving data:", error.message);

      // Optionally, display an error message to the user (if using a UI framework like React)
      alert(`Failed to save data: ${error.message}`);
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center pt-3">
      <div className="flex flex-row justify-center items-between w-full px-6">
        <div className="flex flex-row gap-3 w-full">
          <button className="ButtonMain" onClick={() => setCurrentPage(0)}>
            Tools
          </button>
          <button className="ButtonMain" onClick={() => setAuditPage(0)}>
            Locations
          </button>
        </div>

        <div className="flex flex-row justify-center items-center h-full">
          <button disabled={LocationUUID === 0} className={`text-[1.5rem] ${LocationUUID !== 0 ? "text-[#00B188]" : "text-[#f2ece6]"}`} onClick={() => handleSaveData()}>
            <PiFloppyDiskBack />
          </button>
        </div>
      </div>
    </div>
  );
}
