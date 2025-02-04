import React from "react";

export default function ScrollCheckInput({ text, rem, count }) {
  function calculateHiddenPercentage() {
    let totalLength = text.length;
    let visibleLength = text.length - (text.length - count);

    let hiddenPercentage = ((totalLength - visibleLength) / totalLength) * 100;

    return "-" + hiddenPercentage.toFixed(2) + "%";
  }

  if (text.length > count) {
    return (
      <>
        <style>
          {`
          @keyframes scroll {
            0% {
              transform: translateX(0%);
            }
            20% {
              transform: translateX(0%);
            }  
            100% {
              transform: translateX(${calculateHiddenPercentage()});
            }
          }

          .animate-scroll {
            display: inline-block;
            white-space: nowrap;
            animation: scroll 3s linear infinite;
          }
        `}
        </style>
        <div>
          <div className={`overflow-clip w-[${rem}rem]`}>
            <p className=" whitespace-nowrap animate-scroll">{text}</p>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <div className={`overflow-clip w-[${rem}rem]`}>
          <p className=" whitespace-nowrap">{text}</p>
        </div>
      </div>
    );
  }
}
