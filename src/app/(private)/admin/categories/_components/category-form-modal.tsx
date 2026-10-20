import { Icategory } from "@/interfaces";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { uploadFileToSupabase } from "@/helpers";
import {
  createCategory,
  upadateCategoryById,
} from "@/server-actions/categories";


interface ICategoryFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCategory: Icategory | null;
  formType: "add" | "edit";
  onSubmit: (data: any) => void;
  onSuccess?: () => void;
}

function CategoryFormModal({
  open,
  setOpen,
  onSuccess,
  selectedCategory,
  formType,
}: ICategoryFormModalProps) {
  const [loading, setLoading] = React.useState(false);

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedCategory?.name || "",
      description: selectedCategory?.description || "",
      image: selectedCategory?.image || "",
    },
  });

  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      let imageUrl = selectedCategory?.image || "";
      if (selectedImage) {
        const response: any = await uploadFileToSupabase(selectedImage);
        if (!response.success) {
          throw new Error(response.message);
        }
        console.log("Image URL:", response.data);
        imageUrl = response.data;
      }
      let saveResponse = null;
      if (formType === "add") {
        saveResponse = await createCategory({
          ...values,
          image: imageUrl,
        });
      } else {
        saveResponse = await upadateCategoryById(selectedCategory?.id || "", {
          ...values,
          image: imageUrl,
        });
      }
      toast.success(
        formType === "add"
          ? "Category added successfully"
          : "Category updated successfully",
      );

      if (onSuccess) {
        onSuccess();
      }

      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(
        error.message ||
          "An error occu rred while logging in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {formType === "add" ? "Add Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>

                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Image"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImage(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="tex t-sm font-medium text-destructive" />
                  </FormItem>
                )}
              />
              {(selectedImage || selectedCategory?.image.length) && (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : selectedCategory?.image
                    }
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}

              <div className="flex justify-center gap-5">
                <Button
                  variant="outline"
                  type="button"

                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {formType === "add" ? "Add Category" : "Edit Category"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormModal;
