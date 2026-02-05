

import { Button } from "@/components/ui/button";

import { ArrowRightToLine } from "lucide-react";

export default function Home() {


  return (
    <div className="flex flex-col min-h-screen space-y-4 justify-center w-full items-center">
      <div className="flex flex-col space-y-1 md:w-[480px] w-[370px]">
        <h1 className="font-bold text-4xl text-left">docs.hub</h1>
        <p className="text-muted-foreground text-md text-left">
          convert any github readme into a multilingual docs site
        </p>
        <Button className="w-full">explore dir
          <ArrowRightToLine />
        </Button>
      </div>
    </div>
  );
}
