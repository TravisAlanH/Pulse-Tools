import React from "react";
import Logo from "../../assets/logo-dark-no-tag.svg";
import HomeLogo from "../../assets/logo.png";
import { RoutingStore } from "../../../Store/Store";
import { UserStore } from "../../../Store/Store";
import { auth } from "../../../Firebase/Firebase";
// import { ModelCompareStore } from "../../../../Store/Store";
// import { FaHome } from "react-icons/fa";

export default function Header() {
  const setLoginPage = RoutingStore((state) => state.setLoginPage);
  const userStatus = UserStore((state) => state.data.Status);
  const CurrentPage = RoutingStore((state) => state.data.CurrentPage);
  const setCurrentPage = RoutingStore((state) => state.setCurrentPage);
  const [scrolled, setScrolled] = React.useState(true);

  window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
      setScrolled(true);
    }
    if (window.scrollY > 0 && scrolled) {
      setScrolled(false);
    }
  });

  const transformTransition = {
    transition: "background-color 0.2s ease-in-out",
  };

  // const fileName = ModelCompareStore((state) => state.data.FileName);
  return (
    <div className="h-[3.5rem]">
      <div
        style={transformTransition}
        className={`w-full h-full flex flex-row items-center justify-start px-8 
    ${userStatus === "Active" && auth.currentUser.emailVerified && CurrentPage === 0 && scrolled ? "bg-[#00000067]" : "bg-[#ffffff] shadow-md shadow-[#6d6d6d56] sticky top-0"}
    transition-colors duration-200`}
      >
        {userStatus === "Active" && auth.currentUser.emailVerified && CurrentPage === 0 && scrolled ? <img src={HomeLogo} className=" w-[6.5rem] hover:cursor-pointer" /> : <img src={Logo} className=" w-[6.5rem]  hover:cursor-pointer" />}
        {/* {fileName == "" ? <p className="text-white">Select a File</p> : <p className="text-white">{fileName}</p>} */}
        <div className={`w-full ${userStatus === "Active" && auth.currentUser.emailVerified && CurrentPage === 0 && scrolled ? `text-white` : null}`}>
          <ul className={`flex flex-row gap-5 justify-end items-center w-full text-sm  ${userStatus === "Active" && auth.currentUser.emailVerified && CurrentPage === 0 && scrolled ? `drop-shadow-[0_.1rem_.1rem_rgba(0,0,0,1)]` : null}`}>
            <li>
              <span>
                <button
                  onClick={() => {
                    userStatus === "Active" && auth.currentUser.emailVerified ? setCurrentPage(0) : setLoginPage(0);
                  }}
                >
                  Home
                </button>
              </span>
            </li>
            {/* <li>
              <span>
                <a onClick={() => {}}>Sunbird</a>
              </span>
            </li> */}
            <li>
              <span>
                <a onClick={() => {}}>Support</a>
              </span>
            </li>
            {userStatus === "Active" && auth.currentUser.emailVerified ? null : (
              <li>
                <span>
                  <button onClick={() => setLoginPage(0)}>Login</button>
                </span>
              </li>
            )}
          </ul>
          {/* <FaHome className="text-white hover:cursor-pointer text-2xl" onClick={() => setViewPage(0)} /> */}
        </div>
        {/* {userStatus === "Active" && auth.currentUser.emailVerified && CurrentPage === 0 && scrolled ? <img src={HomeLogo} className=" w-[6.5rem]  opacity-0" /> : <img src={Logo} className=" w-[6.5rem]  opacity-0" />} */}
      </div>
    </div>
  );
}
