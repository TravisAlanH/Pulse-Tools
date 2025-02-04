import React from "react";
import { CurrentLocation } from "../../../../../../../Store/Store";
import { MLTStore } from "../../../../../../../Store/Store";
import { ObjectListing } from "../../../../../../../dcT_Objects/ObjectsArrays";
import { RoutingStore } from "../../../../../../../Store/Store";
import ScrollCheckInput from "../../../../../Imputs/ScrollCheckInput";
import { PiNotePencil } from "react-icons/pi";

export default function SlotsView({ Front, Back, chassis, cabinet, location, orintation }) {
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const resetSortsFiltersSearches = MLTStore((state) => state.resetSortsFiltersSearches);
  const setFilters = MLTStore((state) => state.setFilters);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const setActive = CurrentLocation((state) => state.setActive);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);
  const rows = MLTStore((state) => state.data.rows);

  const [viewing, setViewing] = React.useState(orintation);

  const AllBlades = Object.keys(AllItems)
    .filter((item) => AllItems[item]["Object *"] === "DEVICE-BLADE")
    .map((key) => AllItems[key]);
  const AllBladesInChassis = Object.keys(AllBlades)
    .filter((blade) => AllBlades[blade]["Chassis **"] === chassis)
    .map((key) => AllBlades[key]);

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
      <div className="overflow-auto flex-grow">{viewing === "Front" ? SlotsViewInRow(Front, "Front") : SlotsViewInRow(Back, "Back")}</div>
    </div>
  );

  function SlotsViewInRow(Slots, View) {
    return (
      <div className="w-full h-full flex flex-row justify-start">
        {Array(Slots)
          .fill(0)
          .map((_, index) => {
            const slot = index + 1;
            const indexOfSlottedItem = AllBladesInChassis.findIndex((blade) => parseInt(blade["Slot Position **"]) === slot && blade["Chassis Face **"] === View);
            return (
              <div className="flex flex-col" key={`Slot-${index}`}>
                <div className="min-w-[2.5rem] h-8 bg-[#f2ece6] border border-[#f2ece6] flex flex-row justify-center items-center">{slot}</div>
                <div className="min-w-[2.5rem] h-full  border border-[#f2ece6] flex flex-row justify-center items-center">{indexOfSlottedItem !== -1 ? SlotFilled(AllBladesInChassis[indexOfSlottedItem]) : SlotEmpty(slot)}</div>
              </div>
            );
          })}
      </div>
    );

    // AllBladesInChassis.filter((blade) => blade["Slot Position **"] === slot)

    function SlotFilled(slot) {
      return (
        <div className="w-full h-full flex flex-col justify-between p-2">
          <div className="flex flex-col justify-center items-start">
            <ScrollCheckInput text={slot["Name *"]} rem={6} count={10} />
            <ScrollCheckInput text={slot["Make *"]} rem={6} count={10} />
            <ScrollCheckInput text={slot["Model *"]} rem={6} count={10} />
          </div>
          <div className="flex flex-row justify-center items-center">
            {/* <button
              className="text-[1.5rem] rotate-90 font-bold"
              onClick={() => {
                // handleCloseAllOpenSelected();
                // handleOpenSelection(iCopy);
              }}
            >
              +
            </button> */}
            <button
              className="text-[1.5rem]"
              onClick={() => {
                const MLTRow = rows[rows.findIndex((obj) => obj.Model === slot["Model *"])];
                setHoldMLTItem({ MLTRow });
                setHoldItem(slot);
                setActive(Object.entries(AllItems).find(([_, value]) => value["Name *"] === slot["Name *"])?.[0]);
                setHoldItemTrigger();
                setAuditModal(1);
              }}
            >
              <PiNotePencil />
            </button>
          </div>
        </div>
      );
    }

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
            let holdItemCopy = { ...ObjectListing["DEVICE-BLADE"] };
            holdItemCopy["Chassis **"] = chassis;
            holdItemCopy["Slot Position **"] = Slot;
            holdItemCopy["Chassis Face **"] = viewing;
            holdItemCopy["Cabinet **"] = cabinet;
            holdItemCopy["Location *"] = location;
            setHoldItem(holdItemCopy);
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
