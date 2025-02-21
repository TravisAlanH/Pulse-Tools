import React, { useState } from "react";
import { CurrentLocation } from "../../../../../../Store/Store";
import { RoutingStore } from "../../../../../../Store/Store";
import CabFront from "./CabFront";
import CabBack from "./CabBack";
import CabPDU from "./CabPDU";

export default function CabView() {
  const Cabinet = CurrentLocation((state) => state.data.Cabinet);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);

  const [view, setView] = React.useState(1);

  // Keep track of the rotation degrees in React state

  // Function to update degrees when the button is clicked

  if (Cabinet === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center mt-[50%]">
        <p>No Cabinet Built</p>
        <div className="flex flex-col gap-2 p-3 rounded-lg items-center bg-[#cacaca]">
          <p>Add a Cabinet Above</p>
          <p>or</p>
          <button className="ButtonMain" onClick={() => setAuditModal(8)}>
            Import All Location Assets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-row justify-between gap-3 mt-2 mb-2">
        <button
          className={view === 1 ? "ButtonMainNonWhite" : "ButtonMain"}
          onClick={() => {
            setView(1);
          }}
        >
          Front
        </button>

        <button
          className={view === 2 ? "ButtonMainNonWhite" : "ButtonMain"}
          onClick={() => {
            setView(2);
          }}
        >
          Back
        </button>

        <button
          className={view === 3 ? "ButtonMainNonWhite" : "ButtonMain"}
          onClick={() => {
            setView(3);
          }}
        >
          PDU
        </button>
      </div>
      {/* Apply the dynamic transform style */}
      <div className="w-full h-full">{view === 1 ? <CabFront /> : view === 2 ? <CabBack /> : <CabPDU />}</div>
    </div>
  );
}
