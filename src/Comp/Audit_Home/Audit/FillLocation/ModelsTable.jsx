// !
import React from "react";
import { MLTStore } from "../../../../../Store/Store";
import { CurrentLocation } from "../../../../../Store/Store";
import { RoutingStore } from "../../../../../Store/Store";

import FiltersView from "../FiltersViewer/FiltersView";
import SortFinishedTable from "../MLTView/SortFinishedTable";

export default function ModelsTable() {
  // const [checkedIndex, setCheckedIndex] = React.useState(null);
  const checkedIndex = MLTStore((state) => state.data.checkedIndex);
  const setCheckedIndex = MLTStore((state) => state.setCheckedIndex);
  const rows = MLTStore((state) => state.data.rows);
  const MLTFilterAndSort = MLTStore((state) => state.data);
  const [clicked, setClicked] = React.useState(null);
  const setSearchInput = MLTStore((state) => state.setSearchInput);
  const Filters = MLTStore((state) => state.data.filters);
  const SearchInput = MLTStore((state) => state.data.searchInput);
  const Active = CurrentLocation((state) => state.data.Active);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);

  const headerStyle = "border-2 border-[#F2ECE6] px-2 h-[2.5rem] bg-[#F2ECE6] text-nowrap font-normal text-sm";
  const rowStyle = "border-2 border-[#F2ECE6] px-2 w-[12rem] h-[2rem] text-nowrap overflow-clip";
  const checkboxStyle = "px-2 h-[1.5rem] w-[1.5rem] ActiveItemCheckbox";

  const [trOrder, setTrOrder] = React.useState(["Make", "Model", "RUHeight", "Object", "Height", "Width", "Depth", "Class", "Subclass", "Mounting", "DataPortsCount", "PowerPortsCount", "FrontSlotsCount", "BackSlotsCount"]);
  const [thOrder, setThOrder] = React.useState(["Make", "Model", "RUHeight", "Object", "Height", "Width", "Depth", "Class", "Subclass", "Mounting", "DataPortsCount", "PowerPortsCount", "FrontSlotsCount", "BackSlotsCount"]);
  const [SelectedHoldItem, setSelectedHoldItem] = React.useState({});
  const [SpliceEnd, setSpliceEnd] = React.useState(15);

  const OriginRowsCount = React.useRef(Object.keys(rows).length);

  React.useEffect(() => {
    if (AllItems.hasOwnProperty(Active)) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].Model === AllItems[Active]["Model *"]) {
          setCheckedIndex(rows[i].index);
          setHoldMLTItem(rows[i]);
          break;
        }
      }
    } else {
      setCheckedIndex(null);
      setHoldMLTItem({});
    }
  }, []);

  const [filteredCount, setFilteredCount] = React.useState(Object.keys(rows).length);

  const filteredRows = rows
    .filter((row) => {
      return Object.keys(Filters).every((key) => {
        if (Filters[key].length === 0) {
          return true;
        }
        return Filters[key].includes(row[key]);
      });
    })
    .filter((row) => {
      return Object.keys(SearchInput).every((key) => {
        if (SearchInput[key] === "") {
          return true;
        }
        return String(row[key]).toLowerCase().includes(String(SearchInput[key]).toLowerCase());
      });
    })
    .sort((a, b) => {
      const SortedBy = MLTFilterAndSort.sortType;
      const SortedOrder = MLTFilterAndSort.sortDirection;
      if (SortedOrder === 0) {
        return a.index - b.index;
      }
      const aValue = a[SortedBy];
      const bValue = b[SortedBy];

      if (SortedBy === "accuracyOne") {
        if (SortedOrder === 1) {
          return parseFloat(bValue) - parseFloat(aValue);
        } else if (SortedOrder === -1) {
          return parseFloat(aValue) - parseFloat(bValue);
        }
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        if (SortedOrder === 1) {
          return bValue - aValue;
        } else if (SortedOrder === -1) {
          return aValue - bValue;
        }
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (SortedOrder === 1) {
          return bValue.localeCompare(String(aValue));
        } else if (SortedOrder === -1) {
          return aValue.localeCompare(String(bValue));
        }
      }
      return 0;
    })
    .slice(0, SpliceEnd);

  React.useEffect(() => {
    setFilteredCount(filteredRows.length);
  }, [SearchInput, MLTFilterAndSort, rows]);

  return (
    // <div className="flex-grow flex flex-col justify-start items-start w-full h-full">
    //   <div className="flex-grow flex flex-col items-start  w-full h-full">

    <div className="max-h-full flex flex-col gap-2 items-start w-full h-full">
      <div className="flex flex-row justify-start w-full">
        <FiltersView ShownCount={filteredCount} OriginRowsCount={OriginRowsCount.current} setSpliceEnd={setSpliceEnd} SpliceEnd={SpliceEnd} />
      </div>
      {/* <div class=" overflow-y-auto w-full max-h-[90%]" id="tableDiv"> */}

      <div className="max-h-[90%] overflow-y-auto">
        <table className="border-0 border-[#F2ECE6]">
          <thead>
            <tr>
              <th className={headerStyle}>Select</th>
              {thOrder.map((header, index) => {
                return (
                  <th key={index} className={headerStyle}>
                    {HeaderFunction(header, thOrder, setThOrder, trOrder, setTrOrder, index)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => {
              return (
                <tr key={index} className={` border-[#F2ECE6] text-sm border-2 px-2 ${clicked === row.index ? "bg-[#F2ECE6]" : ""}`} onClick={() => setClicked(row.index)}>
                  <td className=" flex flex-row justify-center items-center h-[3rem]">
                    <input
                      key={index}
                      id={"CheckBox" + index}
                      type="checkbox"
                      className={`${checkboxStyle} border-0`}
                      checked={checkedIndex === row.index}
                      onChange={() => {
                        if (checkedIndex === row.index) {
                          setCheckedIndex(null);
                          setHoldMLTItem({});
                          setSelectedHoldItem({});
                        } else {
                          setCheckedIndex(row.index);
                          setSelectedHoldItem(row);
                        }
                      }}
                    />
                  </td>
                  {trOrder.map((header, index) => {
                    return (
                      <td key={index} className={rowStyle}>
                        {row[header]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-between gap-[10rem]">
        <button className="bg-[#f76565] text-white font-bold py-2 px-4 rounded-lg" onClick={() => setClicked(null)}>
          Clear
        </button>
        <button
          disabled={Object.keys(SelectedHoldItem).length === 0 || setCheckedIndex === null}
          className={` text-white font-bold py-2 px-4 rounded-lg ${Object.keys(SelectedHoldItem).length === 0 || setCheckedIndex === null ? "bg-[#757575]" : "bg-[#00B188]"}`}
          onClick={() => {
            setHoldMLTItem(SelectedHoldItem);
            setAuditModal(1);
            console.log(SelectedHoldItem);
          }}
        >
          Select
        </button>
      </div>
    </div>
  );

  function HeaderFunction(Header, thOrder, setThOrder, trOrder, setTrOrder, index) {
    return (
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-center justify-between gap-3">
          <p>{Header}</p> <SortFinishedTable Type={Header} thOrder={thOrder} setThOrder={setThOrder} trOrder={trOrder} setTrOrder={setTrOrder} index={index} />
        </div>
        <input
          type="text"
          className="border-2 px-2 h-[2rem] w-full"
          placeholder="Search"
          onChange={(e) => {
            const payload = {
              type: Header,
              value: e.target.value,
            };
            setSearchInput(payload);
          }}
        />
      </div>
    );
  }
}
