"use client";
import { usePathname } from "next/navigation";
import React from "react";
import PrivateLayout from "./private-layout";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const isPrivate =
    pathName.startsWith("/user") || pathName.startsWith("/admin");
  if (isPrivate) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  return <div>{children}</div>;
}

export default LayoutProvider;
