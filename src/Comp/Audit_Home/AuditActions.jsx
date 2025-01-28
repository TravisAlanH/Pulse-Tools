import React from "react";
import { RoutingStore } from "../../../Store/Store";

export default function AuditActions() {
  const setAuditPage = RoutingStore((state) => state.setAuditPage);
  const Pages = {
    "Rack Elevations": {
      page: 1,
      title: "Rack Elevations",
      discription: "Create Rack Elevations for Current Location, Front / Back / Zero U PDU",
      //   icon: <BsHddRackFill className="text-[3.5rem] text-[#4B4F54]" />,
      icon: "",
      index: 0,
    },
  };

  function setAuditActionPage(page) {
    setAuditPage(page);
  }

  return (
    <div id="HomePage h-full">
      {/* <div className="w-[full] h-[3.5rem] bg-[#000000dc] flex flex-row items-center justify-between px-4">
        <img src={Logo} className="h-[2.8rem]" />
      </div> */}
      <div className="flex flex-col items-center pt-10">
        <div className="flex flex-col gap-[5rem] items-center w-full md:w-[53rem] lg:w-[53rem] rounded-lg" id="HomePageToolCards">
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-[70rem] lg:w-[70rem]">
            {Object.keys(Pages).map((pageKey, index) => {
              const page = Pages[pageKey];
              return (
                <div key={index} className="mx-3 rounded-lg w-[17.313rem] h-[12.3rem] shadow-custom transform hover:scale-105 transition-transform duration-200 hover:cursor-pointer bg-white" onClick={() => setAuditActionPage(page.page)}>
                  <div className="w-full h-full flex flex-col justify-center items-center gap-6 ">
                    {page.icon}
                    <p className="text-[#863594] text-[1.5rem] font-bold">{page.title}</p>
                    <p className="text-[.8rem] text-justify px-6">{page.discription}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
