import React from "react";
import { CurrentLocation } from "../../../../Store/Store";
import CabinetSet from "./BuildCabinets/AddCabinet/CabinetSet";
import MLTTable from "./MLTView/MLTTable";
import HoldQuestions from "./BuildCabinets/AuditQuestions/HoldQuestions";
import CustomMLTTable from "./MLTView/CustomMLTTable";
import CommonMLTTable from "./MLTView/CommonMLTTable";
import CabView from "./BuildCabinets/CabPreview/CabView";
import { MLTStore } from "../../../../Store/Store";

export default function AuditPanels() {
  const Cabinet = CurrentLocation((state) => state.data.Cabinet);
  const Location = CurrentLocation((state) => state.data.Location);
  const Active = CurrentLocation((state) => state.data.Active);
  const HoldItem = CurrentLocation((state) => state.data.HoldItem);
  const [CommonMLTSelected, setCommonMLTSelected] = React.useState(false);
  const [StandardMLTSelected, setStandardMLTSelected] = React.useState(true);
  const [CustomMLTSelected, setCustomMLTSelected] = React.useState(false);
  const [SpliceEnd, setSpliceEnd] = React.useState(20);
  const holdMLTItem = MLTStore((state) => state.data.holdMLTItem);

  // function handleTableView(index) {
  //   const actions = [setStandardMLTSelected, setCommonMLTSelected, setCustomMLTSelected];
  //   actions.forEach((action, i) => {
  //     if (i === index) {
  //       action(true);
  //     } else {
  //       action(false);
  //     }
  //   });
  React.useEffect(() => {
    const holdQuestionsDiv = document.getElementById("HoldQuestions");

    // Add the 'flash-border' class to trigger the animation
    if (holdQuestionsDiv) {
      holdQuestionsDiv.classList.add("flash-border");

      // Remove the class after the animation completes (adjust timing if needed)
      const timeoutId = setTimeout(() => {
        holdQuestionsDiv.classList.remove("flash-border");
      }, 600); // Match this duration with animation duration

      // Clean up the timeout when the component is unmounted or `Active` changes
      return () => clearTimeout(timeoutId);
    }
  }, [Active]);

  return (
    <div class="flex-grow flex flex-row justify-center gap-4 items-center w-full h-full p-4" id="Panels">
      <div className="w-[25%] !max-h-full !min-h-full flex flex-col overflow-auto no-scrollbar">
        <div className="flex flex-col h-[2rem] w-full">
          <CabinetSet />
          <CabView />
        </div>
      </div>{" "}
      <div id="HoldQuestions" className={` w-[25%] !max-h-full !min-h-full flex flex-col overflow-auto no-scrollbar px-1`}>
        <div className="flex flex-col h-[2rem] w-full">
          <HoldQuestions />
        </div>
      </div>
      <div class="w-[50%] !max-h-full !min-h-full flex flex-col overflow-auto no-scrollbar" id="PanelOne">
        {/* <div className="h-[2rem] flex flex-row justify-between">
          <select
            onChange={(e) => {
              setSpliceEnd(parseInt(e.target.value));
            }}
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <div className="flex flex-row gap-3">
            <button
              className={`border-2 ${StandardMLTSelected ? "border-blue-400" : ""}`}
              onClick={() => {
                handleTableView(0);
              }}
            >
              Library
            </button>
            <button
              className={`border-2 ${CommonMLTSelected ? "border-blue-400" : ""}`}
              onClick={() => {
                handleTableView(1);
              }}
            >
              Common
            </button>
            <button
              className={`border-2 ${CustomMLTSelected ? "border-blue-400" : ""}`}
              onClick={() => {
                handleTableView(2);
              }}
            >
              Custom
            </button>
          </div>
        </div> */}
        <div className="h-[1.5rem]"></div>
        <div className="h-[10rem]">{StandardMLTSelected && <MLTTable SpliceEnd={SpliceEnd} />}</div>
        {/* {CommonMLTSelected && <CommonMLTTable />} */}
        {/* {CustomMLTSelected && <CustomMLTTable />} */}
      </div>
    </div>
  );
}
