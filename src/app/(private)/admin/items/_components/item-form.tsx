"use client";
import { Icategory, ItemInterface } from "@/interfaces";
import { getAllCategories } from "@/server-actions/categories";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { uploadFileToSupabase } from "@/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { file } from "zod/v4";
import { addNewItem, updateItemById } from "@/server-actions/items";
import { useRouter } from "next/navigation";

interface itemFormProps {
  formType: "add" | "edit";
  initialValues?: Partial<ItemInterface>;
}

function ItemForm({ formType, initialValues }: itemFormProps) {
  const [categories, setCategories] = React.useState<Icategory[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [newlySelectedImageFiles, setNewlySelectedImageFile] = React.useState<
    File[]
  >([]);
  const [existingImages, setExistingImages] = React.useState<string[]>(
    initialValues?.images || [],
  );

  const router = useRouter();

  const getData = async () => {
    try {
      const response: any = await getAllCategories();
      if (!response.success) {
        throw new Error(response.message);
      }
      setCategories(response.data);
    } catch (error) {
      setCategories([]);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category_id: z.string().min(1, "Catergory is required"),
    rent_per_day: z.number().min(1, "Rent per day is required"),
    available_quantity: z.number().min(1, "Available quanity is require"),
    total_quantity: z.number().min(1, "Total quanity is required"),
    images: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      category_id: initialValues?.category_id?.toString() || "",
      rent_per_day: initialValues?.rent_per_day || 0,
      available_quantity: initialValues?.available_quantity || 0,
      total_quantity: initialValues?.total_quantity || 0,
      images: initialValues?.images || [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      let newImageUrls = [];
      for (let file of newlySelectedImageFiles) {
        const response = await uploadFileToSupabase(file);
        if (!response.success) {
          throw new Error(response.message);
        }
        newImageUrls.push(response.data);
      }
      const allImages = [...existingImages, ...newImageUrls];
      values.images = allImages;
      let saveResponse = null;

      if (formType === "add") {
        saveResponse = await addNewItem(values);
      } else {
        saveResponse = await updateItemById(initialValues?.id || 0, values);
      }

      if (!saveResponse.success) {
        throw new Error(saveResponse.message);
      }
      toast.success(
        formType === "add"
          ? "Item added successfully"
          : "Item updated successfully",
      );

      router.push("/admin/items");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleFileDelete = (index: number) => {
    const updatedFiles = newlySelectedImageFiles.filter((_, i) => i !== index);
    setNewlySelectedImageFile(updatedFiles);
  };

  const handleExistingImageDelete = (url: string) =>{
      setExistingImages((prev) => prev.filter((item) => item !== url));
  }

  return (
    <div className="mt-5">
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage className="tex t-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => {
                  const selectedCategory = categories.find(
                    (category) => String(category.id) === field.value,
                  );

                  return (
                    <FormItem>
                      <FormLabel>Category</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category">
                              {selectedCategory?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage className="tex t-sm font-medium text-destructive" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="total_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter total quantity"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="rent_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent per Day</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter rent per day"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="available_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter available quantity"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Input
                        multiple
                        type="file"
                        placeholder=""
                        onChange={(e) => {
                          const files: any = e.target.files;
                          setNewlySelectedImageFile(Array.from(files));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            {[...newlySelectedImageFiles, ...existingImages].map(
              (item, index) => (
                <div
                  className="border border-gray-300 p-1 rounded  flex flex-col gap-3"
                  key={index}
                >
                  <img
                    src={
                      typeof item === "string"
                        ? item
                        : URL.createObjectURL(item)
                    }
                    className="w-32 h-32 object-contain rounded p-2 border border-primary"
                  />
                  <span
                    className="text-sm-underline text-gray-600 cursor-pointer"
                    onClick={() => {
                      if(typeof item === "string"){
                        handleExistingImageDelete(item);
                      }
                      handleFileDelete(index);
                    }}
                  >
                    Delete
                  </span>
                </div>
              ),
            )}
          </div>

          <div className="flex justify-center gap-5">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                router.push("/admin/items");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {formType === "add" ? "Add Item" : "Edit Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ItemForm;