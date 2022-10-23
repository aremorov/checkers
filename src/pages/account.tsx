import React from "react";
import { useSession, signOut } from "next-auth/react";

const Account = () => {
  const { data: session, status } = useSession();

  return status === "authenticated" ? true : false;
};

export default Account;
