import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen space-y-4 justify-center w-full items-center">
      <div className="flex flex-col space-y-1 md:w-[480px] w-[370px]">
        <h1 className="font-bold text-4xl text-left">docs.hub</h1>
        <p className="text-muted-foreground text-md text-left">
          convert any github readme into a multilingual docs site
        </p>
      </div>

      <div className="flex flex-col space-y-2 md:w-[480px] w-[370px] mt-4">
        <Input placeholder="insert github repo" />
        <Button className="w-full">
          convert to doc
        </Button>
      </div>
    </div>
  );
}
