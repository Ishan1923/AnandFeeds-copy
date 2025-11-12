"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function CheckingStatus() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 px-4">
      <div className="animate-spin mb-6">
        <Loader2 className="w-16 h-16 text-blue-500" />
      </div>
      <p className="text-2xl font-semibold text-gray-700 text-center">
        Checking payment status... <br /> Please wait.
      </p>
    </div>
  );
}

export default function StatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function checkPaymentStatus() {
      const id = searchParams.get("id");
      console.log("Checking payment for ID:", id);

      if (!id) {
        router.push("/payment/failure");
        return;
      }

      try {
        const res = await fetch(`/api/status?id=${id}`);
        const data = await res.json();
        console.log("Status API Response:", data);

        if (data.success) {
          router.push("/payment/success");
        } else {
          router.push("/payment/failure");
        }
      } catch (error) {
        console.error("Error calling status API:", error);
        router.push("/payment/failure");
      }
    }

    checkPaymentStatus();
  }, [searchParams, router]);

  return <CheckingStatus />;
}
