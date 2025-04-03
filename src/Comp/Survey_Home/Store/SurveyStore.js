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
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../Firebase/Firebase";

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
    (set, get) => ({
      data: () => initState.Survey,
      setInicialSurveryState: async (data) => {
        set((state) => ({
          data: {
            ...state.data,
            Questions: data.Questions || {},
            CustomQuestions: data.CustomQuestions || {},
            CustomStandardQuestions: data.CustomStandardQuestions || {},
            SelectedQuestionsList: data.SelectedQuestionsList || [],
          },
        }));
      },
      SaveAllQuestions: async (LocationUUID) => {
        const { data } = get();
        const Questions = data.Questions || {};
        const CustomQuestions = data.CustomQuestions || {};
        const CustomStandardQuestions = data.CustomStandardQuestions || {};
        const SelectedQuestionsList = data.SelectedQuestionsList || [];
        const QuestionsRef2 = collection(db, "Users", auth.currentUser.uid, "SurveyData");
        const newDocRef = doc(QuestionsRef2, LocationUUID);
        console.log("saveing", LocationUUID);
        console.log({
          Questions: Questions,
          CustomQuestions: CustomQuestions,
          CustomStandardQuestions: CustomStandardQuestions,
        });
        await setDoc(newDocRef, {
          Questions: Questions,
          CustomQuestions: CustomQuestions,
          CustomStandardQuestions: CustomStandardQuestions,
        });
      },
      SaveAllQuestionsToRedux: () => {
        const { data } = get();
        const SelectedQuestionsList = data.SelectedQuestionsList || [];
        const CustomQuestions = data.CustomQuestions || {};
        const CustomStandardQuestions = data.CustomStandardQuestions || {};
        const standardQuestions = {
          ...SiteSurveyQuestions,
          ...GlobalSurveyQuestions,
          ...RoomSurveyQuestions,
          ...SecuritySurveyQuestions,
          ...SafetySurveyQuestions,
          ...CustomQuestions,
          ...CustomStandardQuestions,
        };
        let holdQuestionsList = {};
        SelectedQuestionsList.map((key) => {
          holdQuestionsList[key] = standardQuestions[key];
        });
        set((state) => ({
          data: {
            ...state.data,
            Questions: holdQuestionsList,
          },
        }));
      },
      EditQuestionValue: (UUID, newValue) => {
        set((state) => ({
          data: {
            ...state.data,
            Questions: {
              ...state.data.Questions,
              [UUID]: {
                ...state.data.Questions[UUID], // Keep existing properties
                value: newValue, // Update only the "value" field
              },
            },
          },
        }));
      },

      addToSelectedQuestionsList: (UUID) => {
        set((state) => ({
          data: {
            ...state.data,
            SelectedQuestionsList: [...state.data.SelectedQuestionsList, UUID],
          },
        }));
      },
      removeFromSelectedQuestionsList: (UUID) => {
        set((state) => ({
          data: {
            ...state.data,
            SelectedQuestionsList: state.data.SelectedQuestionsList.filter((item) => item !== UUID),
          },
        }));
      },
      bulkAddToSelectedQuestionsList: (UUIDs) => {
        set((state) => ({
          data: {
            ...state.data,
            SelectedQuestionsList: [...state.data.SelectedQuestionsList, ...UUIDs],
          },
        }));
      },
      bulkRemoveFromSelectedQuestionsList: (UUIDs) => {
        set((state) => ({
          data: {
            ...state.data,
            SelectedQuestionsList: state.data.SelectedQuestionsList.filter((item) => !UUIDs.includes(item)),
          },
        }));
      },
      resetSelectedQuestionsList: () => {
        set((state) => ({
          data: {
            ...state.data,
            SelectedQuestionsList: [],
          },
        }));
      },
      EditCustomQuestion: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            CustomQuestions: { ...state.data.CustomQuestions, [data.UUID]: data.value },
          },
        }));
      },
      AddToCustomStandardQuestions: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            CustomStandardQuestions: { ...state.data.CustomStandardQuestions, [data.UUID]: data.value },
          },
        }));
      },
      EditCustomStandardQuestion: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            CustomStandardQuestions: { ...state.data.CustomStandardQuestions, [data.UUID]: data.value },
          },
        }));
      },

      SetBaseQuestions: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            Questions: data,
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

      setCustomQuestion: (data) => {
        set((state) => ({
          data: {
            ...state.data,
            CustomQuestions: data,
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

      removeCustomStandardQuestion: (uuid, standardQuestion) => {
        console.log(uuid);

        set((state) => {
          const { [uuid]: removed, ...updatedCustomStandardQuestions } = state.data.CustomStandardQuestions || {};

          return {
            data: {
              ...state.data,
              CustomStandardQuestions: updatedCustomStandardQuestions,
              Questions: {
                ...state.data.Questions,
                [uuid]: standardQuestion, // Re-adding to Questions
              },
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
