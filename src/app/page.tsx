import Link from "next/link";

import Input from "./_components/input";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="h-full p-4">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="felx items-center justify-center text-5xl text-black/70">
            digger
          </h1>
          <div className="mt-6">
            <Input />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
