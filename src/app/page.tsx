import Link from "next/link";

import Input from "./_components/input";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen max-w-7xl items-end justify-center bg-gradient-to-b pb-20">
        <div className="w-full max-w-lg">
          <Input />
        </div>
      </main>
    </HydrateClient>
  );
}
