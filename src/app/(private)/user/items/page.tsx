import InfoMessage from "@/components/functional/info-message";
import PageTitle from "@/components/ui/page-title";
import { ItemInterface } from "@/interfaces";
import { getAllItems } from "@/server-actions/items";
import React from "react";

async function userItemPage() {
  const response:any = await getAllItems();
  if (!response.success) {
    return <InfoMessage message="No Items Found" />;
  }
  const items:ItemInterface = response.data;
  return <div>
    <div className="flex flex-col gap-5">
        <PageTitle title="my items"/>
    </div>
  </div>;
}

export default userItemPage;
