import React from "react";
import { RoutingStore } from "../../../../Store/Store";
import NewQuestion from "../Questions/CreateQuestions/NewQuestion";
import SelectStandardQuestions from "../Questions/SelectStandardQuestions";
import EditQuestion from "../Questions/EditQuestions/EditQuestion";

export default function SurveyModal() {
  const Modal = RoutingStore((state) => state.data.SurveyModal);
  const setSurveyModal = RoutingStore((state) => state.setSurveyModal);

  const pages = [<NewQuestion />, <SelectStandardQuestions />, <EditQuestion />];
  const Header = ["New Question", "Select Standard Questions", "Edit Question"];

  return (
    <div id="SurveyModal" className="MainModalClass">
      <div className="ModalContent flex flex-col w-full py-4">
        <div className="flex flex-row justify-between items-center gap-8 px-4 ">
          <h1 className="text-[1rem] font-bold">{Header[Modal]}</h1>
          <span
            className="close"
            onClick={() => {
              setSurveyModal(-1);
            }}
          >
            &times;
          </span>
        </div>
        <div className="flex flex-row overflow-auto h-full">{pages[Modal]}</div>
      </div>
    </div>
  );
}
