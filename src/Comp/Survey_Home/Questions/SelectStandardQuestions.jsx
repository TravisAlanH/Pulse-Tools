import React from "react";
import {
  SiteSurveyQuestions,
  GlobalSurveyQuestions,
  RoomSurveyQuestions,
  SecuritySurveyQuestions,
  SafetySurveyQuestions,
} from "../Questions/StandardQuestions";
import { IoIosArrowDown } from "react-icons/io";
import { SurveyQuestionsStore } from "../Store/SurveyStore";
import { CurrentLocation, RoutingStore } from "../../../../Store/Store";
import { doc } from "firebase/firestore";
import { FaEdit } from "react-icons/fa";

export default function SelectStandardQuestions() {
  const CustomQuestions = SurveyQuestionsStore((state) => state.data.CustomQuestions);
  const setSurveyModal = RoutingStore((state) => state.setSurveyModal);
  const setEditQuestion = SurveyQuestionsStore((state) => state.setEditQuestion);
  const CustomStandardQuestions = SurveyQuestionsStore((state) => state.data.CustomStandardQuestions);
  const setBaseQuestions = SurveyQuestionsStore((state) => state.SetBaseQuestions);
  const BaseQuestions = SurveyQuestionsStore((state) => state.data.Questions);
  const setHoldItemTrigger = CurrentLocation((state) => state.setHoldItemTrigger);
  // Combine all standard questions into a single object
  const [allQuestions, setAllQuestions] = React.useState({});
  React.useEffect(() => {
    let combinedQuestions = BaseQuestions;
    if (BaseQuestions === undefined) {
      combinedQuestions = {
        ...SiteSurveyQuestions,
        ...GlobalSurveyQuestions,
        ...RoomSurveyQuestions,
        ...SecuritySurveyQuestions,
        ...SafetySurveyQuestions,
        ...CustomQuestions,
      };
    }

    setAllQuestions(combinedQuestions);
  }, [BaseQuestions]);

  console.log("all questions: SelectStandardQuestions", allQuestions);

  const QuestionsList = [
    SiteSurveyQuestions,
    GlobalSurveyQuestions,
    RoomSurveyQuestions,
    SecuritySurveyQuestions,
    SafetySurveyQuestions,
    CustomQuestions,
  ];
  const QuestionsHeaders = [
    "Site Survey",
    "Global Survey",
    "Room Survey",
    "Security Survey",
    "Safety Survey",
    "Custom Questions",
  ];

  function handleSave() {
    // setAllQuestions({
    //   ...SiteSurveyQuestions,
    //   ...GlobalSurveyQuestions,
    //   ...RoomSurveyQuestions,
    //   ...SecuritySurveyQuestions,
    //   ...SafetySurveyQuestions,
    //   ...CustomQuestions,
    //   ...CustomStandardQuestions,
    // });
    let holdAllquestions = allQuestions;
    if (CustomStandardQuestions !== undefined) {
      Object.keys(CustomStandardQuestions).map((key) => {
        holdAllquestions[key] = CustomStandardQuestions[key];
      });
    }
    setBaseQuestions(holdAllquestions);
    setHoldItemTrigger();
    setSurveyModal(-1);
  }

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
      <div className="flex flex-row justify-end gap-3">
        <button
          className="OrangeButton"
          onClick={() => {
            setAllQuestions({});
          }}
        >
          Deselect All
        </button>
      </div>
      <div className="">
        {QuestionsHeaders.map((header, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold">{header}</h3>
            {QuestionsListing(index)}
          </div>
        ))}
        <div className="flex flex-row gap-3">
          <button className="OrangeButton mt-4" onClick={handleSave}>
            Save Questions
          </button>
          {/* <button className="OrangeButton mt-4" disabled={true}>
            Import Questions
          </button> */}
        </div>
      </div>
    </div>
  );

  function QuestionsListing(index) {
    return (
      <div className=" w-full">
        <div className="w-full border-gray-200 border-2 rounded-md shadow-md overflow-hidden text-xs">
          <div className="flex flex-row justify-between items-center gap-4 p-2 bg-gray-200">
            {QuestionsList[index] !== undefined ? (
              <div className="flex flex-row gap-1 text-xs">
                <p>Selected: {Object.keys(QuestionsList[index]).filter((key) => allQuestions.hasOwnProperty(key)).length}</p>
                <p>of</p>
                <p>{Object.keys(QuestionsList[index]).length}</p>
              </div>
            ) : (
              <div></div>
            )}

            <button
              id={`${QuestionsHeaders[index]}Drop`}
              onClick={() => handleShrink(`${QuestionsHeaders[index]}Questions`, index)}
              className="transition-all flex items-center gap-2"
            >
              <IoIosArrowDown className="text-gray-600 text-xl" />
            </button>
          </div>
          <div
            className="QuestionSection transition-all overflow-hidden opacity-0 max-h-0 p-2 w-full"
            id={`${QuestionsHeaders[index]}Questions`}
          >
            {index === 5 ? (
              <button
                className="OrangeButton w-full mb-4"
                onClick={() => {
                  setSurveyModal(0); // Open the modal for creating a new question
                }}
              >
                Create New Question
              </button>
            ) : null}
            {QuestionsList[index] !== undefined ? (
              <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
                <button
                  className="ButtonMain"
                  onClick={() =>
                    setAllQuestions((prev) => ({
                      ...prev, // Keep existing selections
                      ...QuestionsList[index], // Add all questions from the current section
                    }))
                  }
                >
                  Select All
                </button>
                <button
                  className="ButtonMain"
                  onClick={() => {
                    setAllQuestions((prev) => {
                      const updatedQuestions = { ...prev };
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
                      className={
                        "border p-2 rounded-md flex flex-col items-start justify-start" +
                        (allQuestions.hasOwnProperty(item) ? " bg-[#eea24a]" : "") +
                        (CustomStandardQuestions !== undefined && CustomStandardQuestions.hasOwnProperty(item)
                          ? " border-blue-600 border-2"
                          : "")
                      }
                      onClick={() => {
                        if (!allQuestions.hasOwnProperty(item)) {
                          setAllQuestions((prev) => ({ ...prev, [item]: question }));
                        } else {
                          const { [item]: _, ...remainingQuestions } = allQuestions;
                          setAllQuestions(remainingQuestions);
                        }
                      }}
                    >
                      <p className="text-xs">
                        {CustomStandardQuestions !== undefined && CustomStandardQuestions.hasOwnProperty(item)
                          ? CustomStandardQuestions[item].Name
                          : question.Name}
                      </p>
                      <div className="flex flex-row justify-end w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditQuestion(item);
                            setSurveyModal(2);
                          }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
