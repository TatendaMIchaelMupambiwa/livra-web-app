"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { error } from "next/dist/build/output/log";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { set } from "zod/v4";
import { loginUser } from "@/server-actions/users";
import cookies from "js-cookie";

function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    role: z.enum(["user", "admin"], {
      errorMap: () => ({ message: "Please select a role." }),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response:any = await loginUser(values);
      if (!response.success) {
        throw new Error(response.message);
      }
      cookies.set("token", response.data);
      router.push(`/${values.role}/dashboard`);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(
        error.message ||
          "An error occurred while logging in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const role = [
    {
      value: "user",
      label: "User",
    },
    {
      value: "admin",
      label: "Admin",
    },
  ];

  return (
    <div className="flex h-screen items-center justify-center bg-primary">
      <div className="w-[500px] bg-white p-5 shadow-sm">
        <h2 className="text-[20px] font-bold pb-2">Login Form</h2>
        <hr className="my-3  border-gray-300 " />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-2"
                    >
                      {role.map((role) => (
                        <FormItem className="flex items-center gap-3">
                          <RadioGroupItem value={role.value} id={role.value} />
                          <FormLabel
                            htmlFor={role.value}
                            className="font-normal"
                          >
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h2 className="">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-500 hover:underline">
                  Register
                </a>
              </h2>
            </div>

            <Button disabled={loading} type="submit">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
