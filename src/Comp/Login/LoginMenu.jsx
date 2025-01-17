import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../../Firebase/Firebase";
import { UserStore } from "../../../Store/Store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Firebase/Firebase";
import { RoutingStore } from "../../../Store/Store";
import { getMLT } from "../../../dcT_Objects/MLT/getMLT";

export default function LoginMenu() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = UserStore((state) => state.LogInUser);
  const User = UserStore((state) => state.data);
  const setAccountInformation = UserStore((state) => state.SetAccountActive);
  const setLoginPage = RoutingStore((state) => state.setLoginPage);
  const setLoginModal = RoutingStore((state) => state.setLoginModal);
  const UnvarifiedUser = UserStore((state) => state.UnvarifiedUser);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in the user using Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      console.log("USER", user);
      if (user.email !== "sunbirdadmin@sunbirddcim.com") {
        if (!user.emailVerified) {
          // Send email verification
          await sendEmailVerification(auth.currentUser);
          const payload = {
            ID: 0,
            Name: user.displayName,
            Email: user.email,
          };
          UnvarifiedUser(payload);
          setLoginModal(0);
          await signOut(auth);
        } else if (user.emailVerified && docSnap.data().AccountInformation.Status === "Pending") {
          console.log("Pending");
          setLoginModal(1);
        } else {
          setUser(user);
          console.log(User);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setAccountInformation(docSnap.data().AccountInformation);
            console.log("Logged IN");
            getMLT();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }
      } else {
        setUser(user);
      }
      // Handle success case (e.g., navigate to another page or show success message)
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      // Handle error case (e.g., show error message to the user)
    }
  };

  return (
    <div className="flex flex-col justify-center h-full m-4">
      <div className="flex flex-col gap-8 justify-center items-center ">
        <div className="flex flex-col gap-6 p-8  bg-[#F5F5F5] border-[1px] border-[#DCDCDC] rounded-[.7rem]">
          <div className="flex flex-col gap-6">
            <h1 className="text-[1.8rem] font-bold">Login to project tools</h1>
            <p className="text-sm">Enter the details below</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col w-full gap-6">
            <input className="LoginInputs " type="text" placeholder="Your e-mail address" onChange={(e) => setEmail(e.target.value)} />
            <input className="LoginInputs " placeholder="Password" autoComplete="selection-blue password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <div className="flex flex-row gap-2">
              <input className="border-2 " type="checkbox" onChange={() => {}} />
              <p className="text-sm">Remember me on this device</p>
            </div>
            <div className="flex flex-row justify-between w-full md:w-[25rem] lg:w-[25rem] gap-6">
              {/* ! HAVE TO FIGURE THIS OUT not setLoginPage */}
              <a className="text-sm" href="#" onClick={() => setLoginPage(1)}>
                Forgot your password?
              </a>
              <input className="border-2" type="submit" value="Login" />
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-6 p-8 md:w-[25rem] lg:w-[25rem] w-full bg-[#F5F5F5] border-[1px] border-[#DCDCDC] rounded-[.7rem]">
          <p className="text-[1.8rem] font-bold">Sign up</p>
          <button
            className="w-[8.7rem] bg-[#863594] hover:bg-[#64286E] text-white rounded-[.35rem] font-bold py-[.375rem] px-[.7rem]"
            onClick={() => {
              setLoginPage(1);
            }}
          >
            Sign up with us
          </button>
          <p>Once you sign up and gain access you will have full access to the project tools including the on-site audit tool and data center survey tool</p>
        </div>
      </div>
    </div>
  );
}
