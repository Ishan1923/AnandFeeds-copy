"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PaymentSuccess = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Thank you for your purchase. Your transaction has been completed and
            a receipt has been emailed to you.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={() => router.push("/your-orders")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            View Order Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
