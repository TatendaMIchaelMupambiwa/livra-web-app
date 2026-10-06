"use client";

import React, { use } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import usersGlobalStore, { IUsersGlobalStore } from "@/store/users-store";
import {
  LayoutDashboard,
  ListSortDescending,
  ListTodo,
  PackageSearch,
  Settings,
  User,
  UserShield,
} from "lucide-react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/functional/logout-button";

function SideBar({
  openSidebar,
  setOpenSidebar,
}: {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}) {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const pathname = usePathname();

  const size = 15;

  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={size} />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <ListSortDescending size={size} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <PackageSearch size={size} />,
    },
    { name: "Items", path: "/admin/items", icon: <ListTodo size={size} /> },
    { name: "Profile", path: "/admin/users", icon: <UserShield size={size} /> },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={size} />,
    },
  ];

  const userMenuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <LayoutDashboard size={size} />,
    },
    { name: "Profile", path: "/user/profile", icon: <User size={size} /> },
    {
      name: "Categories",
      path: "/user/categories",
      icon: <ListSortDescending size={size} />,
    },
    {
      name: "Products",
      path: "/user/products",
      icon: <PackageSearch size={size} />,
    },
    { name: "Items", path: "/user/items", icon: <ListTodo size={size} /> },
    {
      name: "Settings",
      path: "/user/settings",
      icon: <Settings size={size} />,
    },
  ];

  const menuItems: any =
    user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dashboard Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 px-8 mt-5">
          {menuItems.map((item: any) => (
            <div key={item.name} className={`px-5 py-3 flex item-center gap-5 hover:bg-muted border-rounded ${pathname === item.path ? "bg-muted border-rounded" : ""}`}>
              
                {item.icon}
               <span className={`text-sm ${pathname === item.path ? "font-bold text-primary" : ""}`}>{item.name}</span> 
             
            </div>
          ))}

          <LogoutButton/>
        </div>

        <div className="grid flex-1 auto-rows-min gap-6 px-4" />
      </SheetContent>
    </Sheet>
  );
}

export default SideBar;
