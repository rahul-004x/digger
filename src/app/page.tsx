import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="h-full">
        <div className="flex items-center justify-center h-screen">
          <Hero />
        </div>
      </main>
    </HydrateClient>
  );
}
