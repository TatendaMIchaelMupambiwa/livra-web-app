"use client";
import React, { useEffect } from "react";
import PrivateLayoutHeader from "./header";

import usersGlobalStore, { IUsersGlobalStore } from "@/store/users-store";
import { toast } from "react-hot-toast";
import { getLoggedInUser } from "@/server-actions/users";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = usersGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getLoggedInUser();
      if (!response.success) {
        throw new Error(response.message);
      }
      setUser(response.data);
    } catch (error: any) {
      Cookies.remove("token");
      toast.error(error.message);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (<Spinner />);
  }

  return (
    <div>
      <PrivateLayoutHeader />
      {children}
    </div>
  );
}

export default PrivateLayout;
