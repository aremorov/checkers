import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { blueButtonStyle } from "./game/[gameID]";

const Login = () => {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Welcome, {session.user?.name}</p>
      {/* <img src={session.user?.image ?? ""} alt="" /> */}
      <button onClick={() => signOut()} className={blueButtonStyle}>
        Sign Out
      </button>
    </div>
  ) : (
    <div>
      <p>You are not signed in</p>

      <button onClick={() => signIn()} className={blueButtonStyle}>
        Sign In
      </button>
    </div>
  );
};

export default Login;
