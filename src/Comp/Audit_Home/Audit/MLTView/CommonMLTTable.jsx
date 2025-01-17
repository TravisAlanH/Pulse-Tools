import React from "react";
import { MLTStore } from "../../../../../Store/Store";
import { CurrentLocation } from "../../../../../Store/Store";
import SortFinishedTable from "./SortFinishedTable";
import { AllLocationsStore } from "../../../../../Store/Store";
import { auth, db } from "../../../../../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CommonMLTTable({ SpliceEnd }) {
  const [checkedIndex, setCheckedIndex] = React.useState(null);
  // const rows = AllLocationsStore((state) => state.data.CommonMLTItems);
  const MLTFilterAndSort = MLTStore((state) => state.data);
  const [clicked, setClicked] = React.useState(null);
  const setSearchInput = MLTStore((state) => state.setSearchInput);
  const Filters = MLTStore((state) => state.data.filters);
  const SearchInput = MLTStore((state) => state.data.searchInput);
  const Active = CurrentLocation((state) => state.data.Active);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);

  const headerStyle = "border-2 px-2 h-[2.5rem] bg-gray-300 text-nowrap";
  const rowStyle = "border-2 px-2 w-[12rem] h-[2rem] text-nowrap overflow-clip";
  const checkboxStyle = "border-2 px-2 h-[1.5rem] w-[1.5rem] ActiveItemCheckbox";

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "Users", auth.currentUser.uid, "LibraryData", "CommonUsed");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        console.log("Document data:", docSnap.data());
        setRows(docSnap.data()[`CommonMLTItems`]);
      } else {
        setRows([]);
      }
    }
    fetchData();
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

  return (
    <div className=" flex flex-col flex-1 h-full">
      <div className="flex-1 overflow-scroll">
        <table>
          <thead>
            <tr>
              <th className={headerStyle}>Select</th>
              {/* <th className={`${headerStyle}`}>{HeaderFunction("Used")}</th> */}
              <th className={`${headerStyle}`}>{HeaderFunction("Object")}</th>
              <th className={headerStyle}>{HeaderFunction("Make")}</th>
              <th className={headerStyle}>{HeaderFunction("Model")}</th>
              <th className={headerStyle}>{HeaderFunction("RUHeight")}</th>
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
              .slice(0, SpliceEnd)
              .map((row, index) => (
                <tr key={index} className={`text-sm border-2 px-2 h-full ${clicked === row.index ? "bg-gray-300" : ""}`} onClick={() => setClicked(row.index)}>
                  <td className="flex flex-row justify-center items-center h-[3rem]">
                    <input
                      key={index}
                      id={"CheckBox" + index}
                      type="checkbox"
                      className={`${checkboxStyle}`}
                      checked={checkedIndex === row.index}
                      onChange={() => {
                        if (checkedIndex === row.index) {
                          setCheckedIndex(null);
                          setHoldMLTItem({});
                        } else {
                          setCheckedIndex(row.index);
                          setHoldMLTItem(row);
                          console.log("row", row);
                        }
                      }}
                    />
                  </td>
                  {/* <td className={`${rowStyle}`}>{row.Used}</td> */}
                  <td className={`${rowStyle}`}>{row.Object}</td>
                  <td className={rowStyle}>{row.Make}</td>
                  <td className={rowStyle}>{row.Model}</td>
                  <td className={rowStyle}>{row.RUHeight}</td>
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
