import React, { useState } from "react";
// import Logo from "./Assets/Logo.png";
// import { MdCompareArrows } from "react-icons/md";
// import { MdCompare } from "react-icons/md";
// import { AiOutlineColumnHeight, AiOutlinePython } from "react-icons/ai";
import { RoutingStore } from "../Store/Store";
import MagGlass from "./assets/magnifying-glass.png";
import { BsHddRackFill } from "react-icons/bs";
// 375,000

export default function HomePage() {
  const setViewPage = RoutingStore((state) => state.setCurrentPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [Pages, setPages] = useState({
    "Audit Tool": {
      page: 1,
      title: "Audit Tool",
      discription: "On site tool used for auditing and data collection at IDF MDF locations.",
      icon: <BsHddRackFill className="text-[3.5rem] text-[#4B4F54]" />,
      index: 0,
    },
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-orange-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const relevanceScore = (page) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const titleIncludes = page.title.toLowerCase().includes(lowerSearchTerm);
    const descriptionIncludes = page.discription.toLowerCase().includes(lowerSearchTerm);

    let score = 0;

    // Prioritize pages where the search term is in both title and description
    if (titleIncludes && descriptionIncludes) {
      score = 1;
    } else if (titleIncludes || descriptionIncludes) {
      score = 2;
    } else {
      score = 3;
    }

    // Further prioritize by the position where the search term first appears
    const titleIndex = page.title.toLowerCase().indexOf(lowerSearchTerm);
    const descriptionIndex = page.discription.toLowerCase().indexOf(lowerSearchTerm);

    if (titleIndex !== -1) {
      score -= 0.1 * titleIndex; // Earlier positions are better
    }

    if (descriptionIndex !== -1) {
      score -= 0.1 * descriptionIndex; // Earlier positions are better
    }

    return score;
  };

  const sortedPages = Object.keys(Pages).sort((a, b) => relevanceScore(Pages[a]) - relevanceScore(Pages[b]));

  const MagnifyingGlassSytle = {
    backgroundImage: `url(${MagGlass})`,
    backgroundSize: "5%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "2%",
    paddingLeft: "7%",
    filter: "grayscale(50%)",
  };

  return (
    <div id="HomePage h-full">
      {/* <div className="w-[full] h-[3.5rem] bg-[#000000dc] flex flex-row items-center justify-between px-4">
        <img src={Logo} className="h-[2.8rem]" />
      </div> */}
      <div className="flex flex-col items-center pt-10">
        <div className="flex flex-col gap-[5rem] items-center w-full md:w-[53rem] lg:w-[53rem] rounded-lg" id="HomePageToolCards">
          <div className="flex flex-col gap-6 items-center w-full">
            <p className="text-2xl text-white font-bold drop-shadow-[0_.2rem_.2rem_rgba(0,0,0,1)] font-serif">Find a project Tool</p>
            <div className="flex flex-row gap-6">
              <input type="text" className="w-[20rem] md:w-[35.6rem] h-[3.125rem] rounded-md px-4" style={MagnifyingGlassSytle} id="SearchAndFilterInput" placeholder="  Enter your search term here..." value={searchTerm} onChange={handleSearchChange} />
              {/* <button className="bg-orange-400 text-white font-bold py-2 px-9 rounded" onClick={() => highlightText}>
                Search
              </button> */}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-[70rem] lg:w-[70rem]">
            {sortedPages.map((pageKey, index) => {
              const page = Pages[pageKey];
              return (
                <div key={index} className="mx-3 rounded-lg w-[17.313rem] h-[16.3rem] shadow-custom transform hover:scale-105 transition-transform duration-200  hover:cursor-pointer bg-white" onClick={() => setViewPage(page.page)}>
                  <div className="w-full h-full flex flex-col justify-center items-center gap-6 ">
                    {page.icon}
                    <p className="text-[#863594] text-[1.5rem] font-bold">{highlightText(page.title, searchTerm)}</p>
                    <p className="text-[.8rem] text-justify px-6">{highlightText(page.discription, searchTerm)}</p>
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
