"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "./ui/icons";
import { signIn } from "next-auth/react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { app } from "../app/config/firebase-config";
import { useRouter } from "next/navigation";

export default function LoginModal({ open, setOpen }) {
  // const [navOpen, setNavOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const auth = getAuth(app);
  const recaptchaVerifierRef = useRef(null);

  // Clear recaptcha on unmount and when dialog closes
  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      clearRecaptcha();
      setOtpSent(false);
      setConfirmation(null);
      setContact("");
      setOtp("");
      setError("");
    }
  }, [open]);

  const clearRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    // Also remove any existing recaptcha elements
    const recaptchaElements = document.querySelectorAll('.grecaptcha-badge');
    recaptchaElements.forEach(element => element.remove());
  };

  const setupRecaptcha = () => {
    clearRecaptcha(); // Clear any existing instances first

    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA verified");
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
          clearRecaptcha();
        },
      });

      return recaptchaVerifierRef.current;
    } catch (error) {
      console.error("Error setting up reCAPTCHA:", error);
      setError("Failed to setup verification. Please refresh the page.");
      return null;
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setContact(value);
      setError(""); 
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!contact || contact.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const verifier = setupRecaptcha();
      if (!verifier) {
        throw new Error("Failed to setup verification");
      }

      const formattedContact = `+91${contact}`;
      console.log("Sending OTP to:", formattedContact);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedContact,
        verifier
      );
      
      setConfirmation(confirmationResult);
      setOtpSent(true);
      setError(""); // Clear any existing errors
    } catch (error) {
      console.error("OTP Sending Error:", error);
      setError(error.message || "Failed to send OTP. Please try again.");
      clearRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
  
    if (!confirmation) {
      setError("Please request a new OTP");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      await confirmation.confirm(otp);
  
      const response = await signIn("credentials", {
        phone: `+91${contact}`,
        redirect: false,
      });
  
      if (!response.ok) throw new Error("Failed to store session");
  
      router.push("/");
      setOpen(false);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <>
      <div id="recaptcha-container"></div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Login to your profile</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={handleLogin}
              disabled={loading}
            >
              <Icons.google className="mr-2 h-4" />
              Google
            </Button>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">+91</span>
                <input
                  type="tel"
                  value={contact}
                  onChange={handleContactChange}
                  placeholder="Enter 10-digit number"
                  className="flex-1 p-2 border rounded"
                  disabled={loading || otpSent}
                  maxLength={10}
                />
              </div>

              {otpSent && (
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  className="w-full p-2 border rounded"
                  disabled={loading}
                  maxLength={6}
                />
              )}

              {error && (
                <div className="text-sm text-red-500 mt-1">{error}</div>
              )}

              <Button
                onClick={otpSent ? handleOTPSubmit : handleSendOtp}
                className="w-full"
                variant={otpSent ? "default" : "secondary"}
                disabled={
                  loading ||
                  (otpSent ? otp.length !== 6 : contact.length !== 10)
                }
              >
                {loading
                  ? "Please wait..."
                  : otpSent
                  ? "Verify OTP"
                  : "Send OTP"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}