import React from "react";
import { RoutingStore } from "../../../../../Store/Store";
import { auth, db } from "../../../../../Firebase/Firebase";
// import { deleteField, updateDoc, doc } from "firebase/firestore";
import { doc, updateDoc, deleteField } from "firebase/firestore";

import { CurrentLocation } from "../../../../../Store/Store";
import LoadingSpinner from "../../../LoadingSpinner/Spinner";

export default function LocationOptions() {
  const setAuditPage = RoutingStore((state) => state.setAuditPage);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const Location = CurrentLocation((state) => state.data.Location);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const [loading, setLoading] = React.useState(false);

  async function deleteLocation() {
    try {
      setLoading(true);
      const LocationRef = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");
      const data = { [`${Location}`]: deleteField() };
      updateDoc(LocationRef, data).catch((error) => {
        console.error("Error deleting location data:", error);
      });

      const LocationRef2 = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot");
      const data2 = { [`${Location}`]: deleteField() };
      updateDoc(LocationRef2, data2).catch((error) => {
        console.error("Error deleting location snapshot:", error);
      });

      // await updateDoc(LocationRef, {
      //   Location: deleteField(),
      // });
      // console.log("Successfully deleted full location data");
      // const LocationRef2 = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot");
      // await updateDoc(LocationRef2, {
      //   Location: deleteField(),
      // });

      // await deleteDoc(doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData", Location));
      // console.log("Successfully deleted full location data");
      // await deleteDoc(doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot", Location));
      // console.log("Successfully deleted snapshot location data");

      // const LocationRef = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData", Location);
      // console.log("Location Reference (Full Data):", LocationRef);
      // await deleteDoc(LocationRef);
      // console.log("Successfully deleted full location data");
      // const LocationRef2 = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot", Location);
      // console.log("Location Reference (Snapshot):", LocationRef2);

      // await deleteDoc(LocationRef2);
      // console.log("Successfully deleted snapshot location data");
    } catch (error) {
      console.error("Error deleting location:", error);
      alert(`Failed to delete location: ${error.message}`);
    } finally {
      setAuditModal(-1);
      setLoading(false);
      setHoldItemTrigger();
    }
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-full">
      <div className="flex flex-row justify-center items-center w-full">
        <label className="LableMain w-[10rem]">Location Data</label>
        <button className="ButtonMain w-[10rem]">Edit</button>
      </div>
      <div className="flex flex-row justify-center items-center w-full">
        <label className="LableMain w-[10rem]">Open Location</label>
        <button
          className="ButtonMain  w-[10rem]"
          onClick={() => {
            setAuditPage(2);
            setAuditModal(-1);
          }}
        >
          Open
        </button>
      </div>
      <div className="flex flex-row justify-center items-center w-full">
        <label className="LableMain w-[10rem]">Delete Location</label>
        <button
          className="ButtonMainRed  w-[10rem]"
          onClick={() => {
            deleteLocation();
          }}
        >
          Delete
        </button>
      </div>
      {loading ? <LoadingSpinner /> : null}
    </div>
  );
}
