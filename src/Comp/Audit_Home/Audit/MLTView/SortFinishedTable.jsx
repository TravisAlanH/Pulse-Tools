import React from "react";
// import { SortedStore } from "../../../../Store/Store";
import { MLTStore } from "../../../../../Store/Store";

export default function SortFinishedTable({ Type, thOrder, setThOrder, trOrder, setTrOrder, index }) {
  const setSortDirection = MLTStore((state) => state.setSortDirection);
  const SortedOrder = MLTStore((state) => state.data.sortDirection);
  const setSortType = MLTStore((state) => state.setSortType);
  const SortType = MLTStore((state) => state.data.sortType);
  const UniqueHeaders = MLTStore((state) => state.data.uniqueHeaders);
  const SetFilters = MLTStore((state) => state.setFilters);
  const RemoveFilters = MLTStore((state) => state.removeFilters);
  const ResetAll = MLTStore((state) => state.resetSortsFiltersSearches);
  const Filters = MLTStore((state) => state.data.filters);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [highLight, setHighLight] = React.useState(false);
  const OriginalTrOrder = React.useRef(trOrder);
  const OriginalThOrder = React.useRef(thOrder);

  const handleSortClick = (SortOrder) => {
    if (Type.includes("Location")) {
      const convertLocationType = {
        "Location Name": "dcTrack Location Name*",
        "Location Code": "dcTrack Location Code*",
        "Location Area": "Data Center Area*",
        "Location Parent": "dcTrack Location Parent",
      };
      setSortType(convertLocationType[Type]);
    } else {
      setSortType(Type.replace(" ", ""));
    }
    setSortDirection(SortOrder);
    setIsDropdownOpen(false);
  };

  const handleTableOrder = (placement) => {
    let tempTr = [...trOrder];
    let tempTh = [...thOrder];
    if (placement === -1) {
      const indexTHValue = tempTh[index];
      tempTh.splice(index, 1);
      tempTh.unshift(indexTHValue);
      const indexTRValue = tempTr[index];
      tempTr.splice(index, 1);
      tempTr.unshift(indexTRValue);
      setThOrder(tempTh);
      setTrOrder(tempTr);
    } else if (placement === 1) {
      const indexValue = tempTh[index];
      tempTh.splice(index, 1);
      tempTh.push(indexValue);
      const indexTRValue = tempTr[index];
      tempTr.splice(index, 1);
      tempTr.push(indexTRValue);
      setThOrder(tempTh);
      setTrOrder(tempTr);
    }
  };

  const handleTableOrderReset = () => {
    setThOrder(OriginalThOrder.current);
    setTrOrder(OriginalTrOrder.current);
  };

  React.useEffect(() => {
    if (Filters.hasOwnProperty(Type)) {
      if (Filters[Type].length > 0) {
        setHighLight(true);
      } else {
        setHighLight(false);
      }
    }
    // if (Filters[Type].length > 0) {
    //   setHighLight(true);
    // } else {
    //   setHighLight(false);
    // }
  }, [SortType, Filters]);

  const SortItems = ["Sort Ascending", "Sort Descending", "Sort Clear", "Pin Left", "Pin Right"];

  return (
    <div className="relative inline-flex items-center text-left">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggles dropdown visibility
        className={`flex flex-row justify-between items-center w-[2.5rem] text-sm font-medium text-gray-400 bg-[#F2ECE6] rounded-md hover:bg-[#e7e2dc] ${
          // SortType === Type ? "outline-none ring-2 ring-offset-2 ring-orange-500" : "" // Adds ring effect if SortedBy is not empty
          highLight ? "outline-none ring-2 ring-offset-2 ring-orange-500" : "" // Adds ring effect if SortedBy is not empty
        }`}
      >
        {/*{SortName}  Displays the current sorting name */}
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Clear Sorting Button */}
      {/* <button
        className="w-[9rem] h-[3rem] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 ml-2" // Added ml-2 for margin
        onClick={() => {
          setSorted("", 0); // Clears the sorting
          setSortName(`Sort Table`);
          setIsDropdownOpen(false);
        }}
      >
        Clear Sorting
      </button> */}

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className={`absolute left-[-12rem] top-[3.5rem] mt-2 w-[15rem] bg-white border border-gray-300 rounded-md shadow-lg z-[10000] ${index === 0 ? "left-[-6rem]" : "left-[-12rem]"} `}>
          <ul className="flex flex-col">
            {/* Dropdown Items */}
            {SortItems.map((item, index) => (
              <li
                key={item}
                onClick={() => {
                  if (index === 0) handleSortClick(1);
                  if (index === 1) handleSortClick(-1);
                  if (index === 2) handleSortClick(0);
                  if (index === 3) handleTableOrder(-1);
                  if (index === 4) handleTableOrder(1);
                  // handleSortClick(item)}} // Handles option click
                  setIsDropdownOpen(false);
                }}
                className={`flex justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  "" // Type === item ? "bg-gray-200" : "" // Highlights selected item
                }`}
              >
                {item}
                {/* Displaying the sort direction indicator */}
                {/* {Type === SortType ? <span>{SortedOrder === 1 ? `▲` : SortedOrder === -1 ? `▬` : "▽"}</span> : <span>{`▽`}</span>} */}
              </li>
            ))}
            {UniqueHeaders.hasOwnProperty(Type) ? (
              <div className="border-t-2 border-gray-400">
                <p className="UniqueItems bg-gray-200 px-4 py-2 text-gray-700 text-sm">Unique Items</p>
              </div>
            ) : null}
          </ul>
          <div className="flex flex-col bg-gray-200">
            {UniqueHeaders.hasOwnProperty(Type) ? (
              <div className="flex flex-col items-center">
                <div className="w-[95%] h-[15rem] overflow-scroll border-2 bg-white">
                  {UniqueHeaders[Type].filter((item) => {
                    return item !== "";
                  })
                    .sort()
                    .map((header) => (
                      <div key={header} className={`flex flex-row gap-3 justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`}>
                        <input
                          type="checkbox"
                          checked={Filters[Type].includes(header)}
                          className="min-w-[1.5rem] h-[1.5rem]"
                          onChange={(e) => {
                            if (e.target.checked) {
                              const payload = {
                                type: Type,
                                value: header,
                              };
                              SetFilters(payload);
                            } else {
                              const payload = {
                                type: Type,
                                value: header,
                              };
                              RemoveFilters(payload);
                            }
                          }}
                        />
                        {header}
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
            <button
              className="w-[9rem] h-[3rem] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 ml-2" // Added ml-2 for margin
              onClick={() => {
                ResetAll();
                handleTableOrderReset();
                setIsDropdownOpen(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
