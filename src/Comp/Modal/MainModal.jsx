import React from "react";
import "./Modal.css";

export default function MainModal({ child }) {
  return (
    <div id="MainModal" className="MainModalClass">
      <div className="ModalContent flex flex-col">
        <div className="flex flex-row justify-end">
          <span
            className="close"
            onClick={() => {
              document.getElementById("MainModal").style.display = "none";
            }}
          >
            &times;
          </span>
        </div>
        <div className="flex flex-row justify-center pt-5 overflow-auto">{child}</div>
      </div>
    </div>
  );
}
