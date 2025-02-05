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
    setAuditModal(-1);
  }

  console.log(holdItem);

  return (
    <div className="h-full w-full">
      <div className="">
        <form className="flex flex-col gap-2" onSubmit={(e) => handleVarifyLocation(e)}>
          {Object.keys(holdItem).map((key, index) => {
            return (
              <div key={index} className="flex flex-col">
                <label className="LableMain w-[100%]">
                  {key.split("*").length - 1 === 1 ? (
                    <div className="flex flex-row gap-3">
                      <p className="text-red-500">*</p>
                      {key.replace("*", "")}
                    </div>
                  ) : (
                    key
                  )}
                </label>
                {Questions.Items[key].type === "text" ? TextInput(key) : Questions.Items[key].type === "number" ? NumberInput(key) : Questions.Items[key].type === "date" ? DateInput(key) : Questions.Items[key].type === "select" ? SelectInput(key) : TextInput(key)}
              </div>
            );
          })}
          <input className="OrangeButton" type="submit" value="Save" />
        </form>
      </div>
    </div>
  );

  function SelectInput(key) {
    return (
      <select
        className="w-full LableInputMainBelow"
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
        className="w-full LableInputMainBelow"
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
        className="w-full LableInputMainBelow"
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
        className="w-full LableInputMainBelow"
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
