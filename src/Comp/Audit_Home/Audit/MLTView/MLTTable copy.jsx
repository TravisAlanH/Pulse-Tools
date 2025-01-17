import React from "react";
import { MLTStore } from "../../../../Store/Store";
import { CurrentLocation } from "../../../../Store/Store";
import SortFinishedTable from "./SortFinishedTable";
import { ReserseHeaderConversions } from "../../../../dcT_Objects/Data/HeaderConversions";
import { HeaderConversions } from "../../../../dcT_Objects/Data/HeaderConversions";
import { ObjectListing } from "../../../../dcT_Objects/ObjectsArrays";

export default function MLTTable() {
  const [SpliceEnd, setSpliceEnd] = React.useState(0);
  const [checkedIndex, setCheckedIndex] = React.useState(null);
  const rows = MLTStore((state) => state.data.rows);
  const MLTFilterAndSort = MLTStore((state) => state.data);
  const [clicked, setClicked] = React.useState(null);
  const setSearchInput = MLTStore((state) => state.setSearchInput);
  const Filters = MLTStore((state) => state.data.filters);
  const SearchInput = MLTStore((state) => state.data.searchInput);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const Active = CurrentLocation((state) => state.data.Active);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const holdItem = CurrentLocation((state) => state.data.HoldItem);

  //   console.log(uniqueHeaders);

  const headerStyle = "border-2 px-2 h-[2.5rem] bg-gray-300 text-nowrap";
  const rowStyle = "border-2 px-2 w-[12rem] h-[2rem] text-nowrap overflow-clip";
  const checkboxStyle = "border-2 px-2 h-[1.5rem] w-[1.5rem] ActiveItemCheckbox";

  React.useEffect(() => {
    setSpliceEnd(10);
  }, []);

  React.useEffect(() => {
    if (AllItems.hasOwnProperty(Active)) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].Model === AllItems[Active]["Model *"]) {
          setCheckedIndex(rows[i].index);
          break;
        }
      }
    } else {
      setCheckedIndex(null);
    }
  }, [Active]);

  return (
    <div className="p-4 flex flex-col flex-1 h-full">
      <div>
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
      </div>
      <div className="flex-1 overflow-scroll">
        <table>
          <thead>
            <tr>
              <th className={headerStyle}>Select</th>
              <th className={`${headerStyle}`}>{HeaderFunction("Object")}</th>
              <th className={headerStyle}>{HeaderFunction("Make")}</th>
              <th className={headerStyle}>{HeaderFunction("Model")}</th>
              <th className={headerStyle}>{HeaderFunction("Height")}</th>
              <th className={headerStyle}>{HeaderFunction("Width")}</th>
              <th className={headerStyle}>{HeaderFunction("Depth")}</th>
              <th className={headerStyle}>{HeaderFunction("Class")}</th>
              <th className={headerStyle}>{HeaderFunction("Subclass")}</th>
              <th className={headerStyle}>{HeaderFunction("Mounting")}</th>
              <th className={headerStyle}>{HeaderFunction("DataPortsCount")}</th>
              <th className={headerStyle}>{HeaderFunction("PowerPortsCount")}</th>
              <th className={headerStyle}>{HeaderFunction("FrontSlotsCount")}</th>
              <th className={headerStyle}>{HeaderFunction("BackSlotsCount")}</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((row) => {
                return Object.keys(Filters).every((key) => {
                  if (Filters[key].length === 0) {
                    return true;
                  }
                  return Filters[key].includes(row[key]);
                });
              })
              .filter((row) => {
                // Check each key in the search object
                return Object.keys(SearchInput).every((key) => {
                  // Only apply filter if search[key] is not an empty string
                  if (SearchInput[key] === "") {
                    return true; // Skip filtering for empty search fields
                  }
                  // Otherwise, check if row[key] matches search[key]
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

                if (typeof aValue === "string" && typeof bValue === "string") {
                  if (SortedOrder === 1) {
                    return bValue.localeCompare(String(aValue));
                  } else if (SortedOrder === -1) {
                    return aValue.localeCompare(String(bValue));
                  }
                }
                return 0;
              })
              .slice(0, SpliceEnd)
              .map((row, index) => (
                <tr
                  key={row.index}
                  className={`text-sm border-2 px-2 h-full ${clicked === row.index ? "bg-gray-300" : ""}`}
                  onClick={() => setClicked(row.index)}
                >
                  <td className="flex flex-row justify-center items-center h-[3rem]">
                    <input
                      key={index}
                      id={"CheckBox" + index}
                      type="checkbox"
                      className={checkboxStyle}
                      checked={checkedIndex === row.index}
                      onChange={() => {
                        console.log(checkedIndex, row.index);
                        if (checkedIndex === row.index) {
                          console.log("Unchecking");
                          setHoldItem({});
                          setCheckedIndex(null);
                          return;
                        } else {
                          console.log("Checking");
                          if (ObjectListing.hasOwnProperty(row.Object)) {
                            let HoldItemCopy = ObjectListing[row.Object];
                            Object.keys(row).forEach((header) => {
                              if (HoldItemCopy.hasOwnProperty([ReserseHeaderConversions[header]])) {
                                if (HoldItemCopy[ReserseHeaderConversions[header]] === "") {
                                  HoldItemCopy[ReserseHeaderConversions[header]] = row[header];
                                }
                              }
                            });
                            setHoldItem(HoldItemCopy);
                          } else {
                            let HoldItemCopy = ObjectListing["DEVICE-RACKABLE"];
                            Object.keys(row).forEach((header) => {
                              if (HoldItemCopy.hasOwnProperty([ReserseHeaderConversions[header]])) {
                                if (HoldItemCopy[ReserseHeaderConversions[header]] === "") {
                                  HoldItemCopy[ReserseHeaderConversions[header]] = row[header];
                                }
                              }
                            });
                            setHoldItem(HoldItemCopy);
                          }
                          setCheckedIndex(row.index);
                        }
                      }}
                    />
                  </td>
                  <td className={`${rowStyle}`}>{row.Object}</td>
                  <td className={rowStyle}>{row.Make}</td>
                  <td className={rowStyle}>{row.Model}</td>
                  <td className={rowStyle}>{row.Height}</td>
                  <td className={rowStyle}>{row.Width}</td>
                  <td className={rowStyle}>{row.Depth}</td>
                  <td className={rowStyle}>{row.Class}</td>
                  <td className={rowStyle}>{row.Subclass}</td>
                  <td className={rowStyle}>{row.Mounting}</td>
                  <td className={rowStyle}>{row.DataPortsCount}</td>
                  <td className={rowStyle}>{row.PowerPortsCount}</td>
                  <td className={rowStyle}>{row.FrontSlotsCount}</td>
                  <td className={rowStyle}>{row.BackSlotsCount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  function HeaderFunction(Header) {
    return (
      <div className="flex flex-col justify-center">
        <div className="flex flex-row items-center justify-between gap-3">
          <p>{Header}</p> <SortFinishedTable Type={Header} />
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

// const item = {
//   Make: "Raritan",
//   Model: "DPCS12-30L-J",
//   RUHeight: 29,
//   Height: "49.30",
//   Width: "2.20",
//   Depth: "3.00",
//   Class: "Rack PDU",
//   Subclass: "AC Power",
//   Mounting: "ZeroU",
//   DataPortsCount: 2,
//   PowerPortsCount: 21,
//   FrontSlotsCount: 0,
//   BackSlotsCount: 0,
//   Object: "RACK PDU-ZERO U",
//   index: 0,
// };
