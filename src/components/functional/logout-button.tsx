"use client";

import React from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();
  const onClcik = async () => {
    try {
      Cookies.remove("token");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      toast.error("logout failed");
    } 
  };

  return <Button  onClick={onClcik}>Logout</Button>;
}

export default LogoutButton;
