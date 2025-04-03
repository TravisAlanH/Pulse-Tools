import React from "react";
import { SurveyQuestionsStore } from "../Store/SurveyStore";
import { CurrentLocation } from "../../../../Store/Store";
import {
  SiteSurveyQuestions,
  GlobalSurveyQuestions,
  RoomSurveyQuestions,
  SecuritySurveyQuestions,
  SafetySurveyQuestions,
} from "../Questions/StandardQuestions";
import { IoIosArrowDown } from "react-icons/io";

export default function QuestionsInput() {
  const Question = SurveyQuestionsStore((state) => state.data.Questions);
  const EditQuestionValue = SurveyQuestionsStore((state) => state.EditQuestionValue);
  const CustomStandardQuestions = SurveyQuestionsStore((state) => state.data.CustomStandardQuestions);
  const CustomQuestions = SurveyQuestionsStore((state) => state.data.CustomQuestions);
  const HoldItemTrigger = CurrentLocation((state) => state.data.HoldItemTrigger);
  const [sortedQuestions, setSortedQuestions] = React.useState(Question);
  let splitQuestions = {};

  // !
  const SelectedQuestions = SurveyQuestionsStore((state) => state.data.SelectedQuestionsList);

  //!for Sorting Only
  const sortOrder = ["Site Survey", "Global Survey", "Room Survey", "Security Survey", "Safety Survey"];
  const questionTranslation = {
    "Site Survey": SiteSurveyQuestions,
    "Global Survey": GlobalSurveyQuestions,
    "Room Survey": RoomSurveyQuestions,
    "Security Survey": SecuritySurveyQuestions,
    "Safety Survey": SafetySurveyQuestions,
  };
  //!for Sorting Only

  const [site, setSite] = React.useState({});
  const [global, setGlobal] = React.useState({});
  const [room, setRoom] = React.useState({});
  const [security, setSecurity] = React.useState({});
  const [safety, setSafety] = React.useState({});
  const [custom, setCustom] = React.useState({});

  React.useEffect(() => {
    if (!Question || typeof Question !== "object") {
      console.error("Invalid Question data:", Question);
      return;
    }

    // Helper function to filter by group name
    const filterByGroup = (groupName) =>
      Object.fromEntries(Object.entries(Question).filter(([_, value]) => value.group === groupName));

    const filterCustomQuestions = () =>
      Object.fromEntries(
        Object.entries(Question).filter(([_, value]) => !value.group) // ✅ No group assigned
      );

    // Set state for each category
    setSite(filterByGroup("Site Survey"));
    setGlobal(filterByGroup("Global Survey"));
    setRoom(filterByGroup("Room Survey"));
    setSecurity(filterByGroup("Security Survey"));
    setSafety(filterByGroup("Safety Survey"));
    setCustom(filterCustomQuestions());
  }, [Question]); // Runs whenever `Question` changes

  const QuestionsArray = [
    { name: "Site Survey", data: site },
    { name: "Global Survey", data: global },
    { name: "Room Survey", data: room },
    { name: "Security Survey", data: security },
    { name: "Safety Survey", data: safety },
    { name: "Custom Questions", data: custom },
  ];

  console.log("QuestionsArray", QuestionsArray);
  console.log("Question", Question);

  function handleShrink(sectionId, dropID) {
    console.log(sectionId);
    const sections = document.querySelectorAll(".InputSection");
    const drop = document.getElementById(dropID);

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
    <div className="m-4">
      <div className="flex flex-col gap-3">
        {QuestionsArray.map((item, index) => {
          if (Object.keys(item.data).length === 0) return null; // Skip empty groups
          return (
            <div key={index} className=" flex flex-col gap-3 border-2 border-[#f2ece6] rounded-md">
              <div className="flex flex-row justify-between items-center border-b-2 bg-[#f2ece6] border-[#f2ece6]">
                <p className="LableMain">{item.name}</p>
                <button
                  id={`${item.name}InputSectionDrop`}
                  onClick={() => handleShrink(`${item.name}InputSection`, `${item.name}InputSectionDrop`)}
                  className="transition-all flex items-center gap-2"
                >
                  <IoIosArrowDown className="text-gray-600 text-xl" />
                </button>
              </div>
              <div className="InputSection px-2 pb-2 flex flex-col gap-2" id={`${item.name}InputSection`}>
                {Object.entries(item.data).map(([key, question]) => {
                  return (
                    <div key={key} className="flex flex-col">
                      <label className="LableMain w-[100%]">
                        {question.required ? (
                          <div className="flex flex-row gap-3">
                            <p className="text-red-500">*</p>
                            <p>{question.Name}</p>
                          </div>
                        ) : (
                          question.Name
                        )}
                      </label>
                      {question.type === "select"
                        ? SelectInput(key, question)
                        : question.type === "date"
                        ? DateInput(key, question)
                        : question.type === "number"
                        ? NumberInput(key, question)
                        : TextInput(key, question)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  //   function QRScan(key) {
  //     return (
  //       <div className="flex flex-row gap-3">
  //         <input
  //           className="w-full LableInputMainBelow"
  //           type="text"
  //           value={holdItem[key]}
  //           id={key}
  //           required={Questions.Items[key].required}
  //           onChange={(e) => {
  //             const newValue = e.target.value;
  //             setHoldItem((prevState) => {
  //               return {
  //                 ...prevState,
  //                 [key]: newValue,
  //               };
  //             });
  //             if (!Questions.Items[key].required) {
  //               setHoldUserInputs((prevState) => {
  //                 return {
  //                   ...prevState,
  //                   [key]: newValue,
  //                 };
  //               });
  //             }
  //           }}
  //         />
  //         <div className="ButtonMain" onClick={() => setQRModal(true)}>
  //           Scan
  //         </div>
  //         <div>{QRModal ? <QRScanner setQRModal={setQRModal} setHoldItem={setHoldItem} setHoldUserInputs={setHoldUserInputs} NamedKey={key} /> : null}</div>
  //       </div>
  //     );
  //   }

  // return (
  //   <div key={index} className="flex flex-col">
  //     <label className="LableMain w-[100%]">
  //       {question.required ? (
  //         <div className="flex flex-row gap-3">
  //           <p className="text-red-500">*</p>
  //           <p>{question.Name}</p>
  //         </div>
  //       ) : (
  //         question.Name
  //       )}
  //     </label>
  //     {question.type === "select"
  //       ? SelectInput(question.uuid, Group)
  //       : question.type === "date"
  //       ? DateInput(question.uuid, Group)
  //       : question.type === "number"
  //       ? NumberInput(question.uuid, Group)
  //       : TextInput(question.uuid, Group)}
  //   </div>
  // );

  function SelectInput(uuid, item) {
    console.log(item);
    return (
      <select
        className="w-full LableInputMainBelow"
        value={item.value}
        id={uuid}
        required={item.required}
        onChange={(e) => {
          EditQuestionValue(uuid, e.target.value);
        }}
      >
        {item.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  function DateInput(uuid, item) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="date"
        value={item.value || ""}
        id={uuid}
        required={item.required}
        onChange={(e) => {
          EditQuestionValue(uuid, e.target.value);
        }}
      />
    );
  }

  function NumberInput(uuid, item) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="number"
        value={item.value}
        id={uuid}
        required={item.required}
        onChange={(e) => {
          EditQuestionValue(uuid, e.target.value);
        }}
      />
    );
  }

  function TextInput(uuid, item) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="text"
        value={item.value}
        id={uuid}
        required={item.required}
        onChange={(e) => {
          EditQuestionValue(uuid, e.target.value);
        }}
      />
    );
  }
}
