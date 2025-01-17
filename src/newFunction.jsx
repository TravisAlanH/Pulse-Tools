import PendingAccounts from "./Comp/AdminUser/PendingAccounts";
import CreateAccountMenu from "./Comp/Login/CreateAccountMenu";
import LoginMenu from "./Comp/Login/LoginMenu";

export function newFunction() {
  return (
    <div>
      <CreateAccountMenu />
      <LoginMenu />
      <PendingAccounts />
    </div>
  );
}
