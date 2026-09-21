import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

function page() {
  return (
    <div>
      <div className="flex justify-between items-center py-5 px-20 bg-primary ">
        <h1 className="text-1 font-bold text-white">Livra</h1>
      </div>

      <h1>WELCOME TO LIVRA</h1>
      <Button className="w-max ">
        <Link href={"/ogin"}> Get Started </Link>
       
      </Button>
    
    </div>
  );
}

export default page;
