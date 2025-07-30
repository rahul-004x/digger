import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="h-full">
          <Hero />
      </main>
    </HydrateClient>
  );
}
