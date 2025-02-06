import React from "react";
import { CurrentLocation } from "../../../../../Store/Store";
import { ObjectListing } from "../../../../../dcT_Objects/ObjectsArrays";
import { Questions } from "../../../../../dcT_Objects/ObjectQuestions";
import { auth, db } from "../../../../../Firebase/Firebase";
import "../../../Styles/Modal.css";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import HomeTable from "./HomeTable";
import { BlankCurrentLocation } from "../../../../../Store/Init_State";
import { HoldLocationStore } from "../../../../../Store/Store";
import { RoutingStore } from "../../../../../Store/Store";

export default function LocationList() {
  const setHold = CurrentLocation((state) => state.setHoldItem);
  const holdItem = CurrentLocation((state) => state.data.HoldItem);
  const addToItems = CurrentLocation((state) => state.addToItems);
  const holdItemTrigger = CurrentLocation((state) => state.data.HoldItemTrigger);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const [locationCode, setLocationCode] = React.useState("");
  const [LocationsList, setLocationsList] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let Locations = docSnap.data();
        // if (Object.keys(Locations)[0] === "No Locations") {
        //   Locations.shift();
        // }
        setLocationsList(Locations);
      }
    };
    fetchData();
  }, [holdItemTrigger]);

  function handleCreateLocation(e) {
    e.preventDefault();
    let LocationExists = false;
    if (LocationsList === undefined) {
      setLocationsList({});
    } else {
      Object.keys(LocationsList).map((location) => {
        if (LocationsList[location]["dcTrack Location Code*"] === locationCode) {
          alert("Location already exists");
          LocationExists = true;
        }
      });
    }
    if (!LocationExists) {
      setAuditModal(3);
      let holdLocation = { ...ObjectListing["Location"] };
      holdLocation["dcTrack Location Code*"] = locationCode;
      setHold(holdLocation);
    }
  }

  // async function handleVarifyLocation(e) {
  //   e.preventDefault();
  //   document.getElementById("setLocationModal").style.display = "none";
  //   // !This will have to be removed after testing
  //   const UUID = uuidv4().replace(/[\/[\]~*.]/g, "_");

  //   const LocationsList = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot");
  //   await setDoc(
  //     LocationsList,
  //     {
  //       [`${UUID}`]: holdItem,
  //     },
  //     { merge: true }
  //   )
  //     .then(() => {
  //       const LocationsList = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");
  //       let InicialStateCopy = { ...BlankCurrentLocation };
  //       InicialStateCopy.Location = UUID;
  //       InicialStateCopy.AllItems[UUID] = holdItem;
  //       setDoc(
  //         LocationsList,
  //         {
  //           [`${UUID}`]: InicialStateCopy,
  //         },
  //         { merge: true }
  //       );
  //     })
  //     .then(() => {
  //       setHoldItemTrigger();
  //     });
  //   setHold({});
  // }

  return (
    <div className="mb-6">
      <div className="pt-3 flex flex-col gap-4">
        <div className="flex flex-row justify-center items-center text-sm">
          <label className="LableMain  justify-center items-center">Create Location</label>
          <form className="flex flex-row gap-2  justify-center items-center" onSubmit={(e) => handleCreateLocation(e)}>
            <input className="LableInputMain" type="text" placeholder="dcT Location Code" required={true} onChange={(e) => setLocationCode(e.target.value)} />
            <input className="ButtonMain hover:cursor-pointer" type="submit" value="Create" />
          </form>
        </div>
        {LocationsList !== undefined ? <HomeTable LocationsList={LocationsList} /> : null}
      </div>
      {/* MODAL
      <div id="setLocationModal" className="modal">
        <div className="modal-content-sop flex flex-col">
          <div className="flex flex-row justify-end">
            <span
              className="close"
              onClick={() => {
                document.getElementById("setLocationModal").style.display = "none";
              }}
            >
              &times;
            </span>
          </div>
          <form onSubmit={(e) => handleVarifyLocation(e)}>
            <div className="flex flex-col">
              {Object.keys(holdItem).map((key, index) => {
                return (
                  <div key={index} className="flex flex-row">
                    {key.includes("*") ? (
                      <label className="Question flex flex-row items-center gap-3">
                        <p className="text-red-500">*</p>
                        {key.replace("*", "")}
                      </label>
                    ) : (
                      <label className="Question flex flex-col justify-center">{key}</label>
                    )}
                    {Questions.Items[key].type === "text" ? TextInput(key) : Questions.Items[key].type === "number" ? NumberInput(key) : Questions.Items[key].type === "date" ? DateInput(key) : Questions.Items[key].type === "select" ? SelectInput(key) : TextInput(key)}
                  </div>
                );
              })}
              <input className="OrangeButton" type="submit" value="Save" />
            </div>
          </form>
        </div>
      </div> */}
    </div>
  );
}

// Also, some big changes coming to V2 of Audit tool.

// Full Rework of back-end data structure for quicker build out and easier data management.

// Non-Sunbird email verification with Admin Approval and Disabling of accounts,.

// Rework on Audit Actions for quicker build out

// Ability to add Non Rackable devices to a location

// Custom, Survey Questions per user

// Ability to except dcTrack export into import sheets for true up audits
