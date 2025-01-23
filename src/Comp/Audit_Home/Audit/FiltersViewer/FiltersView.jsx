import React from "react";
import { MLTStore } from "../../../../../Store/Store";

export default function FiltersView({ ShownCount, OriginRowsCount, setSpliceEnd, SpliceEnd }) {
  const sortType = MLTStore((state) => state.data.sortType);
  const sortDirection = MLTStore((state) => state.data.sortDirection);
  const searchInput = MLTStore((state) => state.data.searchInput);
  const filters = MLTStore((state) => state.data.filters);
  const [CommonMLTSelected, setCommonMLTSelected] = React.useState(false);
  const [StandardMLTSelected, setStandardMLTSelected] = React.useState(true);
  const [CustomMLTSelected, setCustomMLTSelected] = React.useState(false);

  function handleTableView(index) {
    const actions = [setStandardMLTSelected, setCommonMLTSelected, setCustomMLTSelected];
    actions.forEach((action, i) => {
      if (i === index) {
        action(true);
      } else {
        action(false);
      }
    });
  }

  return (
    <div className=" flex flex-col items-start gap-5 w-full h-[5rem] mb-2">
      <div className="flex flex-row gap-4 text-sm text-[#00B188]">
        <div className="flex flex-row gap-1">
          <span className="text-black">Showing:</span>
          <span>{SpliceEnd}</span>
          <span className="text-black">of</span>
          <span>{OriginRowsCount}</span>
        </div>
        {sortDirection !== 0 && (
          <div className="flex flex-row gap-1">
            <span className="text-black">Sort:</span>
            <span>{sortType}</span>
            <span>{sortDirection === 1 ? "▲" : sortDirection === -1 ? "▼" : ""}</span>
          </div>
        )}
        {Object.keys(searchInput).some((key) => searchInput[key] !== "") && (
          <div className="flex flex-row gap-1">
            <span className="text-black">Search:</span>
            <span>{Object.keys(searchInput).filter((key) => searchInput[key] !== "").length}</span>
          </div>
        )}
        <select
          className="text-black text-sm"
          onChange={(e) => {
            setSpliceEnd(parseInt(e.target.value));
          }}
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
      <div className="h-[2rem] flex flex-row justify-between gap-3">
        <div className="flex flex-row gap-3">
          <button
            className={` ${StandardMLTSelected ? "ButtonMainNonWhite" : "ButtonMain"}`}
            onClick={() => {
              handleTableView(0);
            }}
          >
            Library
          </button>
          <button
            className={` ${CommonMLTSelected ? "ButtonMainNonWhite" : "ButtonMain"}`}
            onClick={() => {
              handleTableView(1);
            }}
          >
            Common
          </button>
          <button
            className={` ${CustomMLTSelected ? "ButtonMainNonWhite" : "ButtonMain"}`}
            onClick={() => {
              handleTableView(2);
            }}
          >
            Custom
          </button>
        </div>
      </div>
    </div>
  );
}
