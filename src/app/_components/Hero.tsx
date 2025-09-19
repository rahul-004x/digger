"use client";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Main from "./main";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <>
      <SignedIn>
        <Main />
      </SignedIn>
      <SignedOut>
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="mb-7 text-5xl font-bold">digger</h1>
          <p className="mb-7 text-2xl">Please sign in to continue</p>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
};

export default Hero;
