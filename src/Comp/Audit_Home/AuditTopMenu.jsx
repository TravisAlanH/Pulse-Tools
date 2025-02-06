import React from "react";
import { RoutingStore } from "../../../Store/Store";
import { CurrentLocation } from "../../../Store/Store";

export default function AuditTopMenu() {
  const AllItems = RoutingStore((state) => state.data.AllItems);
  const Location = CurrentLocation((state) => state.data.Location);
  const setCurrentPage = RoutingStore((state) => state.setCurrentPage);
  const setAuditPage = RoutingStore((state) => state.setAuditPage);

  return (
    <div className="w-full flex flex-col justify-center items-center pt-3">
      <div className="flex flex-row justify-center items-between gap-6 w-full">
        <button className="ButtonMain" onClick={() => setCurrentPage(0)}>
          Tools
        </button>
        <button className="ButtonMain" onClick={() => setAuditPage(0)}>
          Locations
        </button>
      </div>
    </div>
  );
}
