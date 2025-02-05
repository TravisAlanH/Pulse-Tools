import React from "react";
import { CurrentLocation, RoutingStore } from "../../../../../../Store/Store";
import { PiNotePencil, PiXSquare } from "react-icons/pi";

export default function Above({}) {
  const Loc = "Above";

  const Cabinet = CurrentLocation((state) => state.data.Cabinet);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setActive = CurrentLocation((state) => state.setActive);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);

  let InCabinet = {};
  Object.keys(AllItems).forEach((item) => {
    if (AllItems[item].hasOwnProperty("Cabinet **")) {
      if (AllItems[item]["Cabinet **"] === AllItems[Cabinet]["Name *"]) {
        if (AllItems[item]["U Position **"] === Loc) {
          InCabinet[item] = AllItems[item];
        }
      }
    }
  });

  console.log("InCabinet", InCabinet);

  return (
    <div className="w-full">
      <div className="w-full">
        {Object.keys(InCabinet).map((item) => {
          return (
            <div className="flex flex-row w-full">
              <div className="w-1/12 min-h-[4rem] bg-[#f2ece6] border border-[#f2ece6] flex flex-row justify-center items-center">{Loc[0]}</div>
              <div className="w-11/12 min-h-[4rem] border border-[#f2ece6]   flex flex-row justify-between items-cente px-4">
                <div className="flex flex-col justify-center">
                  <p className="text-sm">{InCabinet[item]["Name *"]}</p>
                  <p className="text-xs pl-3">{InCabinet[item]["Make *"]}</p>
                  <p className="text-xs pl-3">{InCabinet[item]["Model *"]}</p>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="flex flex-row gap-3">
                    <button
                      className="text-[1.5rem]"
                      onClick={() => {
                        setHoldItem(InCabinet[item]);
                        setActive(item);
                        setHoldItemTrigger();
                        setAuditModal(1);
                      }}
                    >
                      <PiNotePencil />
                    </button>
                    <button
                      className="text-[1.5rem] text-red-700"
                      onClick={() => {
                        setActive(item);
                        setHoldItemTrigger();
                        setAuditModal(4);
                      }}
                    >
                      <PiXSquare />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
