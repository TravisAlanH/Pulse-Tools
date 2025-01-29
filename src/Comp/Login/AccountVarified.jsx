import React from "react";
import { UserStore } from "../../../Store/Store";
import { RoutingStore } from "../../../Store/Store";
import { db } from "../../../Firebase/Firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function AccountVarified() {
  const userData = UserStore((state) => state.data);
  const [confirm, setConfirm] = React.useState(false);
  const [InputPayload, setInputPayload] = React.useState({});
  const UserID = UserStore((state) => state.data.ID);
  const UserStatus = UserStore((state) => state.data["Status"]);
  const setLoginModal = RoutingStore((state) => state.setLoginModal);

  React.useEffect(() => {
    setInputPayload({
      id: userData.ID,
      Name: userData.Name,
      Email: userData.Email,
      status: "Pending",
      Company: "",
      PhoneNumber: "",
      Role: "",
      "Sunbird Point Of Contact": "",
      "Sunbird Point Of Contact Email": "",
    });
  }, [userData.ID]);

  if (UserStatus === "Active") return null;

  const handleSendVarification = async (e) => {
    e.preventDefault();
    const Accounts = doc(db, "Users", "sWcWnqIQ42O5UQHgZnGKzYoY4DB3");
    await updateDoc(Accounts, {
      Accounts: arrayUnion(InputPayload),
    });
  };

  if (userData["Email"] === "sunbirdadmin@sunbirddcim.com") return null;

  const target = ["Company", "PhoneNumber", "Role", "Sunbird Point Of Contact", "Sunbird Point Of Contact Email"];
  const id = ["Company", "Phone Number", "Role", "Sunbird Point Of Contact", "Sunbird Point Of Contact Email"];
  const type = ["text", "number", "text", "text", "email"];

  return (
    <div className="pt-4 w-[30rem]">
      {confirm ? (
        <form className="flex flex-col gap-4" onSubmit={() => handleSendVarification}>
          {target.map((item, index) => {
            return (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 font-bold text-sm">
                  <label htmlFor={id[index]}>{item}</label>
                  <p className="text-red-500">*</p>
                </div>
                <input
                  key={index}
                  type="text"
                  className="LoginInputs"
                  id={id[index]}
                  required={true}
                  onChange={(e) => {
                    setInputPayload({ ...InputPayload, [item]: e.target.value });
                  }}
                />
              </div>
            );
          })}
          <div className="flex flex-row gap-2">
            <input type="submit" value="Register" className="border-2 py-[.375rem] px-[.75rem]" />
            <button type="button" onClick={() => setLoginModal(-1)} classNamfe="border-2 py-[.375rem] px-[.75rem]">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-6">
          {/* access legal message */}
          <p>By clicking the checkbox below you agree to the terms and conditions of Sunbird DCIM and the use of your information in the creation and varification of your account.</p>
          {/*  */}
          <p>The details provided will be used to varify your required access.</p>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row justify-center gap-3">
              <input type="checkbox" className="w-[1.5rem] h-[1.5rem]" onChange={() => setConfirm(true)} />
              <p>Confirm</p>
            </div>
            <button type="button" onClick={() => setLoginModal(-1)} className="border-2 py-[.375rem] px-[.75rem]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
