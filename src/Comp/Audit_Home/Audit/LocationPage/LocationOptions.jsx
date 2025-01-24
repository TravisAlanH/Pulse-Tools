import React from "react";

export default function LocationOptions() {
  return (
    <div className="flex flex-col gap-1 justify-center items-center w-full h-full">
      <div className="flex flex-row justify-center items-center w-full h-full">
        <label className="LableMain w-[10rem]">Location Data</label>
        <button className="ButtonMain w-[10rem]">Edit</button>
      </div>
      <div className="flex flex-row justify-center items-center w-full h-full">
        <label className="LableMain w-[10rem]">Delete Location</label>
        <button className="ButtonMain  w-[10rem]">Delete</button>
      </div>
    </div>
  );
}
