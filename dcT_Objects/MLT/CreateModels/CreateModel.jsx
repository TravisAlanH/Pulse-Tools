import React from "react";
import { ObjectListing, UniqueOrder } from "../../ObjectsArrays";
import { Questions } from "../../ObjectQuestions";
import { NewModel } from "../../ObjectsArrays";
import { AllLocationsStore } from "../../../Store/Store";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../Firebase/Firebase";

export default function CreateModel() {
  const [ObjectType, setObjectType] = React.useState({});
  const [ModelDetails, setModelDetails] = React.useState(JSON.parse(JSON.stringify(NewModel)));
  const CustomModels = AllLocationsStore((state) => state.data.CustomMLTItems);
  const setCustomMLTItems = AllLocationsStore((state) => state.setCustomMLTItems);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("CustomModels", CustomModels);
    let holdItemCopy = JSON.parse(JSON.stringify(CustomModels));
    holdItemCopy.push(ModelDetails);
    const CustomModelList = doc(db, "Users", auth.currentUser.uid, "LibraryData", "CustomModels");
    setDoc(CustomModelList, { ["CustomModels"]: holdItemCopy })
      .then(() => {
        setCustomMLTItems(holdItemCopy);
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }

  return (
    <div>
      <div></div>
      <form
        className="flex flex-col gap-2 h-full w-full"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="pb-6 flex flex-col gap-4">
          {Object.keys(NewModel).map((key, index) => {
            return (
              <div key={index} className="flex flex-col">
                <label className="LableMain w-[100%]">
                  {Questions.Items[key].required ? (
                    <div className="flex flex-row gap-3">
                      <p className="text-red-500">*</p>
                      {key.replace("*", "")}
                    </div>
                  ) : (
                    key
                  )}
                </label>
                <div className="w-[100%]">{key === "Object" ? ObjectInput(key) : Questions.Items[key].type === "text" ? TextInput(key) : Questions.Items[key].type === "number" ? NumberInput(key) : Questions.Items[key].type === "select" ? SelectInput(key) : TextInput(key)}</div>
              </div>
            );
          })}
        </div>
        <div className="">
          <input className="ButtonMain" type="submit" value="Save" />
        </div>
      </form>
    </div>
  );

  function SelectInput(key) {
    return (
      <select
        className="w-full LableInputMainBelow"
        value={ModelDetails[key]}
        required={Questions.Items[key].required}
        id={key}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...ModelDetails };
          holdItemCopy[key] = newValue;
          setModelDetails(holdItemCopy);
        }}
      >
        {Questions.Items[key].options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  function NumberInput(key) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="number"
        value={ModelDetails[key]}
        required={Questions.Items[key].required}
        id={key}
        onChange={(e) => {
          const newValue = e.target.value;
          setModelDetails((prevState) => {
            return {
              ...prevState,
              [key]: newValue,
            };
          });
        }}
      />
    );
  }

  function TextInput(key) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="text"
        value={ModelDetails[key]}
        required={Questions.Items[key].required}
        id={key}
        onChange={(e) => {
          const newValue = e.target.value;
          let holdItemCopy = { ...ModelDetails };
          holdItemCopy[key] = newValue;
          setModelDetails(holdItemCopy);
        }}
      />
    );
  }

  function NumberInput(key) {
    return (
      <input
        className="w-full LableInputMainBelow"
        type="number"
        value={ModelDetails[key]}
        required={Questions.Items[key].required}
        id={key}
        onChange={(e) => {
          const newValue = e.target.value;
          setModelDetails((prevState) => {
            return {
              ...prevState,
              [key]: newValue,
            };
          });
        }}
      />
    );
  }

  function ObjectInput(key) {
    return (
      <div>
        <select
          onChange={(e) => {
            const newValue = e.target.value;
            setModelDetails((prevState) => {
              return {
                ...prevState,
                [key]: newValue,
              };
            });
          }}
          required={Questions.Items[key].required}
          className="w-full LableInputMainBelow"
        >
          <option>Select</option>;
          {Object.keys(ObjectListing).map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
