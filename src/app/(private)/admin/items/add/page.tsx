import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import Link from "next/link";
import React from "react";
import ItemForm from "../_components/item-form";

function AddItem() {
  return (
    <div>
      <PageTitle title="Add Item" />
      <ItemForm formType="add" />
    </div>
  );
}

export default AddItem;
