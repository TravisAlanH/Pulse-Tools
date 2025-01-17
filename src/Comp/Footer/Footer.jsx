import React from "react";

export default function Footer() {
  return (
    <div className="w-screen h-[1.5rem]">
      <div className="flex flex-row justify-end items-center bg-white text-xs gap-2 pr-5 ">
        {/* <div className="w-screen h-[1.5rem] fixed bottom-0 z-50 flex flex-row justify-end items-center bg-white text-xs gap-2 pr-5 "> */}

        <p>{"Project Tools v2.0.1"}</p>
        <a href="https://www.sunbirddcim.com/" target="_blank" rel="noreferrer" className="text-[#f59439]">
          {"SunbirdDCIM"}
        </a>
      </div>
    </div>
  );
}
