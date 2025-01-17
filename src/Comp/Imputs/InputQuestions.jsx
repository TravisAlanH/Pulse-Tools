import React, { useState, useEffect, useRef } from "react";
import { Questions } from "../../../dcT_Objects/ObjectQuestions";

export default function InputQuestions({ header, currentValue }) {
  const required = Questions.Items[header].required;
  const type = Questions.Items[header].type;

  const inputStyle = "border-2 border-red-400";

  const [inputValue, setInputValue] = useState(currentValue);

  function handleChanges(e) {
    const newValue = e.target.value;
    setInputValue(newValue);
  }
  console.log(header);

  function InputType({ type, inputValue, required }) {
    switch (type) {
      case "text":
        return <input className={inputStyle} type="text" value={inputValue} required={required} onChange={handleChanges} id={header} />;
      case "number":
        return <input className={inputStyle} type="number" value={inputValue} required={required} onChange={handleChanges} />;
      case "date":
        return <input className={inputStyle} type="date" value={inputValue} required={required} onChange={handleChanges} />;
      case "select":
        return (
          <select className={inputStyle} value={inputValue} required={required} onChange={handleChanges}>
            {Questions.Items[header].options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return <input className={inputStyle} type="text" value={inputValue} required={required} onChange={handleChanges} />;
    }
  }

  return (
    <div className="flex flex-col">
      <label className="bg-slate-300">{header}</label>
      <InputType type={type} inputValue={inputValue} required={required} />
    </div>
  );
}
