import React from "react";
import { CurrentLocation } from "../../../../../../Store/Store";
import { ObjectListing } from "../../../../../../dcT_Objects/ObjectsArrays";
import { MLTStore } from "../../../../../../Store/Store";
import { RoutingStore } from "../../../../../../Store/Store";
import { PiXSquare } from "react-icons/pi";

export default function CabinetSet() {
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const CabinetCount = CurrentLocation((state) => state.data.Counts.Cabinet);
  const counts = CurrentLocation((state) => state.data.Counts);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const Location = CurrentLocation((state) => state.data.Location);
  const setActive = CurrentLocation((state) => state.setActive);
  const setFilters = MLTStore((state) => state.setFilters);
  const HoldMLTITem = MLTStore((state) => state.data.holdMLTItem);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);
  const holdMLTItem = MLTStore((state) => state.data.holdMLTItem);
  const cabinetUUID = CurrentLocation((state) => state.data.Cabinet);
  const setCabinetActive = CurrentLocation((state) => state.setCabinet);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const holdItemTrigger = CurrentLocation((state) => state.data.holdItemTrigger);
  const [cabinets, setCabinets] = React.useState([]);
  const resetSortsFiltersSearches = MLTStore((state) => state.resetSortsFiltersSearches);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const Active = CurrentLocation((state) => state.data.Active);

  if (Location === 0) {
    return (
      <div>
        <div>
          <p>Location Not Built</p>
        </div>
        <div>
          <button
            onClick={() => {
              setHoldItem(ObjectListing.Location);
            }}
          >
            Build Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row gap-3 h-[1.5rem] items-center">
        <p>Current Cabinet:</p>
        <p className="text-[#00B188]">{cabinetUUID === 0 ? "None Selected" : AllItems[cabinetUUID]["Name *"]}</p>
      </div>
      <div className="flex flex-row justify-between h-[2rem] w-full text-sm">
        {CabinetSelections()}
        <div className="flex flex-row gap-3">
          {AddCabinet()}
          {DeleteButton()}
        </div>
      </div>
    </div>
  );

  function DeleteButton() {
    return (
      <div>
        <button
          className={`${cabinetUUID === 0 ? `ButtonMainRedSmallDisabled` : `ButtonMainRedSmall`} text-[1.5rem]`}
          disabled={cabinetUUID === 0}
          onClick={() => {
            setActive(cabinetUUID);
            setHoldItemTrigger();
            setAuditModal(4);
          }}
        >
          <PiXSquare />
        </button>
      </div>
    );
  }

  function AddCabinet() {
    return (
      <div>
        <button
          className="ButtonMainNonWhite"
          onClick={() => {
            resetSortsFiltersSearches();
            const Payload = {
              type: "Object",
              value: "Cabinet",
            };
            setFilters(Payload);
            setHoldItem(ObjectListing.Cabinet);
            setHoldMLTItem({});
            setActive(0);
            setCabinetActive(0);
            setHoldItemTrigger();
            setAuditModal(0);
          }}
        >
          +
        </button>
      </div>
    );
  }

  function CabinetSelections() {
    let cabinetList = [];
    Object.keys(AllItems).forEach((key) => {
      if (AllItems[key]["Object *"] === "Cabinet") {
        cabinetList.push(key);
      }
    });
    // setCabinets(cabinetList);
    return (
      <div>
        <label className="LableMain">Cabinets</label>
        <select
          className="LableInputMain"
          onChange={(e) => {
            setActive(e.target.value);
            setCabinetActive(e.target.value);
          }}
          value={cabinetUUID}
        >
          {CabinetCount === undefined ? (
            <option value={0}>No Cabinets Listed</option>
          ) : (
            <>
              {cabinetUUID === 0 ? <option value={0}>Select Cabinet</option> : null}
              {cabinetList.map((cabinetUUID, index) => {
                return (
                  <option key={index} value={cabinetUUID}>
                    {AllItems[cabinetUUID]["Name *"]}
                  </option>
                );
              })}
            </>
          )}
        </select>
      </div>
    );
  }
}
