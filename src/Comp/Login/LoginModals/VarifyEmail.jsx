import React from "react";
import { UserStore } from "../../../../Store/Store";
import { RoutingStore } from "../../../../Store/Store";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../../../Firebase/Firebase";

export default function VarifyEmail() {
  const User = UserStore((state) => state.data);
  const setLoginModal = RoutingStore((state) => state.setLoginModal);

  console.log(User);
  return (
    <div>
      <div className="flex flex-col w-[30rem] gap-6 pt-6">
        <p className="">
          Welcome {User.Name}. We have sent an email to {User.Email} with a link to varify your account to gain access.
        </p>
        <button
          className="border-2 w-[7rem]"
          onClick={() => {
            sendEmailVerification(auth.currentUser);
            setLoginModal(-1);
          }}
        >
          Resend Email
        </button>
      </div>
    </div>
  );
}
