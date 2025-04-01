import React from "react";

import SurveyModal from "./Modals/SurveyModal";
import { RoutingStore } from "../../../Store/Store";
import QuestionsInput from "./AnswerQuestions/QuestionsInput";

export default function SurveyHome() {
  const surveyModalShow = RoutingStore((state) => state.data.SurveyModal);
  const setSurveyModal = RoutingStore((state) => state.setSurveyModal);

  return (
    <div className="my-3">
      <div className="w-full flex flex-row justify-center">
        <button
          className="OrangeButton"
          onClick={() => {
            setSurveyModal(1); // Generate the base questions when clicked
          }}
        >
          Create / Edit Questions
        </button>
      </div>
      <div>
        <QuestionsInput />
      </div>

      {surveyModalShow !== -1 ? <SurveyModal /> : null}
    </div>
  );
}
