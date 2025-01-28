import React from "react";
import { CurrentLocation, RoutingStore } from "../../../../../Store/Store";
import { MLTStore } from "../../../../../Store/Store";
import SortFinishedTable from "../MLTView/SortFinishedTable";
import { FaCloudDownloadAlt, FaEllipsisH, FaSave } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../../Firebase/Firebase";
import { HoldLocationStore } from "../../../../../Store/Store";
import FiltersView from "../FiltersViewer/FiltersView";

export default function HomeTable({ LocationsList }) {
  // set LocationsList Location Area values to Numbers

  const [checkedIndex, setCheckedIndex] = React.useState(null);
  let rows = LocationsList;
  const MLTFilterAndSort = MLTStore((state) => state.data);
  const [clicked, setClicked] = React.useState(null);
  const setSearchInput = MLTStore((state) => state.setSearchInput);
  const Filters = MLTStore((state) => state.data.filters);
  const SearchInput = MLTStore((state) => state.data.searchInput);
  const Active = CurrentLocation((state) => state.data.Active);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const currentLocationData = CurrentLocation((state) => state.data);
  const setHoldMLTItem = MLTStore((state) => state.setHoldMLTItem);
  const ActiveLocation = CurrentLocation((state) => state.data.Location);
  const setLocation = CurrentLocation((state) => state.setLocation);
  const CurrentLocationData = CurrentLocation((state) => state.data);
  const replaceCurrentLocation = CurrentLocation((state) => state.replaceCurrentLocation);
  const setAuditPage = RoutingStore((state) => state.setAuditPage);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const HoldItemTrigger = CurrentLocation((state) => state.data.HoldItemTrigger);

  const headerStyle = "border-2 px-2 h-[2.5rem] bg-[#F2ECE6] text-nowrap font-normal text-sm";
  const rowStyle = "border-2 px-2 w-[8rem] h-[2rem] text-nowrap overflow-clip";
  const checkboxStyle = "border-2 px-2 h-[1.5rem] w-[1.5rem] ActiveItemCheckbox";
  const setHoldLocation = HoldLocationStore((state) => state.setHoldLocation);
  const HoldLocation = HoldLocationStore((state) => state.data);

  // const [trOrder, setTrOrder] = React.useState(["dcTrack Location Name*", "dcTrack Location Code*", "Data Center Area*", "dcTrack Location Parent"]);
  // const [thOrder, setThOrder] = React.useState(["Location Name", "Location Code", "Location Area", "Location Parent"]);
  const [trOrder, setTrOrder] = React.useState(["dcTrack Location Name*", "dcTrack Location Code*"]);
  const [thOrder, setThOrder] = React.useState(["Location Name", "Location Code"]);

  const OriginRowsCount = React.useRef(Object.keys(rows).length);

  React.useEffect(() => {
    console.log("Refresh Location List");
  }, [HoldItemTrigger]);

  React.useEffect(() => {
    if (LocationsList === undefined) {
      return;
    }
    Object.keys(rows).map((row) => {
      rows[row]["Data Center Area*"] = parseFloat(rows[row]["Data Center Area*"]);
    });
  }, [LocationsList]);

  const [filteredCount, setFilteredCount] = React.useState(Object.keys(rows).length);

  const filteredRows = Object.keys(rows)
    .filter((row) => {
      return Object.keys(SearchInput).every((key) => {
        if (SearchInput[key] === "") {
          return true;
        }
        return String(LocationsList[row][key]).toLowerCase().includes(String(SearchInput[key]).toLowerCase());
      });
    })
    .sort((a, b) => {
      const SortedBy = MLTFilterAndSort.sortType;
      const SortedOrder = MLTFilterAndSort.sortDirection;
      const aValue = LocationsList[a][SortedBy];
      const bValue = LocationsList[b][SortedBy];

      // Sorting based on different criteria
      if (SortedBy === "accuracyOne") {
        return SortedOrder === 1 ? parseFloat(bValue) - parseFloat(aValue) : parseFloat(aValue) - parseFloat(bValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return SortedOrder === 1 ? bValue - aValue : aValue - bValue;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return SortedOrder === 1 ? bValue.localeCompare(String(aValue)) : aValue.localeCompare(String(bValue));
      }
      return 0;
    });

  React.useEffect(() => {
    setFilteredCount(filteredRows.length);
  }, [SearchInput, MLTFilterAndSort, LocationsList, rows]);

  async function handleDownload(uuid) {
    // console.log("hold", HoldLocation);
    // console.log("current", CurrentLocationData);
    // console.log(HoldLocation != CurrentLocationData);
    // ! FIX THIS
    if (HoldLocation == CurrentLocationData) {
      alert("Save your Data first");
      return;
    }
    const docRef = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      replaceCurrentLocation(docSnap.data()[uuid]);
      setHoldLocation(docSnap.data()[uuid]);
      // setAuditPage(1);
    } else {
      console.log("No such document!");
    }
  }

  async function handleSaveData(uuid) {
    const document = doc(db, "Users", auth.currentUser.uid, "LocationData", "LocationsFullData");
    await updateDoc(document, {
      [`${uuid}`]: CurrentLocationData,
    });
  }

  const ActionButtonStyle = "h-[1.5rem] w-[1.5rem]";

  // Table Header Background: #F2ECE6
  // Main Orange: #F18A20
  // Count Color: #00B188

  return (
    <div className="overflow-y-scroll flex flex-col justify-start items-center h-full">
      <div className="flex flex-col items-center h-auto">
        <div className="flex flex-row justify-start w-full">{/* <FiltersView ShownCount={filteredCount} OriginRowsCount={OriginRowsCount.current} /> */}</div>
        <table>
          <thead>
            <tr>
              {/* <th className={headerStyle}>Select</th> */}
              {thOrder.map((header, index) => {
                return (
                  <th key={index} className={headerStyle}>
                    {HeaderFunction(header, thOrder, setThOrder, trOrder, setTrOrder, index)}
                  </th>
                );
              })}
              <th className={headerStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => {
              return (
                <tr key={index} className={`text-sm border-2 px-2 h-full ${clicked === row ? "bg-gray-300" : ""}`} onClick={() => setClicked(row)}>
                  {trOrder.map((header, index) => {
                    return (
                      <td key={index} className={rowStyle}>
                        {LocationsList[row][header]}
                      </td>
                    );
                  })}
                  <td>
                    <div className="flex flex-row justify-center">
                      {row !== ActiveLocation ? (
                        <button onClick={() => handleDownload(row)}>
                          <FaCloudDownloadAlt className={ActionButtonStyle} />
                        </button>
                      ) : (
                        <div className="flex flex-row justify-evenly w-full">
                          <button onClick={() => handleSaveData(row)}>
                            <FaSave className={ActionButtonStyle} />
                          </button>
                          <button onClick={() => setAuditModal(2)}>
                            <FaEllipsisH className={ActionButtonStyle} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
          className="border-2 px-2 h-[2rem] w-full shadow-sm"
          placeholder="Search..."
          onChange={(e) => {
            const convertLocationType = {
              "Location Name": "dcTrack Location Name*",
              "Location Code": "dcTrack Location Code*",
              "Location Area": "Data Center Area*",
              "Location Parent": "dcTrack Location Parent",
            };
            const payload = {
              type: convertLocationType[Header],
              value: e.target.value,
            };
            setSearchInput(payload);
          }}
        />
      </div>
    );
  }
}
