import React from "react";
import CreateAccountMenu from "./CreateAccountMenu";
import LoginMenu from "./LoginMenu";
import "./Login.css";
import { RoutingStore } from "../../../Store/Store";
import LoginModal from "../Modal/LoginModal";

export default function LoginPage() {
  const LoginPage = RoutingStore((state) => state.data.Login);
  const LoginModalValue = RoutingStore((state) => state.data.LoginModal);

  const [ModalShow, setModalShow] = React.useState(false);

  React.useEffect(() => {
    if (LoginModalValue !== -1) {
      setModalShow(true);
    } else {
      setModalShow(false);
    }
    console.log(LoginModalValue);
    console.log(ModalShow);
  }, [LoginModalValue]);

  console.log(LoginPage);
  const pages = [<LoginMenu />, <CreateAccountMenu />];

  return (
    <div className="h-full">
      {pages[LoginPage]}
      {ModalShow ? (
        <div className="">
          <LoginModal />
        </div>
      ) : null}
    </div>
  );
}
