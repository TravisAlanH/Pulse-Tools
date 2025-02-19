import "./App.css";
import { UserStore } from "../Store/Store";
import React from "react";

import PendingAccounts from "./Comp/AdminUser/PendingAccounts";
import AccountVarified from "./Comp/Login/AccountVarified";
import { getMLT } from "../dcT_Objects/MLT/getMLT";
import AuditPanels from "./Comp/Audit_Home/Audit/AuditPanels";
import LocationList from "./Comp/Audit_Home/Audit/LocationPage/LocationList";
import Header from "./Comp/Header/Header";
import { auth } from "../Firebase/Firebase";
import LoginPage from "./Comp/Login/LoginPage";
import Footer from "./Comp/Footer/Footer";
import HomePage from "./HomePage";
import Background from "../src/assets/DCBackground.jpeg";
import { RoutingStore } from "../Store/Store";
import AuditHome from "./Comp/Audit_Home/AuditHome";
import Spinner from "./Comp/LoadingSpinner/Spinner";
// import MainModal from "./Comp/Modal/MainModal";

function App() {
  const [isLoadingShow, setIsLoadingShow] = React.useState(false);
  const CurrentPageView = RoutingStore((state) => state.data.CurrentPage);
  const Loading = RoutingStore((state) => state.data.Loading);
  const userStatus = UserStore((state) => state.data.Status);
  // ! THIS WILL BE CHANGES TO THE ROUTEING IN THE STORE

  console.log(Loading, "Loading");

  const CurrentPage = [
    <HomePage />,
    <AuditHome />,

    // <ModelCompareHome setViewPage={setViewPage} />,
    // <SheetCompareHome setViewPage={setViewPage} />,
    // <DuplicateSearchHome setViewPage={setViewPage} />,
    // <PythonInputHome setViewPage={setViewPage} />,
  ];

  const backgroundStyle = {
    backgroundImage: `url(${Background})`,
    backgroundSize: "100% 23.5rem",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top",
  };

  return (
    <div className="h-screen flex flex-col" style={userStatus === "Active" && auth.currentUser.emailVerified && CurrentPageView === 0 ? backgroundStyle : null}>
      <Header />
      {/* <button
        onClick={() => {
          let MLT = [];
          getMLT().then((res) => {
            MLT = res;
            console.log(MLT);
          });
        }}
        className="bg-blue-300"
      >
        MLT Log
      </button> */}
      <div class="flex-grow flex flex-col">{userStatus === "Active" && auth.currentUser.emailVerified ? CurrentPage[CurrentPageView] : <LoginPage />}</div>

      <Footer />
      {Loading ? <Spinner /> : null}
    </div>
  );
}

export default App;
