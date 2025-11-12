"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useState } from "react"
import { useToast } from "./ui/use-toast"
import Cookies from "js-cookie"
import { Icons } from "./ui/icons"
import { Loader2 } from "lucide-react";

export default function RegisterCard({ setOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  
  const register = async () => {
    setIsLoading(true);
    const response = await fetch(`https://anandfeeds.abhinandan.me/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email, email: email, password: password })
    });

    const json = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: json.error.message,
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    else {
      toast({
        variant: "constructive",
        title: "Account Created Successfully!",
        // description: json.error.message,
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setOpen(false);
      Cookies.set('auth-token', json.jwt);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex">
          <Button className="w-full" onClick={() => window.location.href = `https://anandfeeds.abhinandan.me/api/connect/google`} variant="outline">
            <Icons.google className="mr-2 h-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} onClick={register} className="w-full">{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait</>) : 'Create account'}</Button>
      </CardFooter>
    </Card>
  )
}