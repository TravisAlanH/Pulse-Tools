import React from "react";
import LocationList from "./Audit/LocationPage/LocationList";
import AuditPanels from "./Audit/AuditPanels";
import { RoutingStore } from "../../../Store/Store";
import AuditModal from "../Modal/AuditModal";
import Cabinet from "./Audit/FillLocation/Cabinet";
import AuditActions from "./AuditActions";

export default function AuditHome() {
  const AuditPage = RoutingStore((state) => state.data.AuditPage);
  const AuditModalValue = RoutingStore((state) => state.data.AuditModal);
  const setAuditModal = RoutingStore((state) => state.setAuditModal);
  const setAuditPage = RoutingStore((state) => state.setAuditPage);
  const Pages = [<LocationList />, <Cabinet />, <AuditActions />, <AuditPanels />];

  const [ModalShow, setModalShow] = React.useState(false);

  React.useEffect(() => {
    if (AuditModalValue !== -1) {
      setModalShow(true);
    } else {
      setModalShow(false);
    }
    // console.log(AuditModalValue);
    // console.log(ModalShow);
  }, [AuditModalValue]);

  return (
    <div class="flex-grow flex flex-col justify-start items-center mb-2">
      <button onClick={() => setAuditModal(0)}>Open Modal</button>
      <button onClick={() => setAuditPage(0)}>Location</button>
      <div className="h-full w-full">{Pages[AuditPage]}</div>
      <div>{ModalShow ? <AuditModal /> : null}</div>
    </div>
  );
}
