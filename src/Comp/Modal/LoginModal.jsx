import React from "react";
import "./Modal.css";
import { RoutingStore } from "../../../Store/Store";
import VarifyEmail from "../Login/LoginModals/VarifyEmail";
import AccountVarified from "../Login/AccountVarified";

export default function LoginModal() {
  const LoginModal = RoutingStore((state) => state.data.LoginModal);
  const setLoginModal = RoutingStore((state) => state.setLoginModal);

  const pages = [<VarifyEmail />, <AccountVarified />];
  const Header = ["Varify Your Email", "Varify Account Information"];

  return (
    <div id="LoginModal" className="MainModalClass">
      <div className="ModalContent flex flex-col px-8">
        <div className="flex flex-row justify-between items-start gap-8">
          <h1 className="text-[2rem] font-bold">{Header[LoginModal]}</h1>
          <span
            className="close"
            onClick={() => {
              setLoginModal(-1);
            }}
          >
            &times;
          </span>
        </div>
        <div className="flex flex-row justify-center overflow-auto">{pages[LoginModal]}</div>
      </div>
    </div>
  );
}
