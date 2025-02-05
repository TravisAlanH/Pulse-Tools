import React from "react";
import { CurrentLocation, RoutingStore } from "../../../../../../Store/Store";
import { ObjectListing } from "../../../../../../dcT_Objects/ObjectsArrays";
import { MLTStore } from "../../../../../../Store/Store";
import { PiListMagnifyingGlassDuotone, PiNotePencil, PiRowsPlusBottom, PiXSquare } from "react-icons/pi";
import SlotsView from "./Slots/SlotsView";
import Above from "./Above";

export default function CabFront() {
  const Orintation = "Front";
  const OpOrintation = "Back";

  const Cabinet = CurrentLocation((state) => state.data.Cabinet);
  const AllItems = CurrentLocation((state) => state.data.AllItems);

  // const [cabinetView, setCabinetView] = React.useState(Cabinet);
  // const [assetsInCabinet, setAssetsInCabinet] = React.useState();
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

  let assetsInCabinet = [];
  let cabinetView = AllItems[Cabinet];
  // setCabinetView(AllItems[Cabinet]);
  let holdAssetsInCabinet = {};
  Object.keys(AllItems).forEach((item) => {
    if (AllItems[item].hasOwnProperty("Cabinet **")) {
      if (AllItems[item]["Cabinet **"] === AllItems[Cabinet]["Name *"]) {
        if (AllItems[item]["U Position **"] !== "Above" && AllItems[item]["U Position **"] !== "Below") {
          holdAssetsInCabinet[parseInt(AllItems[item]["U Position **"]) + parseInt(AllItems[item]["RUHeight"]) - 1] = AllItems[item];
        }
      }
    }
  });
  assetsInCabinet = holdAssetsInCabinet;

  // let aboveInCabinet = {};
  // Object.keys(AllItems).forEach((item) => {
  //   if (AllItems[item].hasOwnProperty("Cabinet **")) {
  //     if (AllItems[item]["Cabinet **"] === AllItems[Cabinet]["Name *"]) {
  //       if (AllItems[item]["U Position **"] === "Above") {
  //         aboveInCabinet[parseInt(AllItems[item]["RUHeight"]) - 1] = AllItems[item];
  //       }
  //     }
  //   }
  // });

  // let belowInCabinet = {};
  // Object.keys(AllItems).forEach((item) => {
  //   if (AllItems[item].hasOwnProperty("Cabinet **")) {
  //     if (AllItems[item]["Cabinet **"] === AllItems[Cabinet]["Name *"]) {
  //       if (AllItems[item]["U Position **"] === "Below") {
  //         belowInCabinet[parseInt(AllItems[item]["RUHeight"]) - 1] = AllItems[item];
  //       }
  //     }
  //   }
  // });

  // React.useEffect(() => {
  //   setCabinetView(AllItems[Cabinet]);
  //   let holdAssetsInCabinet = {};
  //   Object.keys(AllItems).forEach((item) => {
  //     if (AllItems[item].hasOwnProperty("Cabinet **")) {
  //       if (AllItems[item]["Cabinet **"] === AllItems[Cabinet]["Name *"]) {
  //         holdAssetsInCabinet[parseInt(AllItems[item]["U Position **"]) + parseInt(AllItems[item]["RUHeight"]) - 1] = AllItems[item];
  //       }
  //     }
  //   });
  //   setAssetsInCabinet(holdAssetsInCabinet);
  // }, [Cabinet, AllItems]);

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
    holdItemCopy["Rails Used **"] = "Both";
    holdItemCopy["Orientation **"] = `Front Faces Cabinet ${Orintation}`;
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
      {AboveBelow("Above")}
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
              const rails = assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Rails Used **"];
              skipRUs = ruHeightToSkip - 1;
              // console.log("inCab", Object.entries(AllItems).find(([_, value]) => value === assetsInCabinet[cabinetView["RUHeight"] - iCopy])?.[0]);
              // ! ITEM IN CABINET
              const MLTRow = rows[rows.findIndex((obj) => obj.Model === assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Model *"])];
              if (assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Rails Used **"] !== Orintation && assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Rails Used **"] !== "Both") {
                return otherSideView(cabinetView["RUHeight"] - parseInt(assetsInCabinet[cabinetView["RUHeight"] - iCopy]["RUHeight"]) - iCopy + 1);
              }

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
                            className="text-[1.5rem] rotate-90 font-bold text-blue-700"
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
                            setHoldMLTItem({ MLTRow });
                            setHoldItem(assetsInCabinet[cabinetView["RUHeight"] - iCopy]);
                            setActive(Object.entries(AllItems).find(([_, value]) => value === assetsInCabinet[cabinetView["RUHeight"] - iCopy])?.[0]);
                            setHoldItemTrigger();
                            setAuditModal(1);
                          }}
                        >
                          <PiNotePencil />
                        </button>
                        <button
                          className="text-[1.5rem] text-red-700"
                          onClick={() => {
                            setActive(Object.entries(AllItems).find(([_, value]) => value === assetsInCabinet[cabinetView["RUHeight"] - iCopy])?.[0]);
                            setHoldItemTrigger();
                            setAuditModal(4);
                          }}
                        >
                          <PiXSquare />
                        </button>
                      </span>
                    </div>
                    <div className="border-2 w-full h-full flex flex-col justify-between">
                      <div className="flex flex-row justify-between h-full">
                        <SlotsView Back={MLTRow.BackSlotsCount} Front={MLTRow.FrontSlotsCount} chassis={assetsInCabinet[cabinetView["RUHeight"] - iCopy]["Name *"]} cabinet={AllItems[Cabinet]["Name *"]} location={AllItems[Cabinet]["Location *"]} orintation={Orintation} />
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
      {AboveBelow("Below")}
    </div>
  );

  function otherSideView(iCopy) {
    return (
      <div className="flex flex-row">
        <div className="w-1/12 border border-[#f2ece6] flex flex-row justify-center items-center">{iCopy}</div>
        <div
          id="stripes"
          className="w-11/12 border border-[#f2ece6] px-4 flex flex-row justify-between items-center min-h-[4rem]"
          style={{
            // backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, #fff)",
            // backgroundSize: "50px 50px",
            backgroundImage: "linear-gradient(45deg, #f2ece6 12.5%, transparent 12.5%, transparent 37.5%, #f2ece6 37.5%, #f2ece6 62.5%, transparent 62.5%, transparent 87.5%, #f2ece6 87.5%)",
            backgroundSize: "5px 5px",
          }}
        >
          <div className="flex flex-row justify-center items-center w-full">
            <p>{OpOrintation} Rails Used</p>
          </div>
        </div>
      </div>
    );
  }

  function AboveBelow(Loc) {
    return (
      <div className="flex flex-row">
        <div className="w-1/12 h-10 bg-[#f2ece6] border border-[#f2ece6] flex flex-row justify-center items-center">{Loc[0]}</div>
        <div className="w-11/12 h-10  border border-[#f2ece6]   flex flex-row justify-between items-center px-4">
          <button className="border-2 border-[#f2ece6] rounded-lg px-3 h-7" onClick={() => handleAddToCab(Loc)}>
            Add {Loc}
          </button>

          <button className="text-[1.5rem]" onClick={() => setAuditModal(Loc === "Above" ? 5 : 6)}>
            <PiListMagnifyingGlassDuotone />
          </button>
        </div>
      </div>
    );
  }
}
