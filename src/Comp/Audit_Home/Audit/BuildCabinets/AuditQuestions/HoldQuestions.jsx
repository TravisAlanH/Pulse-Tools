import React from "react";
import { CurrentLocation } from "../../../../../../Store/Store";
import { Questions } from "../../../../../../dcT_Objects/ObjectQuestions";
import { MLTStore } from "../../../../../../Store/Store";
import { RoutingStore } from "../../../../../../Store/Store";
import { ReserseHeaderConversions } from "../../../../../../dcT_Objects/Data/HeaderConversions";
import { HeaderConversions } from "../../../../../../dcT_Objects/Data/HeaderConversions";
import { AllLocationsStore } from "../../../../../../Store/Store";
import { UniqueOrder } from "../../../../../../dcT_Objects/ObjectsArrays";
import { ObjectListing } from "../../../../../../dcT_Objects/ObjectsArrays";
import QRScanner from "../Modal/QRScanner";

export default function HoldQuestions() {
  const holdItem = CurrentLocation((state) => state.data.HoldItem);
  const setHoldItem = CurrentLocation((state) => state.setHoldItem);
  const holdMLTItem = MLTStore((state) => state.data.holdMLTItem);
  const ActiveUUID = CurrentLocation((state) => state.data.Active);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const holdItemTrigger = CurrentLocation((state) => state.data.HoldItemTrigger);
  const addToItems = CurrentLocation((state) => state.addToItems);
  const editItemByUUID = CurrentLocation((state) => state.editItemByUUID);
  const addCommonMLTItem = AllLocationsStore((state) => state.addCommonMLTItem);
  const [OrderedHoldItem, setOrderedHoldItem] = React.useState(UniqueOrder.filter((key) => holdItem.hasOwnProperty(key)));
  const [holdUserInputs, setHoldUserInputs] = React.useState({});
  const [hideNonRequired, setHideNonRequired] = React.useState(true);
  const [QRModal, setQRModal] = React.useState(false);
  const Location = React.useRef();
  const setActiveItems = CurrentLocation((state) => state.setActive);
  const PriorMLTHoldItem = React.useRef({});
  const setCheckedIndex = MLTStore((state) => state.setCheckedIndex);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setOpenUP = MLTStore((state) => state.setOpenUP);
  const OpenUP = MLTStore((state) => state.data.OpenUP);

  React.useEffect(() => {
    if (AllItems.hasOwnProperty(ActiveUUID)) {
      setHoldItem({ ...AllItems[ActiveUUID] });
    }
  }, [ActiveUUID]);

  React.useEffect(() => {
    let LocationCode = "";
    Object.keys(AllItems).map((item) => {
      if (AllItems[item]["Object *"] === "Location" || AllItems[item]["Object *"] === "LOCATION") {
        LocationCode = AllItems[item]["dcTrack Location Code*"];
      }
      Location.current = LocationCode;
    });
  }, [AllItems]);

  React.useEffect(() => {
    let holdItemCopy = { ...holdItem };
    if (PriorMLTHoldItem.current !== holdMLTItem && Object.keys(holdMLTItem).length !== 0 && Object.keys(PriorMLTHoldItem.current).length !== 0) {
      const convertingHoldItem = holdItemCopy;
      const holdItemObject = ObjectListing[holdMLTItem["Object"]];
      Object.keys(convertingHoldItem).forEach((key) => {
        if (holdItemObject.hasOwnProperty(key)) {
          holdItemObject[key] = convertingHoldItem[key];
        }
      });
      holdItemCopy = holdItemObject;
    }

    // if no mlt item then reset
    if (Object.keys(holdMLTItem).length === 0) {
      const reset = ["Make", "Model", "RUHeight", "Height", "Width", "Depth", "Class", "Subclass", "Mounting", "DataPortsCount", "PowerPortsCount", "FrontSlotsCount", "BackSlotsCount", "index"];
      reset.forEach((key) => {
        if (holdItemCopy.hasOwnProperty(ReserseHeaderConversions[key])) {
          holdItemCopy[ReserseHeaderConversions[key]] = "";
        }
      });
    } else {
      // if mlt item then update
      Object.keys(holdItemCopy).forEach((key) => {
        if (holdMLTItem.hasOwnProperty(HeaderConversions[key])) {
          holdItemCopy[key] = holdMLTItem[HeaderConversions[key]];
        }
      });
    }
    if (holdItemCopy.hasOwnProperty("Location *")) {
      holdItemCopy["Location *"] = Location.current;
    }
    setHoldItem(holdItemCopy);
    PriorMLTHoldItem.current = holdMLTItem;
  }, [holdMLTItem, holdItemTrigger]);

  React.useEffect(() => {
    let HoldOrderedHoldItem = [...OrderedHoldItem];
    HoldOrderedHoldItem = HoldOrderedHoldItem.filter((key) => holdItem.hasOwnProperty(key));
    setOrderedHoldItem(HoldOrderedHoldItem);
  }, [holdItem]);

  function handleSubmitAdd(e) {
    e.preventDefault();
    console.log(holdItem["RUHeight"]);
    if (OpenUP != -1 && holdItem["RUHeight"] > OpenUP) {
      setHoldItem({});
      setActiveItems(0);
      setOpenUP(-1);
      setCheckedIndex(-1);
      setAuditModal(-1);
      return alert("RU Height is Greater Than Available Rack Space");
    }
    const Payload = {
      type: holdItem["Object *"],
      value: holdItem,
    };
    addToItems(Payload);
    addCommonMLTItem(holdMLTItem);
    setHoldItem({});
    setActiveItems(0);
    setOpenUP(-1);
    setCheckedIndex(-1);
    setAuditModal(-1);
  }

  function handleSubmitEdit(e) {
    e.preventDefault();
    const Payload = {
      type: holdItem["Object *"],
      value: holdItem,
      UUID: ActiveUUID,
      AllItems: AllItems,
    };
    editItemByUUID(Payload);
    setAuditModal(-1);
  }

  if (Object.keys(holdItem).length === 0 || Object.keys(holdMLTItem) === undefined) {
    return <div></div>;
  }

  return (
    <div className="h-full w-[95%] flex flex-col items-center gap-4">
      <div className="h-[1.5rem] flex flex-col items-start w-full">
        {AllItems.hasOwnProperty(ActiveUUID) ? (
          <div className="flex flex-row gap-3">
            <p>Edit:</p> <p className="text-[#00B188]">{holdItem["Name *"]}</p>
          </div>
        ) : (
          <h1 className="text-2xl">Add {holdItem["Object *"].length < 16 ? holdItem["Object *"] : `${holdItem["Object *"].slice(0, 12)}...`}</h1>
        )}
      </div>
      <div className="flex flex-row justify-between h-[2rem] items-center mb-2 w-full">
        <span className="flex flex-row gap-3">
          <p>Showing: </p>
          <p className="text-[#00B188]">{hideNonRequired ? "Required Fields" : "All Fields"}</p>
        </span>
        <button className="ButtonMainNonWhite" onClick={() => setHideNonRequired(!hideNonRequired)}>
          {hideNonRequired ? "All" : "Required"}
        </button>
      </div>
      <form
        className="flex flex-col gap-2 h-full w-full"
        onSubmit={(e) => {
          if (AllItems.hasOwnProperty(ActiveUUID)) {
            handleSubmitEdit(e);
          } else {
            handleSubmitAdd(e);
          }
        }}
      >
        <div className="pb-6 flex flex-col gap-4">
          <div>test</div>
          {/* {Object.keys(holdItem) */}
          {UniqueOrder.filter((key) => holdItem.hasOwnProperty(key))
            .filter((key) => {
              if (hideNonRequired) {
                return Questions.Items[key].required;
              } else {
                return true;
              }
            })
            .map((key, index) => {
              return (
                <div key={index} className="flex flex-col">
                  <label className="LableMain w-[100%]">
                    {key.split("*").length - 1 === 1 ? (
                      <div className="flex flex-row gap-3">
                        <p className="text-red-500">*</p>
                        {key.replace("*", "")}
                      </div>
                    ) : (
                      key
                    )}
                  </label>
                  <div className="w-[100%]">
                    {Questions.Items[key].type === "text"
                      ? TextInput(key)
                      : Questions.Items[key].type === "number"
                      ? NumberInput(key)
                      : Questions.Items[key].type === "date"
                      ? DateInput(key)
                      : Questions.Items[key].type === "select"
                      ? SelectInput(key)
                      : Questions.Items[key].type === "QRScan"
                      ? QRScan(key)
                      : TextInput(key)}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="">{AllItems.hasOwnProperty(ActiveUUID) ? <input className="ButtonMain" type="submit" value="Save" /> : <input className="ButtonMain" type="submit" value="Submit" />}</div>
      </form>
    </div>
  );

  function QRScan(key) {
    return (
      <div className="flex flex-row gap-3">
        <input
          className="w-full LableInputMainBelow"
          type="text"
          value={holdItem[key]}
          id={key}
          required={Questions.Items[key].required}
          onChange={(e) => {
            const newValue = e.target.value;
            setHoldItem((prevState) => {
              return {
                ...prevState,
                [key]: newValue,
              };
            });
            if (!Questions.Items[key].required) {
              setHoldUserInputs((prevState) => {
                return {
                  ...prevState,
                  [key]: newValue,
                };
              });
            }
          }}
        />
        <div className="ButtonMain" onClick={() => setQRModal(true)}>
          Scan
        </div>
        <div>{QRModal ? <QRScanner setQRModal={setQRModal} setHoldItem={setHoldItem} setHoldUserInputs={setHoldUserInputs} NamedKey={key} /> : null}</div>
      </div>
    );
  }

  function SelectInput(key) {
    return (
      <select
        className="w-full LableInputMainBelow"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...holdItem };
          holdItemCopy[key] = newValue;
          setHoldItem(holdItemCopy);
          if (!Questions.Items[key].required) {
            setHoldUserInputs((prevState) => {
              return {
                ...prevState,
                [key]: newValue,
              };
            });
          }
        }}
      >
        {Questions.Items[key].options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  function DateInput(key) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="date"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          setHoldItem((prevState) => {
            return {
              ...prevState,
              [key]: newValue,
            };
          });
          if (!Questions.Items[key].required) {
            setHoldUserInputs((prevState) => {
              return {
                ...prevState,
                [key]: newValue,
              };
            });
          }
        }}
      />
    );
  }

  function NumberInput(key) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="number"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          setHoldItem((prevState) => {
            return {
              ...prevState,
              [key]: newValue,
            };
          });
          if (!Questions.Items[key].required) {
            setHoldUserInputs((prevState) => {
              return {
                ...prevState,
                [key]: newValue,
              };
            });
          }
        }}
      />
    );
  }

  function TextInput(key) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="text"
        value={holdItem[key]}
        id={key}
        required={Questions.Items[key].required}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...holdItem };
          holdItemCopy[key] = newValue;
          setHoldItem(holdItemCopy);
          if (!Questions.Items[key].required) {
            setHoldUserInputs((prevState) => {
              return {
                ...prevState,
                [key]: newValue,
              };
            });
          }
        }}
      />
    );
  }
}
