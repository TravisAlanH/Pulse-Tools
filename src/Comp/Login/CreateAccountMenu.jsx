import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../../../Firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../Firebase/Firebase";
import { RoutingStore } from "../../../Store/Store";
import { UserStore } from "../../../Store/Store";

export default function CreateAccountMenu() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const setLoginPage = RoutingStore((state) => state.setLoginPage);
  const setLoginModal = RoutingStore((state) => state.setLoginModal);
  const UnvarifiedUser = UserStore((state) => state.UnvarifiedUser);
  // const LoginPage = RoutingStore((state) => state.LoginPage);

  const handleSignUp = async (e) => {
    console.log("Building")
    e.preventDefault();
    // Check if the passwords match before proceeding
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const payload = {
      ID: 0,
      Name: fullName,
      Email: email,
    };
    UnvarifiedUser(payload);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      await updateProfile(auth.currentUser, { displayName: fullName }).catch((error) => {
        console.log(error);
      });
      await setDoc(doc(db, "Users", user.uid), {
        AccountInformation: {
          Status: "Pending",
          Company: "",
          PhoneNumber: "",
          Role: "",
        },
      }).then(() => {
        sendEmailVerification(auth.currentUser);
        setLoginModal(0);
      });

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  const clickActions = [setFullName, setEmail, setPassword, setConfirmPassword];
  const InputNames = ["Full Name", "Email", "Password", "Confirm Password"];
  const InputTypes = ["text", "text", "password", "password"];

  return (
    <div className="w-full h-full flex flex-row justify-center items-center ">
      <div className="w-full flex flex-col gap-6 m-4 p-4 bg-[#F5F5F5] border-[1px] border-[#DCDCDC] rounded-[.7rem]">
        <div>
          <p className="text-[2rem] font-bold">Sign up for your project tools account</p>
        </div>
        <form onSubmit={handleSignUp} className="flex flex-col gap-6">
          {InputNames.map((_, index) => {
            return <div className="flex flex-col gap-2">{Inputs(clickActions[index], InputNames[index], InputTypes[index])}</div>;
          })}
          <div className="flex flex-row gap-2">
            <input type="submit" value="Register" className="border-2 py-[.375rem] px-[.75rem]" />
            <button onClick={() => setLoginPage(0)} className="border-2 py-[.375rem] px-[.75rem]">
              Cancel
            </button>
          </div>

          {/* <label htmlFor="email">Email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} className="CreateLoginInputs" />
        <label htmlFor="password">Password</label>
        <input type="password" autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} className="CreateLoginInputs" />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} className="CreateLoginInputs" />
        <input type="submit" value="Create Account" className="border-2" /> */}
        </form>
      </div>
    </div>
  );

  function Inputs(action, name, type) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 font-bold text-sm">
          <label htmlFor={name}>{name}</label>
          <p className="text-red-500">*</p>
        </div>
        <input type={type} id={name} autoComplete={type === "password" ? "new-password" : "off"} onChange={(e) => action(e.target.value)} className="CreateLoginInputs" />
      </div>
    );
  }
}
