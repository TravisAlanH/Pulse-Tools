import React from "react";
import { UserStore } from "../../../Store/Store";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../../../Firebase/Firebase";
import { signOut } from "firebase/auth";
import { db } from "../../../Firebase/Firebase"
import { FaChevronDown } from "react-icons/fa";
import { RoutingStore } from "../../../Store/Store";

export default function PendingAccounts() {
  const userData = UserStore((state) => state.data);
  const [Accounts, setAccounts] = React.useState([]);
  const [viewing, setViewing] = React.useState(-1)
  const setLoginModal = RoutingStore((state) => state.setLoginModal);


  React.useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "Users", "sWcWnqIQ42O5UQHgZnGKzYoY4DB3");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let accounts = docSnap.data().Accounts;
        if (accounts[0] === "No Accounts") {
          accounts.shift();
        }
        setAccounts(accounts);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData();
  }, []);

  console.log(Accounts)

  async function handleStatusChange(e, user) {
    let newAccounts = Accounts.map((account) => {
      if (account.id === user.id) {
        if (e.target.value === "Denied") {
          return;
        }
        return { ...account, status: e.target.value };
      }
      return account;
    });
    if (newAccounts[0] === undefined) {
      newAccounts = ["No Accounts"];
    }
    setAccounts(newAccounts);
    console.log("newAccounts", newAccounts);
    const docRef = doc(db, "Users", "sWcWnqIQ42O5UQHgZnGKzYoY4DB3");
    await setDoc(docRef, { Accounts: newAccounts });
    const docRef2 = doc(db, "Users", user.id);
    // await setDoc(docRef2, { Status: e.target.value }, { merge: true });
    await setDoc(doc(db, "Users", user.id), {
      AccountInformation: {
        Status: e.target.value,
        Company: user.Company,
        PhoneNumber: user.PhoneNumber,
        Role: user.Role,
      },
    });
    const fetchData = async () => {
      const docRef = doc(db, "Users", "sWcWnqIQ42O5UQHgZnGKzYoY4DB3");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let accounts = docSnap.data().Accounts;
        if (accounts[0] === "No Accounts") {
          accounts.shift();
        }
        setAccounts(accounts);
        console.log("accounts", accounts);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    fetchData();
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (userData["Email"] !== "sunbirdadmin@sunbirddcim.com") {
    return null;
  }
  if (Accounts.length === 0) {
    return (
      <div>
        <p>No Accounts</p>
      </div>
    );
  }
  return (
    <div className="w-screen h-full">
      <div className="overflow-y-scroll">
        {Accounts.map((user, index) => {
          return (
            <div key={index} className="w-[90%] flex flex-col gap-3">
              <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col gap-2 w-full" >
              <div className="flex flex-row"><lable className="LableMain w-[40%]">Company</lable><p className="LableInputMain w-[60%]">{user.Company}</p></div>
              <div className="flex flex-row"><lable className="LableMain w-[40%]">Name</lable><p className="LableInputMain w-[60%]">{user.Name}</p></div>              
              </div>
              <div className="flex flex-col gap-3">
              <select defaultValue={user.status} onChange={(e) => handleStatusChange(e, user)}>
                {user.status === "Active" ? null : <option value="Pending">Pending</option>}
                <option value="Active">Active</option>
                <option value="Denied">Denied</option>
              </select>
              <div className="flex flex-row justify-end">
              <button
  className={`${viewing === index ? "rotate-180" : ""} text-xl transition-all`}
  onClick={() => {
    const userList = Array.from(document.getElementsByClassName("HiddenUserData"));
    userList.forEach((element) => {
      element.classList.add("hidden");
    });
    if (viewing === index) {
      setViewing(-1)
    } else {
      setViewing(index)
      const targetElement = document.getElementById(`data-${index}`);
      if (targetElement) {
        targetElement.classList.remove("hidden");
      }
    }

  }}
><FaChevronDown/></button></div>
              </div>
              </div>
              <div className="flex flex-col gap-3 hidden HiddenUserData transition-all" id={`data-${index}`}>
              <div className="flex flex-row"><lable className="LableMain w-[30%]">Phone</lable><p className="LableInputMain w-[70%]">{user.PhoneNumber}</p></div>
              <div className="flex flex-row"><lable className="LableMain w-[30%]">Role</lable><p className="LableInputMain w-[70%]">{user.Role}</p></div>
              <div className="flex flex-row"><lable className="LableMain w-[30%]">Email</lable><p className="LableInputMain w-[70%]">{user.Email}</p></div>
            </div></div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-row justify-end">
        <button className="ButtonMain" onClick={() => {
          handleLogout
          setLoginModal(-1)
        }}>Log Out</button>
        </div>
    </div>
  );
}
