"use client";
import PageTitle from "@/components/ui/page-title";
import React, { useEffect } from "react";

import Page from "@/app/(public)/page";
import { Button } from "@/components/ui/button";
import { set } from "zod/v4";
import { toast } from "react-hot-toast";
import { de, fa } from "zod/v4/locales";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { name } from "next/dist/server/ci-info";
import { Edit2, Trash } from "lucide-react";
import dayjs from "dayjs";
import { registryItemSchema } from "shadcn/schema";
import Spinner from "@/components/ui/spinner";
import InfoMessage from "@/components/functional/info-message";
import { deleteItemById, getAllItems } from "@/server-actions/items";
import { ItemInterface } from "@/interfaces";
import { useRouter } from "next/navigation";
import ItemForm from "./_components/item-form";
import Link from "next/link";

function EditItem() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const getData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllItems();
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      console.log(response);
      setItems(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setLoading(true);
      const response = await deleteItemById(id);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    "Id",
    "Name",
    "Image",
    "Catergory",
    "Rent Per Day",
    "Total Quantity ",
    "Available Quantity",
    "Created",
    "Actions",
  ];

  return (
    <div>
      <div className="flex justify-between gap-5 items-center">
        <PageTitle title="edit item" />
        <Button>
          <Link href="/admin/items/add">Add Item</Link>
        </Button>
      </div>
      {loading && <Spinner parentHeight="200" />}

      {!loading && items.length == 0 && (
        <InfoMessage message="no items found" />
      )}

      {!loading && items.length > 0 && (
        <Table>
          <TableHeader className="font-bold bg-gray-300 ">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: ItemInterface) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <img
                    src={
                      (typeof item.images === "string"
                        ? JSON.parse(item.images)
                        : item.images)?.[0]
                    }
                    alt={item.name}
                    className="w-20 h-20 rounded border border-gray-300 object-cover"
                    onError={(e) => {
                      console.log("Failed image URL:", e.currentTarget.src);
                    }}
                  />
                </TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>{item.rent_per_day}</TableCell>
                <TableCell>{item.total_quantity}</TableCell>
                <TableCell>{item.available_quantity}</TableCell>
                <TableCell>
                  {dayjs(item.created_at).format("h:mm A, DD/MM/YY")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-5">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        router.push(`/admin/items/edit/${item.id}`);
                      }}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => handleDeleteCategory(item.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
export default EditItem;
