import React from "react";
import {
  SiteSurveyQuestions,
  GlobalSurveyQuestions,
  RoomSurveyQuestions,
  SecuritySurveyQuestions,
  SafetySurveyQuestions,
} from "../Questions/StandardQuestions";
import { IoIosArrowDown } from "react-icons/io";
import { doc } from "firebase/firestore";

export default function SelectStandardQuestions() {
  // Combine all standard questions into a single object
  const [allQuestions, setAllQuestions] = React.useState({});
  React.useEffect(() => {
    const combinedQuestions = {
      ...SiteSurveyQuestions,
      ...GlobalSurveyQuestions,
      ...RoomSurveyQuestions,
      ...SecuritySurveyQuestions,
      ...SafetySurveyQuestions,
    };
    setAllQuestions(combinedQuestions);
  }, []);

  console.log(allQuestions);

  const QuestionsList = [
    SiteSurveyQuestions,
    GlobalSurveyQuestions,
    RoomSurveyQuestions,
    SecuritySurveyQuestions,
    SafetySurveyQuestions,
  ];
  const QuestionsHeaders = ["Site Survey", "Global Survey", "Room Survey", "Security Survey", "Safety Survey"];

  function handleShrink(sectionId, index) {
    const sections = document.querySelectorAll(".QuestionSection");
    const drop = document.getElementById(`${QuestionsHeaders[index]}Drop`);

    sections.forEach((section) => {
      if (section.id === sectionId) {
        const isCollapsed = section.style.maxHeight === "0px" || !section.style.maxHeight;

        section.style.transition = "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out";
        section.style.overflow = "hidden"; // Prevents content overflow

        if (isCollapsed) {
          section.style.maxHeight = section.scrollHeight + "px"; // Expand
          section.style.opacity = "1";
          drop.style.transform = "rotate(180deg)"; // Rotate dropdown
        } else {
          section.style.maxHeight = "0px"; // Collapse
          section.style.opacity = "0";
          drop.style.transform = "rotate(0deg)"; // Reset rotation
        }
      }
      //   else {
      //     section.style.maxHeight = "0px"; // Hide other sections
      //     section.style.opacity = "0";
      //   }
    });
  }
  return (
    <div className="flex flex-col gap-4 p-4 h-[40rem]">
      <p className="text-sm text-gray-600">Select a section to expand and select questions.</p>

      {QuestionsHeaders.map((header, index) => (
        <div key={index}>
          <h3 className="text-lg font-semibold">{header}</h3>
          {QuestionsListing(index)}
        </div>
      ))}

      {Object.keys(allQuestions).length === 0 && <p>No questions available.</p>}
    </div>
  );

  function QuestionsListing(index) {
    return (
      <div className=" w-full">
        <div className="w-full border-gray-200 border-2 rounded-md shadow-md overflow-hidden">
          <div className="flex flex-row justify-between items-center gap-4 p-2 bg-gray-200">
            <div className="flex flex-row gap-1 text-xs">
              <p>Selected: {Object.keys(QuestionsList[index]).filter((key) => allQuestions.hasOwnProperty(key)).length}</p>
              <p>of</p>
              <p>{Object.keys(QuestionsList[index]).length}</p>
            </div>

            <button
              id={`${QuestionsHeaders[index]}Drop`}
              onClick={() => handleShrink(`${QuestionsHeaders[index]}Questions`, index)}
              className="transition-all flex items-center gap-2"
            >
              <IoIosArrowDown className="text-gray-600 text-xl" />
            </button>
          </div>
          <div
            className="QuestionSection grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 transition-all overflow-hidden opacity-0 max-h-0 p-2 w-full"
            id={`${QuestionsHeaders[index]}Questions`}
          >
            <button className="ButtonMain" onClick={() => setAllQuestions({ ...QuestionsList[index] })}>
              Select All
            </button>
            <button
              className="ButtonMain"
              onClick={() => {
                setAllQuestions((prev) => {
                  // Create a copy of the current allQuestions state
                  const updatedQuestions = { ...prev };

                  // Loop through QuestionsList[index] and remove those that exist in allQuestions
                  Object.keys(QuestionsList[index]).forEach((key) => {
                    if (updatedQuestions.hasOwnProperty(key)) {
                      delete updatedQuestions[key]; // Remove the question
                    }
                  });

                  return updatedQuestions;
                });
              }}
            >
              Deselect All
            </button>
            {Object.keys(QuestionsList[index]).map((item) => {
              const question = QuestionsList[index][item];
              return (
                <div
                  key={item}
                  className={"border p-2 rounded-md" + (allQuestions.hasOwnProperty(item) ? " bg-[#eea24a]" : "")}
                  onClick={() => {
                    if (!allQuestions.hasOwnProperty(item)) {
                      setAllQuestions((prev) => ({ ...prev, [item]: question }));
                    } else {
                      const { [item]: _, ...remainingQuestions } = allQuestions;
                      setAllQuestions(remainingQuestions);
                    }
                  }}
                >
                  <p className="text-sm">{question.Name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
