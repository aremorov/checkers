import React from "react";
import { useSession, signOut } from "next-auth/react";

const Account = () => {
  const { data: session, status } = useSession();

  return status === "authenticated"
    ? (session.user?.email as string)
    : "Not signed in";
};

export default Account;
