"use client";

import React from "react";
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { registerUser } from "@/server-actions/users";
import {  useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  name: z.string().min(1, "Name is required."),
});

function RegisterPage() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await registerUser({
        ...values,
      });

      if (!response.success) {
        throw new Error(response.message);
      } else {
        toast.success("User registered successfully. Please login.");
        form.reset();
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error.message ||
          "An error occurred while registering. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <div className="w-[500px] bg-white p-5 shadow-sm">
        <h2 className="text-[20px] font-bold pb-2">Register Account </h2>
        <hr className="my-3  border-gray-300 " />
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
                  <FormMessage className="text-sm font-medium text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage className="tex t-sm font-medium text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm font-medium text-destructive" />
                </FormItem>
              )}
            />

            <div>
              <h2 className="">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Login
                </a>
              </h2>
            </div>

            <Button disabled={loading} type="submit">
              Register
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
