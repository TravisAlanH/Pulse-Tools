import React from "react";
import { SurveyQuestionsStore } from "../Store/SurveyStore";
import {
  SiteSurveyQuestions,
  GlobalSurveyQuestions,
  RoomSurveyQuestions,
  SecuritySurveyQuestions,
  SafetySurveyQuestions,
} from "../Questions/StandardQuestions";

export default function QuestionsInput() {
  const Question = SurveyQuestionsStore((state) => state.data.Questions);
  const CustomStandardQuestions = SurveyQuestionsStore((state) => state.data.CustomStandardQuestions);
  const CustomQuestions = SurveyQuestionsStore((state) => state.data.CustomQuestions);
  const [sortedQuestions, setSortedQuestions] = React.useState(Question);
  const [splitQuestions, setSplitQuestions] = React.useState({});

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

  console.log("QuestionsInput splitQuestions", splitQuestions);
  //   ! PAGE NOT REFRESHING ON QUESTION COSTOMIZATION

  //   ? REMOVING FROM LIST AND SAVING IN SelectStandardQuestions Breaks it

  React.useEffect(() => {
    if (!Question) return;

    // Step 1: Initialize groupedQuestions with empty arrays for defined groups
    const groupedQuestions = {};
    sortOrder.forEach((group) => (groupedQuestions[group] = []));
    groupedQuestions["Custom"] = []; // "Other" will always be included at the end

    // Step 2: Assign questions to their respective groups
    Object.entries(Question).forEach(([key, value]) => {
      const group = value.group || "Custom"; // Default to "Other" if no group exists
      if (!groupedQuestions[group]) groupedQuestions[group] = [];
      groupedQuestions[group].push({ uuid: key, ...value });
    });

    // Step 3: Sort questions within each group based on questionTranslation order
    Object.keys(groupedQuestions).forEach((group) => {
      if (questionTranslation[group]) {
        const questionKeysOrder = Object.keys(questionTranslation[group]);

        groupedQuestions[group].sort((a, b) => {
          const indexA = questionKeysOrder.indexOf(a.uuid);
          const indexB = questionKeysOrder.indexOf(b.uuid);
          return (indexA === -1 ? questionKeysOrder.length : indexA) - (indexB === -1 ? questionKeysOrder.length : indexB);
        });
      }
    });

    // Step 4: Reorder the groups based on sortOrder, ensuring "Other" is last
    const orderedGroups = {};
    [...sortOrder, "Custom"].forEach((group) => {
      if (groupedQuestions[group]?.length > 0) {
        orderedGroups[group] = groupedQuestions[group];
      }
    });

    setSplitQuestions(orderedGroups);
  }, [Question, CustomStandardQuestions, CustomQuestions]);

  if (Question !== undefined && Object.keys(Question).length === 0) return <div className="p-3">No Questions</div>;

  return (
    <div className="p-3">
      <div>
        {Object.keys(splitQuestions).map((Group) => {
          return (
            <div key={Group} className="p-4 border-2 m-2 rounded-xl">
              <h2>{Group}</h2>
              <div className="flex flex-col gap-4">
                {splitQuestions[Group].map((question, index) => {
                  return (
                    <div key={index} className="flex flex-col">
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
                        ? SelectInput(question.uuid, Group)
                        : question.type === "date"
                        ? DateInput(question.uuid, Group)
                        : question.type === "number"
                        ? NumberInput(question.uuid, Group)
                        : TextInput(question.uuid, Group)}
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

  function SelectInput(uuid, group) {
    return (
      <select
        className="w-full LableInputMainBelow"
        value={Question[uuid].value}
        id={uuid}
        required={Question[uuid].required}
        onChange={(e) => {}}
      >
        {Question[uuid].options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  function DateInput(uuid, group) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="date"
        value={Question[uuid].value || ""}
        id={uuid}
        required={Question[uuid].required}
        onChange={(e) => {}}
      />
    );
  }

  function NumberInput(uuid, group) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="number"
        value={Question[uuid].value}
        id={uuid}
        required={Question[uuid].required}
        onChange={(e) => {}}
      />
    );
  }

  function TextInput(uuid, group) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="text"
        value={Question[uuid].value}
        id={uuid}
        required={Question[uuid].required}
        onChange={(e) => {}}
      />
    );
  }
}
