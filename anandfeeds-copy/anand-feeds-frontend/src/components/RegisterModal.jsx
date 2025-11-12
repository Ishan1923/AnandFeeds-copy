import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import RegisterCard from "./RegisterCard"
import { useState } from "react";

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <RegisterCard setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
