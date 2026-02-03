"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";

type GithubSignInButtonProps = {
    callbackUrl?: string;
    className?: string;
};

export function GithubSignInButton({
    callbackUrl = "/",
    className,
}: GithubSignInButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <Button
            type="button"
            variant="outline"
            className={className}
            disabled={isLoading}
            onClick={async () => {
                try {
                    setIsLoading(true);
                    await signIn("github", { callbackUrl });
                } catch (err) {
                    console.error(err)
                } finally {
                    setIsLoading(false);
                }
            }}
        >
            <Github />
            {isLoading ? "Connecting..." : "Continue with GitHub"}
        </Button>
    );
}

