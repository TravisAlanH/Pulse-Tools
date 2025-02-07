import React from "react";

import { CurrentLocation, MLTStore, RoutingStore } from "../../../../../../Store/Store";
import { ObjectListing } from "../../../../../../dcT_Objects/ObjectsArrays";
import { PiNotePencil, PiXSquare } from "react-icons/pi";

export default function CabPDU() {
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const resetSortsFiltersSearches = MLTStore((state) => state.resetSortsFiltersSearches);
  const setFilters = MLTStore((state) => state.setFilters);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const setActive = CurrentLocation((state) => state.setActive);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);
  const cabinet = CurrentLocation((state) => state.data.Cabinet);
  const location = CurrentLocation((state) => state.data.Location);

  const ObjectType = "RACK PDU-ZERO U";

  const RightSide = Object.keys(AllItems)
    .filter((item) => AllItems[item]["Object *"] === ObjectType && AllItems[item]["Cabinet Side **"] === "Right")
    .map((key) => AllItems[key]);

  const orderedRightSide = ["Back", "Center", "Front"].map((position) => RightSide.find((item) => item["Depth Position **"] === position) || {});

  const LeftSide = Object.keys(AllItems)
    .filter((item) => AllItems[item]["Object *"] === ObjectType && AllItems[item]["Cabinet Side **"] === "Left")
    .map((key) => AllItems[key]);

  const orderedLeftSide = ["Front", "Center", "Back"].map((position) => LeftSide.find((item) => item["Depth Position **"] === position) || {});

  const rightOrder = ["Back", "Center", "Front"];
  const leftOrder = ["Front", "Center", "Back"];

  return (
    <div className="flex flex-row justify-evenly gap-8 w-full mt-6">
      <div className="flex flex-col ">
        <div className="flex flex-row justify-center bg-[#f2ece6] rounded-sm mb-2">Left</div>
        <div className="flex flex-row">{orderedLeftSide.map((item, index) => (item["Name *"] ? FilledDepthPosition(item, leftOrder[index]) : EmptyDepthPosition(leftOrder[index], "Left")))}</div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center bg-[#f2ece6] rounded-sm mb-2">Right</div>
        <div className="flex flex-row">{orderedRightSide.map((item, index) => (item["Name *"] ? FilledDepthPosition(item, rightOrder[index]) : EmptyDepthPosition(rightOrder[index], "Right")))}</div>
      </div>
    </div>
  );

  function EmptyDepthPosition(depth, side) {
    return (
      <div className="border-2 border-[#f2ece6] rounded-lg px-2 h-[30rem] flex flex-col justify-center items-center">
        <p className="text-sm">{depth[0]}</p>
        <div className="h-full w-full flex flex-col justify-center items-center vertical-text">
          <button
            className="border-2 border-[#f2ece6] rounded-lg px-3 w-[2rem] h-[7rem] vertical-text flex flex-row justify-center items-center"
            onClick={() => {
              resetSortsFiltersSearches();
              const Payload = {
                type: "Object",
                value: "RACK PDU-ZERO U",
              };
              setFilters(Payload);
              let holdItemCopy = { ...ObjectListing["RACK PDU-ZERO U"] };
              holdItemCopy["Depth Position **"] = depth;
              holdItemCopy["Cabinet Side **"] = side;
              holdItemCopy["Cabinet **"] = AllItems[cabinet]["Name *"];
              holdItemCopy["Location *"] = AllItems[location]["dcTrack Location Code*"];
              holdItemCopy["U Position **"] = 1;
              setHoldItem(holdItemCopy);
              setHoldMLTItem({});
              setActive(0);
              setHoldItemTrigger();
              setAuditModal(0);
            }}
          >
            Add to {depth}
          </button>
        </div>
      </div>
    );
  }

  function FilledDepthPosition(item, depth) {
    return (
      <div className="flex flex-col justify-start items-center h-[30rem] w-full  border-2 border-[#f2ece6] rounded-lg px-2">
        <p className="text-sm">{depth[0]}</p>
        <div className=" flex flex-row gap-6 h-full w-full justify-center items-center vertical-text">
          <div className="h-1/4">
            <p className="text-sm">{item["Name *"]}</p>
          </div>
          <div className="flex flex-col justify-center items-start h-1/4">
            <p className="text-xs">{item["Make *"]}</p>
            <p className="text-xs">{item["Model *"]}</p>
          </div>
          <div className="flex flex-row justify-center gap-6 items-start h-1/5">
            <button
              className="text-[1.5rem]"
              onClick={() => {
                setHoldItem(item);
                setActive(Object.entries(AllItems).find(([_, objectValue]) => objectValue["Name *"] === item["Name *"])?.[0]);
                setHoldItemTrigger();
                setAuditModal(1);
              }}
            >
              <PiNotePencil />
            </button>
            <button
              className="text-[1.5rem]  text-red-700"
              onClick={() => {
                setActive(Object.entries(AllItems).find(([_, objectValue]) => objectValue["Name *"] === item["Name *"])?.[0]);
                setHoldItemTrigger();
                setAuditModal(4);
              }}
            >
              <PiXSquare />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
