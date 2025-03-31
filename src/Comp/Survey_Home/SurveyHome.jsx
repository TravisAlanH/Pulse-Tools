import React from "react";
import { SafetySurveyQuestions } from "./Questions/StandardQuestions";
import NewQuestion from "./Questions/CreateQuestions/NewQuestion";
import SurveyModal from "./Modals/SurveyModal";
import { RoutingStore } from "../../../Store/Store";
import { SurveyQuestionsStore } from "./Store/SurveyStore";

export default function SurveyHome() {
  const surveyModalShow = RoutingStore((state) => state.data.SurveyModal);
  const setSurveyModal = RoutingStore((state) => state.setSurveyModal);
  const GenerateBaseQuestions = SurveyQuestionsStore((state) => state.GenerateBaseQuestions);

  return (
    <div>
      <button
        className="OrangeButton"
        onClick={() => {
          setSurveyModal(1); // Generate the base questions when clicked
        }}
      >
        Fill Base Questions
      </button>
      <button
        className="MainButton"
        onClick={() => {
          setSurveyModal(0); // Open the modal for creating a new question
        }}
      >
        Create New Question
      </button>
      {surveyModalShow !== -1 ? <SurveyModal /> : null}
    </div>
  );
}
