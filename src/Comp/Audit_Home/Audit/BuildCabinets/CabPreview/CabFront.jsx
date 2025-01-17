import React from "react";
import { CurrentLocation, RoutingStore } from "../../../../../../Store/Store";
import { ObjectListing } from "../../../../../../dcT_Objects/ObjectsArrays";
import { MLTStore } from "../../../../../../Store/Store";
import { PiNotePencil, PiRowsPlusBottom, PiRowsPlusBottomThin } from "react-icons/pi";
import SlotsView from "./Slots/SlotsView";

export default function CabFront() {
  const Cabinet = CurrentLocation((state) => state.data.Cabinet);
  const AllItems = CurrentLocation((state) => state.data.AllItems);

  const [cabinetView, setCabinetView] = React.useState(Cabinet);
  const [assetsInCabinet, setAssetsInCabinet] = React.useState();
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const isLoading = RoutingStore((state) => state.isLoading);
  const Loading = RoutingStore((state) => state.data.Loading);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const setActive = CurrentLocation((state) => state.setActive);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const setFilters = MLTStore((state) => state.setFilters);
  const resetSortsFiltersSearches = MLTStore((state) => state.resetSortsFiltersSearches);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);
  const [infoSlots, setInfoSlots] = React.useState(false);
  const rows = MLTStore((state) => state.data.rows);

  React.useEffect(() => {
    setCabinetView(AllItems[Cabinet]);
    let holdAssetsInCabinet = {};
    Object.keys(AllItems).forEach((item) => {
      if (AllItems[item].hasOwnProperty("Cabinet **")) {
        if (AllItems[item]["Cabinet **"] === AllItems[Cabinet]["Name *"]) {
          holdAssetsInCabinet[parseInt(AllItems[item]["U Position **"]) + parseInt(AllItems[item]["RUHeight"]) - 1] = AllItems[item];
        }
      }
    });
    setAssetsInCabinet(holdAssetsInCabinet);
  }, [Cabinet, AllItems]);

  async function handleAddToCab(RU) {
    await isLoading(true);
    resetSortsFiltersSearches();
    const FilterList = ["RACK PDU-RACKABLE", "DATA PANEL-RACKABLE", "DEVICE-RACKABLE", "DEVICE-BLADE CHASSIS-RACKABLE", "NETWORK-RACKABLE"];
    FilterList.map((Object) => {
      const Payload = {
        type: "Object",
        value: Object,
      };
      setFilters(Payload);
    });
    setHoldMLTItem({});
    let holdItemCopy = { ...ObjectListing["DEVICE-RACKABLE"] };
    holdItemCopy["Cabinet **"] = cabinetView["Name *"];
    holdItemCopy["U Position **"] = RU;
    setHoldItem(holdItemCopy);
    setActive(0);
    setHoldItemTrigger();

    await setAuditModal(0);
    isLoading(false);
  }

  if (Cabinet === 0) {
    return (
      <div>
        <p>Cabinet Not Built</p>
      </div>
    );
  }

  const dataHeight = "min-h-[18rem]";

  function handleCloseAllOpenSelected() {
    let rows = document.getElementsByClassName("CabUFilled");
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.replace(dataHeight, "min-h-[4rem]");
    }
  }

  function handleOpenSelection(RU) {
    document.getElementById(`CabU-${RU}`).classList.replace("min-h-[4rem]", dataHeight);
  }

  const TransitionStyle = {
    transition: "all 0.5s",
  };

  return (
    <div className=" h-full w-full flex flex-col">
      {cabinetView["RUHeight"] &&
        (() => {
          let skipRUs = 0;

          return Array.from(Array(cabinetView["RUHeight"]), (e, i) => {
            let iCopy = i;

            if (skipRUs > 0) {
              skipRUs--;
              return null;
            }
            if (assetsInCabinet.hasOwnProperty(cabinetView["RUHeight"] - iCopy)) {
              const ruHeightToSkip = parseInt(assetsInCabinet[cabinetView["RUHeight"] - iCopy]["RUHeight"]);
              skipRUs = ruHeightToSkip - 1;
              // console.log("inCab", Object.entries(AllItems).find(([_, value]) => value === assetsInCabinet[cabinetView["RUHeight"] - iCopy])?.[0]);
              // ! ITEM IN CABINET
              const MLTRow = rows[rows.findIndex((obj) => obj.Model === assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Model *"])];
              return (
                <div id={`CabU-${iCopy}`} key={iCopy} className="flex flex-row min-h-[4rem] CabUFilled" style={TransitionStyle}>
                  <div className="w-1/12   border border-[#f2ece6]  flex flex-row justify-center items-center">{cabinetView["RUHeight"] - parseInt(assetsInCabinet[cabinetView["RUHeight"] - iCopy]["RUHeight"]) - iCopy + 1}</div>
                  <div className="w-11/12   border border-[#f2ece6]  flex flex-col items-start  overflow-clip">
                    <div className="px-4 flex flex-row justify-between items-center min-h-[4rem] w-full">
                      <div className="flex flex-col justify-center">
                        <p className="text-sm">{assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Name *"]}</p>
                        <p className="text-xs pl-3">{assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Make *"]}</p>
                        <p className="text-xs pl-3">{assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Model *"]}</p>
                      </div>
                      <span className="flex flex-row gap-3">
                        {MLTRow.BackSlotsCount !== 0 || MLTRow.FrontSlotsCount !== 0 ? (
                          <button
                            className="text-[1.5rem] rotate-90 font-bold"
                            onClick={() => {
                              handleCloseAllOpenSelected();
                              handleOpenSelection(iCopy);
                            }}
                          >
                            <PiRowsPlusBottom />
                          </button>
                        ) : null}
                        <button
                          className="text-[1.5rem]"
                          onClick={() => {
                            console.log("newHoldItem", assetsInCabinet[cabinetView["RUHeight"] - iCopy]);
                            setHoldMLTItem({ MLTRow });
                            setHoldItem(assetsInCabinet[cabinetView["RUHeight"] - iCopy]);
                            setActive(Object.entries(AllItems).find(([_, value]) => value === assetsInCabinet[cabinetView["RUHeight"] - iCopy])?.[0]);
                            setHoldItemTrigger();
                          }}
                        >
                          <PiNotePencil />
                        </button>
                      </span>
                    </div>
                    <div className="border-2 w-full h-full flex flex-col justify-between">
                      <div className="flex flex-row justify-between h-full">
                        <SlotsView Back={MLTRow.BackSlotsCount} Front={MLTRow.FrontSlotsCount} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // ! NO ITEM IN CABINET
            return (
              <div key={iCopy} className="flex flex-row">
                <div className="w-1/12 h-8 bg-[#f2ece6] border border-[#f2ece6] flex flex-row justify-center items-center">{cabinetView["RUHeight"] - iCopy}</div>
                <div className="w-11/12 h-8  border border-[#f2ece6]   flex flex-row justify-center items-center">
                  <button className="border-2 border-[#f2ece6] rounded-lg px-3" onClick={() => handleAddToCab(cabinetView["RUHeight"] - iCopy)}>
                    Add to {cabinetView["RUHeight"] - iCopy}
                  </button>
                </div>
              </div>
            );
          });
        })()}
    </div>
  );
}
