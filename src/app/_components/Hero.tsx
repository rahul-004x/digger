"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Main from "./main";
import { Button } from "@/components/ui/button";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const Hero = () => {
  return (
    <>
      <SignedIn>
        <Main />
      </SignedIn>
      <SignedOut>
        <div className="relative flex h-screen flex-col items-center justify-center bg-white overflow-hidden">
          <BackgroundRippleEffect />
          <div className="relative z-10 flex flex-col items-center justify-center text-gray-900">
            <h1 className="mb-7 text-5xl font-bold">digger</h1>
            <p className="mb-7 text-2xl">Please sign in to continue</p>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default Hero;
