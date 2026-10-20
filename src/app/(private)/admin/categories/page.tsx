"use client";
import Page from "@/app/(public)/page";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { Icategory } from "@/interfaces";
import React, { useEffect } from "react";
import CategoryFormModal from "./_components/category-form-modal";
import { set } from "zod/v4";
import { toast } from "react-hot-toast";
import { de, fa } from "zod/v4/locales";
import { deleteCategoryById, getAllCategories } from "@/server-actions/categories";
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

function CategoriesPage() {
  const [openCatergoryForm, setOPenCategoryForm] = React.useState(false);
  const [formType, setFormType] = React.useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] =
    React.useState<Icategory | null>(null);

  const [categories, setCategories] = React.useState<Icategory[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);


  const getData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllCategories();
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      console.log(response);
      setCategories(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCategory = async (id:string) =>{
    try{ 
       setLoading(true);
      const response = await deleteCategoryById(id);
      if(!response.success){
        toast.error(response.message)
        return;
      }
      toast.success(response.message)
     setCategories((prev) => prev.filter((item) => item.id !== id));

     
    }catch(error:any){
      toast.error(error.message)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = ["Id", "Name", "Image", "Created", "Actions"];

  return (
    <div className="">
      <div className="flex-col justify-between items-center">
        <div className="flex p-6 justify-between items-center">
          <PageTitle title="Categories" />
          <Button
            onClick={() => {
              setOPenCategoryForm(true);
              setSelectedCategory(null)
              setFormType("add");

            }}
          >
            Add Category
          </Button>
        </div>

        {loading && <Spinner parentHeight="200" />}

        {!loading && categories.length == 0 && (
          <InfoMessage message="no categories found" />
        )}

        {!loading && categories.length > 0 && (
          <Table>
            <TableHeader className="font-bold bg-gray-300 ">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.image}
                      className="w-20 h-20 rounded border border-gray-300 object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(item.created_at).format("h:mm A, DD/MM/YY")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-5">
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => {
                          setFormType("edit");
                          setOPenCategoryForm(true);
                          setSelectedCategory(item);
                        }}
                      >
                        <Edit2 />
                      </Button>
                      <Button 
                      variant={"outline"} size={"icon"}
                       onClick = {() => handleDeleteCategory(item.id)}
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
      {}
      {openCatergoryForm && (
        <CategoryFormModal
          open={openCatergoryForm}
          setOpen={setOPenCategoryForm}
          selectedCategory={selectedCategory}
          formType={formType}
          onSubmit={() => {}}
          onSuccess={getData}
        />
      )}
    </div>
  );
}

export default CategoriesPage;
