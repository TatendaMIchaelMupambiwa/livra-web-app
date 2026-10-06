
import usersGlobalStore, { IUsersGlobalStore } from "@/store/users-store";
import { Logs } from "lucide-react";
import React from "react";
import SideBar from "./side-bar";
import UserInfo from "./user-name";

function PrivateLayoutHeader() {
 const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [openSidebar, setOpenSidebar] = React.useState(false);
 
  

  return (
    <div className="flex items-center py-5 px-20 bg-primary justify-between ">
      <h1 className="text-1 font-bold text-white">Livra</h1>
      <div className="flex gap-5 items-center">
      <UserInfo />
        <Logs
          className="text-white cursor-pointer"
          onClick={() => setOpenSidebar(true)}
        />
      </div>

      {openSidebar &&
        <SideBar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      }
    </div>
  );
}

export default PrivateLayoutHeader;
