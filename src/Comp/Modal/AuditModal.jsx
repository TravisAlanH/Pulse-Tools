import React from "react";
import "./Modal.css";
import { RoutingStore } from "../../../Store/Store";
import AccountVarified from "../Login/AccountVarified";
import MLT from "../Audit_Home/Audit/Modal/MLT";

export default function LoginModal() {
  const Modal = RoutingStore((state) => state.data.AuditModal);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);

  const pages = [<MLT />];
  const Header = ["Varify Your Email", "Varify Account Information"];

  return (
    <div id="AuditModal" className="MainModalClass">
      <div className="ModalContent flex flex-col w-full h-full">
        <div className="flex flex-row justify-between items-start gap-8">
          <h1 className="text-[2rem] font-bold">{Header[LoginModal]}</h1>
          <span
            className="close"
            onClick={() => {
              setAuditModal(-1);
            }}
          >
            &times;
          </span>
        </div>
        <div className="flex flex-row overflow-auto">{pages[Modal]}</div>
      </div>
    </div>
  );
}
