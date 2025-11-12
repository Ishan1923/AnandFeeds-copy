"use client";

import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PaymentFailure = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-red-100 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-red-700">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-4">
          <p className="text-gray-600 px-6">
            {"We're sorry, but there was an issue processing your payment. If the amount was deducted, it will be refunded within 5-7 business days."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center w-full space-y-4">
          <Button
            onClick={() => router.push("/checkout")}
            className="w-full max-w-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          >
            Try Again
            <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentFailure;
