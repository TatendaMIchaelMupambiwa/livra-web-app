import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Logs } from "lucide-react";

function page() {
  return (
    <div>
      <h1>WELCOME TO LIVRA</h1>
      <Button className="w-max ">
        <Link href={"/login"}> Get Started </Link>
      </Button>
    </div>
  );
}

export default page;
