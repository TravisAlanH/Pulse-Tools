import React from "react";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../../Firebase/Firebase";
import { CurrentLocation, RoutingStore } from "../../../../../Store/Store";
import { Questions } from "../../../../../dcT_Objects/ObjectQuestions";
import { BlankCurrentLocation } from "../../../../../Store/Init_State";

export default function CreateLocationInputs() {
  const holdItem = CurrentLocation((state) => state.data.HoldItem);
  const setHold = CurrentLocation((state) => state.setHoldItem);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);

  async function handleVarifyLocation(e) {
    e.preventDefault();
    document.getElementById("setLocationModal").style.display = "none";
    // !This will have to be removed after testing
    const UUID = uuidv4().replace(/[\/[\]~*.]/g, "_");

    const LocationsList = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsSnapshot");
    await setDoc(
      LocationsList,
      {
        [`${UUID}`]: holdItem,
      },
      { merge: true }
    )
      .then(() => {
        const LocationsList = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");
        let InicialStateCopy = { ...BlankCurrentLocation };
        InicialStateCopy.Location = UUID;
        InicialStateCopy.AllItems[UUID] = holdItem;
        setDoc(
          LocationsList,
          {
            [`${UUID}`]: InicialStateCopy,
          },
          { merge: true }
        );
      })
      .then(() => {
        setHoldItemTrigger();
      });
    setHold({});
  }

  return (
    <div>
      <div id="setLocationModal" className="modal">
        <div className="modal-content-sop flex flex-col">
          <div className="flex flex-row justify-end">
            <span
              className="close"
              onClick={() => {
                setAuditModal(-1);
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
      </div>
    </div>
  );

  function SelectInput(key) {
    return (
      <select
        className="Inputs"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...holdItem };
          holdItemCopy[key] = newValue;
          setHold(holdItemCopy);
        }}
      >
        {Questions.Items[key].options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  function DateInput(key) {
    return (
      <input
        className="Inputs"
        type="date"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...holdItem };
          holdItemCopy[key] = newValue;
          setHold(holdItemCopy);
        }}
      />
    );
  }

  function NumberInput(key) {
    return (
      <input
        className="Inputs"
        type="number"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...holdItem };
          holdItemCopy[key] = newValue;
          setHold(holdItemCopy);
        }}
      />
    );
  }

  function TextInput(key) {
    return (
      <input
        className="Inputs"
        type="text"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...holdItem };
          holdItemCopy[key] = newValue;
          setHold(holdItemCopy);
        }}
      />
    );
  }
}
