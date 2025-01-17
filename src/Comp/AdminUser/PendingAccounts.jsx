import React from "react";
import { UserStore } from "../../../Store/Store";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../Firebase/Firebase";

export default function PendingAccounts() {
  const userData = UserStore((state) => state.data);
  const [Accounts, setAccounts] = React.useState([]);

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
    <div>
      <div>
        {Accounts.map((user, index) => {
          return (
            <div className="flex flex-row gap-3" key={index}>
              <p>{user.Company}</p>
              <p>{user.PhoneNumber}</p>
              <p>{user.Role}</p>
              <p>{user.Name}</p>
              <p>{user.Email}</p>
              <select defaultValue={user.status} onChange={(e) => handleStatusChange(e, user)}>
                {user.status === "Active" ? null : <option value="Pending">Pending</option>}
                <option value="Active">Active</option>
                <option value="Denied">Denied</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
