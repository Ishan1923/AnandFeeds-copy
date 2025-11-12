"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "./config/firebase-config";

export default function FirebaseAuthHandler({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const auth = getAuth(app);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
  }, [auth, router, session]);

  return children;
}
