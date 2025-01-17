import React from "react";
import CabinetSet from "../BuildCabinets/AddCabinet/CabinetSet";
import CabView from "../BuildCabinets/CabPreview/CabView";

export default function Cabinet() {
  return (
    <div className="w-full h-full p-4">
      <div className="!max-h-full !min-h-full flex flex-col overflow-auto no-scrollbar">
        <div className="flex flex-col h-[2rem] w-full">
          <CabinetSet />
          <CabView />
        </div>
      </div>
    </div>
  );
}
