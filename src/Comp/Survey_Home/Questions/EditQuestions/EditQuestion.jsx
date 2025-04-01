import React, { useState } from "react";
import { RoutingStore } from "../../../../../Store/Store";
import { SurveyQuestionsStore } from "../../Store/SurveyStore";
import {
  GlobalSurveyQuestions,
  RoomSurveyQuestions,
  SafetySurveyQuestions,
  SecuritySurveyQuestions,
  SiteSurveyQuestions,
} from "../StandardQuestions";

export default function EditQuestion() {
  const UUID = SurveyQuestionsStore((state) => state.data.EditQuestionHold); // Assuming you have a way to get the current question to edit
  const addCustomStandardQuestions = SurveyQuestionsStore((state) => state.addCustomStandardQuestion);
  const setSurveyModal = RoutingStore((state) => state.setSurveyModal);
  const CustomStandardQuestions = SurveyQuestionsStore((state) => state.data.CustomStandardQuestions);
  const allQuestions = {
    ...SiteSurveyQuestions,
    ...GlobalSurveyQuestions,
    ...RoomSurveyQuestions,
    ...SecuritySurveyQuestions,
    ...SafetySurveyQuestions,
    ...CustomStandardQuestions,
  };
  const resetQuestions = {
    ...SiteSurveyQuestions,
    ...GlobalSurveyQuestions,
    ...RoomSurveyQuestions,
    ...SecuritySurveyQuestions,
    ...SafetySurveyQuestions,
  };

  const [name, setName] = useState(allQuestions[UUID].Name);
  const [type, setType] = useState(allQuestions[UUID].type);
  const [options, setOptions] = useState(allQuestions[UUID].options);
  const [required, setRequired] = useState(allQuestions[UUID].Required);
  const [questionHold, setQuestionHold] = useState();

  const handleSubmit = () => {
    const payload = {
      value: { Name: name, type: type, options: options, Required: required },
      UUID: UUID,
    };
    addCustomStandardQuestions(payload);
    setSurveyModal(1); // Close the modal after saving
  };

  const handlePreview = () => {
    setQuestionHold({ Name: name, type: type, options: options, Required: required });
  };

  const handleReset = () => {
    setName(resetQuestions[UUID].Name);
    setType(resetQuestions[UUID].type);
    setOptions(resetQuestions[UUID].options);
    setRequired(resetQuestions[UUID].Required);
    setQuestionHold(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Pass props to child components */}
      <div className="border-[1px] p-2 rounded-md">
        <lable className="LableMain">Question Name:</lable>
        <NameInput value={name} onChange={setName} setQuestionHold={setQuestionHold} />
      </div>

      <div className="flex flex-row gap-4 border-[1px] p-2 rounded-md">
        <lable className="LableMain">Required:</lable>
        <RequiredInput value={required} onChange={setRequired} setQuestionHold={setQuestionHold} />
      </div>

      <div className="border-[1px] p-2 rounded-md">
        <lable className="LableMain">Input Type:</lable>
        <TypeInput value={type} onChange={setType} setQuestionHold={setQuestionHold} />
        <OptionsInput type={type} options={options} setOptions={setOptions} setQuestionHold={setQuestionHold} />
      </div>
      {questionHold && <pre className="mt-4 p-2 border w-full">{QuestionPreview(questionHold)}</pre>}
      <div className="flex flex-row w-full justify-end">
        <button
          disabled={questionHold === null} // Disable if no questionHold is set
          onClick={handleReset}
          className={"ButtonMainRed w-[50%]" + (questionHold === null ? " opacity-50 cursor-not-allowed" : "")} // Add classes for disabled state
        >
          Reset
        </button>
      </div>

      <div className="flex flex-row justify-center h-[2.5rem] gap-4">
        <button onClick={handlePreview} className="OrangeButton w-[50%]">
          Preview
        </button>
        <button
          disabled={questionHold === null} // Disable if no questionHold is set
          onClick={handleSubmit}
          className={"OrangeButton w-[50%]" + (questionHold === null ? " opacity-50 cursor-not-allowed" : "")} // Add classes for disabled state
        >
          Save
        </button>
      </div>
    </div>
  );
  function QuestionPreview() {
    return (
      <div className="w-full flex flex-row">
        <label className="LableMain">
          {questionHold.Required === true ? (
            <div className="flex flex-row gap-3">
              <p className="text-red-500">*</p>
              {questionHold.Name.replace("*", "")}
            </div>
          ) : (
            questionHold.Name
          )}
        </label>
        {questionHold.type === "select" ? (
          <select className="LableInputMainBelow w-full">
            {questionHold.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input type="text" className="LableInputMainBelow" value={`input`} />
        )}
      </div>
    );
  }
}

// Move components outside to prevent re-renders
const NameInput = React.memo(({ value, onChange, setQuestionHold }) => (
  <input
    type="text"
    placeholder="Question Name"
    value={value}
    onChange={(e) => {
      setQuestionHold(null); // Reset the preview when the name changes
      onChange(e.target.value);
    }}
    className="border border-gray-300 rounded p-2 w-full"
  />
));

const TypeInput = React.memo(({ value, onChange, setQuestionHold }) => (
  <select
    value={value}
    onChange={(e) => {
      setQuestionHold(null);
      onChange(e.target.value);
    }}
    className="border border-gray-300 rounded p-2 w-full"
  >
    <option value="">Question Type</option>
    <option value="text">Text</option>
    <option value="number">Number</option>
    <option value="select">Selection</option>
  </select>
));

const OptionsInput = React.memo(({ type, options, setOptions, setQuestionHold }) => {
  if (type === "select") {
    const moveOption = (index, direction) => {
      setOptions((prevOptions) => {
        const newOptions = [...prevOptions];
        const targetIndex = index + direction;

        // Swap positions
        [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];

        return newOptions;
      });
    };

    return (
      <div>
        <h3>Options:</h3>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                setQuestionHold(null);
                setOptions((prevOptions) => prevOptions.map((opt, i) => (i === index ? e.target.value : opt)));
              }}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button
              onClick={() => {
                setQuestionHold(null);
                moveOption(index, -1);
              }}
              disabled={index === 0}
              className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
            >
              ↑
            </button>
            <button
              onClick={() => {
                setQuestionHold(null);
                moveOption(index, 1);
              }}
              disabled={index === options.length - 1}
              className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
            >
              ↓
            </button>
            <button
              onClick={() => {
                setQuestionHold(null);
                setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
              }}
              className="p-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={() => setOptions((prevOptions) => [...prevOptions, ""])} className="p-2 bg-blue-500 text-white rounded">
          Add Option
        </button>
      </div>
    );
  }
  return null;
});

const RequiredInput = React.memo(({ value, onChange }) => (
  <label className="flex items-center">
    <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="mr-2" />
    Required
  </label>
));
