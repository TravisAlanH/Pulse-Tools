import React from "react";
import { CurrentLocation } from "../../../../../../../Store/Store";
import { MLTStore } from "../../../../../../../Store/Store";
import { ObjectListing } from "../../../../../../../dcT_Objects/ObjectsArrays";
import { RoutingStore } from "../../../../../../../Store/Store";

export default function SlotsView({ Front, Back }) {
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const resetSortsFiltersSearches = MLTStore((state) => state.resetSortsFiltersSearches);
  const setFilters = MLTStore((state) => state.setFilters);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const setActive = CurrentLocation((state) => state.setActive);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);

  const [viewing, setViewing] = React.useState("Front");

  const AllBlades = Object.keys(AllItems).filter((item) => AllItems[item]["Object *"] === "DEVICE-BLADE");
  const AllBlaesInChassis = AllBlades.filter((blade) => AllBlades[blade]["Chassis"] === "Chassis1");

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex flex-row">
        <button className={`w-1/2 ${viewing === "Front" && "ButtonMainNonWhite"}`} onClick={() => setViewing("Front")}>
          Front
        </button>
        <button className={`w-1/2 ${viewing === "Back" && "ButtonMainNonWhite"}`} onClick={() => setViewing("Back")}>
          Back
        </button>
      </div>
      <div className="overflow-auto flex-grow">{viewing === "Front" ? SlotsViewInRow(Front) : SlotsViewInRow(Back)}</div>
    </div>
  );

  function SlotsViewInRow(Slots) {
    return (
      <div className="w-full h-full flex flex-row justify-start">
        {Array(Slots)
          .fill(0)
          .map((_, index) => {
            const slot = index + 1;
            return (
              <div className="flex flex-col" key={`Slot-${index}`}>
                <div className="min-w-[2.5rem] h-8 bg-[#f2ece6] border border-[#f2ece6] flex flex-row justify-center items-center">{slot}</div>
                <div className="min-w-[2.5rem] h-full  border border-[#f2ece6] flex flex-row justify-center items-center">{SlotEmpty(slot)}</div>
              </div>
            );
          })}
      </div>
    );

    function SlotEmpty(Slot) {
      return (
        <button
          className="border-2 border-[#f2ece6] rounded-lg px-3 w-[2rem] h-[7rem] vertical-text flex flex-row justify-center items-center"
          onClick={() => {
            resetSortsFiltersSearches();
            const Payload = {
              type: "Object",
              value: "DEVICE-BLADE",
            };
            setFilters(Payload);
            setHoldItem(ObjectListing["DEVICE-BLADE"]);
            setHoldMLTItem({});
            setActive(0);
            setHoldItemTrigger();
            setAuditModal(0);
          }}
        >
          <p>Add to {Slot}</p>
        </button>
      );
    }
  }
}
