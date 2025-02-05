import React from "react";
import { CurrentLocation, RoutingStore } from "../../../../../../Store/Store";

export default function DeleteModal() {
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const Active = CurrentLocation((state) => state.data.Active);
  const AllItems = CurrentLocation((state) => state.data.AllItems);
  const removeItemByUUID = CurrentLocation((state) => state.removeItemByUUID);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  const [input, setInput] = React.useState("");

  const DelItem = AllItems[Active];

  function handleDelete(e) {
    e.preventDefault();
    setAuditModal(-1);
    const payload = {
      UUID: Active,
      Item: AllItems[Active],
      AllItems: AllItems,
    };
    removeItemByUUID(payload);
    setHoldItemTrigger();
  }

  //   78310c20

  return (
    <div className="flex flex-col gap-3 w-full p-4">
      <div className="w-full flex flex-row justify-center items-center gap-3">
        <p className="text-xl font-bold">Delete {DelItem["Name *"]}?</p>
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm">You are about to Delete {DelItem["Name *"]}</p>
          <p className="text-sm">Please Type the Name of this Device Below to confirm</p>
        </div>
        <form onSubmit={(e) => handleDelete(e)} className="flex flex-col gap-3">
          <div className="flex flex-row w-full">
            <label className="LableMain w-full" htmlFor="Name">
              Confirm
            </label>
            <input className="LableInputMain" type="text" placeholder={DelItem["Name *"]} onChange={(e) => setInput(e.target.value)} />
          </div>

          <div className="flex flex-row justify-end">
            <input disabled={input !== DelItem["Name *"]} className={`${input === DelItem["Name *"] ? "ButtonMainRed" : "ButtonMainDisabled"}`} type="submit" value="Delete" />
          </div>
        </form>
        <div className="flex flex-row justify-center items-center gap-3">
          <p className="text-xs text-center">*** All children of {DelItem["Name *"]} will also be deleted. ie: deleteing a Cabinet will delete all Assets it contains. *** </p>
        </div>
      </div>
    </div>
  );
}
