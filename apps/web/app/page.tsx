"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GithubSignInButton } from "@/components/auth/github-signin-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

export default function Home() {
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const nameOrEmail = data?.user?.name || data?.user?.email || "GitHub";
      toast.success(`GitHub account connected as ${nameOrEmail}`);
    }
  }, [status, data]);

  const isAuthenticated = status === "authenticated";

  return (
    <div className="flex flex-col min-h-screen space-y-4 justify-center w-full items-center">
      <div className="flex flex-col space-y-1 md:w-[480px] w-[370px]">
        <h1 className="font-bold text-4xl text-left">docs.hub</h1>
        <p className="text-muted-foreground text-md text-left">
          convert any github readme into a multilingual docs site
        </p>
        {isAuthenticated && (
          <Badge variant={"outline"} className="text-xs text-muted-foreground mt-1 rounded-none">
            <Github fill="#fff" />
            Connected as{" "}
            <span className="font-medium">
              {data?.user?.name || data?.user?.email}
            </span>
          </Badge>
        )}
      </div>

      <div className="flex flex-col space-y-2 md:w-[480px] w-[370px] mt-4">
        <Input placeholder="insert github repo" />
        <Button className="w-full">convert to doc</Button>

        {!isAuthenticated ? (
          <GithubSignInButton className="w-full" callbackUrl="/" />
        ) : (
          <LogoutButton className="w-full" />
        )}
      </div>
    </div>
  );
}
