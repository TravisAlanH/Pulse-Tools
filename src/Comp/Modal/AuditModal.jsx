import React from "react";
import "./Modal.css";
import { RoutingStore } from "../../../Store/Store";
import AccountVarified from "../Login/AccountVarified";
import MLT from "../Audit_Home/Audit/Modal/MLT";
import HoldQuestions from "../Audit_Home/Audit/BuildCabinets/AuditQuestions/HoldQuestions";
import LocationOptions from "../Audit_Home/Audit/LocationPage/LocationOptions";
import CreateLocationInputs from "../Audit_Home/Audit/LocationPage/CreateLocationInputs";
import DeleteModal from "../Audit_Home/Audit/BuildCabinets/Modal/DeleteModal";
import Above from "../Audit_Home/Audit/BuildCabinets/CabPreview/Above";
import Below from "../Audit_Home/Audit/BuildCabinets/CabPreview/Below";

export default function LoginModal() {
  const Modal = RoutingStore((state) => state.data.AuditModal);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);

  const pages = [<MLT />, <HoldQuestions />, <LocationOptions />, <CreateLocationInputs />, <DeleteModal />, <Above />, <Below />];
  const Header = ["Models List", "Fill in Headers", "Location Options", "Create Location", "Delete", "Above", "Below"];

  return (
    <div id="AuditModal" className="MainModalClass">
      <div className="ModalContent flex flex-col w-full py-4">
        <div className="flex flex-row justify-between items-center gap-8 px-4 ">
          <h1 className="text-[1rem] font-bold">{Header[Modal]}</h1>
          <span
            className="close"
            onClick={() => {
              setAuditModal(-1);
            }}
          >
            &times;
          </span>
        </div>
        <div className="flex flex-row overflow-auto h-full">{pages[Modal]}</div>
      </div>
    </div>
  );
}
