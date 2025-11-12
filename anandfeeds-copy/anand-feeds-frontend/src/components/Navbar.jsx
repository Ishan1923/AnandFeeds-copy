"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import LoginModal from "./LoginModal";
import { toast } from "./ui/use-toast";
import Cart from "./Cart";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ reloadCart }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [state, setState] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get("query") || ""
  );

  React.useEffect(() => {
    if (searchParams.get("auth")) {
      if (searchParams.get("auth") === "success") {
        toast({ variant: "constructive", title: "Login Success!" });
      } else if (searchParams.get("auth") === "fail") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: searchParams.get("fail_message"),
        });
      }
    }
  }, [searchParams]);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const menus = [
    { title: "Home", path: "/" },
    { title: "Products", path: "/#products" },
    { title: "Gallery", path: "/#gallery" },
    { title: "Contact Us", path: "/#contactus" },
    { title: "Jobs", path: "/jobs" },
    { title: "Orders", path: "/your-orders" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <nav className="bg-white w-full border-b shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 max-w-screen-xl mx-auto flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                height={50}
                width={50}
                alt="Logo"
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            {menus.map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="text-gray-700 hover:text-pink-500 transition-all duration-300"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Cart & Auth Actions - Right Aligned */}
          <div className="hidden md:flex items-center space-x-1">
            <Cart searchParams={searchParams} reloadCart={reloadCart} />
            {session ? (
              <Button
                onClick={handleLogout}
                className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => setOpen(true)}
                className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              className="text-gray-700 outline-none p-2 rounded-md focus:ring focus:ring-gray-400"
              onClick={() => setState(!state)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {state ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={26} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={26} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {state && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-md overflow-hidden"
            >
              <ul className="flex flex-col items-center space-y-4 py-4">
                {menus.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      className="text-gray-700 hover:text-pink-500 block text-lg"
                      onClick={() => setState(false)}
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                ))}
                <motion.div
                  className="flex flex-col items-center space-y-1 mt-1 gap-x-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menus.length * 0.1 }}
                >
                  <Cart searchParams={searchParams} reloadCart={reloadCart} />
                  {session ? (
                    <Button
                      onClick={handleLogout}
                      className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setOpen(true)}
                      className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      Login
                    </Button>
                  )}
                </motion.div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LoginModal open={open} setOpen={setOpen} />
    </>
  );
}
