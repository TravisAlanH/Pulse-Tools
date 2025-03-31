import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { BlankCurrentLocation, initState } from "../../../../Store/Init_State"; // Import the initial state for the store
import { v4 as uuidv4 } from "uuid";

import {
  SiteSurveyQuestions,
  GlobalSurveyQuestions,
  RoomSurveyQuestions,
  SecuritySurveyQuestions,
  SafetySurveyQuestions,
} from "../Questions/StandardQuestions";
import { RoutingStore } from "../../../../Store/Store";

export function trueLoad() {
  const { setLoading } = RoutingStore.getState();
  setLoading(true); // Set loading to true before the timeout
}

export function falseLoad() {
  const { setLoading } = RoutingStore.getState();
  setLoading(false); // Set loading to false after the timeout
}

export const SurveyQuestionsStore = create(
  devtools(
    (set) => ({
      data: initState.Survey,
      GenerateBaseQuestions: () => {
        const BaseQuestions = {
          ...SiteSurveyQuestions,
          ...GlobalSurveyQuestions,
          ...RoomSurveyQuestions,
          ...SecuritySurveyQuestions,
          ...SafetySurveyQuestions,
        };
        set((state) => ({
          data: {
            ...state.data,
            Questions: BaseQuestions,
          },
        }));
      },
    }),
    { name: "SurveyQuestionsStore" }
  )
);
