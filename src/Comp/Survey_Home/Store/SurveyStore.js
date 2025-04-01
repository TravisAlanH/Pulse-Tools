import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { initState } from "../../../../Store/Init_State"; // Import the initial state for the store
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
      data: () => initState.Survey,
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
      addCustomQuestion: (data) => {
        const uuid = uuidv4().replace(/[\/[\]~*.]/g, "_");
        set((state) => ({
          data: {
            ...state.data,
            CustomQuestions: { ...state.data.CustomQuestions, [uuid]: data },
          },
        }));
      },
      addCustomStandardQuestion: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            CustomStandardQuestions: { ...state.data.CustomStandardQuestions, [data.UUID]: data.value },
          },
        }));
      },
      removeCustomStandardQuestion: (uuid) => {
        set((state) => {
          const { [uuid]: removed, ...rest } = state.data.CustomStandardQuestions;
          return {
            data: {
              ...state.data,
              CustomStandardQuestions: rest,
            },
          };
        });
      },
      setEditQuestion: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            EditQuestionHold: data,
          },
        }));
      },
    }),
    { name: "SurveyQuestionsStore" }
  )
);
