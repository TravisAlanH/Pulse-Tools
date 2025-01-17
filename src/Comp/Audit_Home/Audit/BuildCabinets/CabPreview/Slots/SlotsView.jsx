import React from "react";
import { CurrentLocation } from "../../../../../../../Store/Store";

export default function SlotsView({ Front, Back }) {
  const AllItems = CurrentLocation((state) => state.data.AllItems);
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
        <button className="border-2 border-[#f2ece6] rounded-lg px-3 w-[2rem] h-[7rem] vertical-text flex flex-row justify-center items-center" onClick={() => ""}>
          <p>Add to {Slot}</p>
        </button>
      );
    }
  }
}
