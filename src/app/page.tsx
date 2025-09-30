import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="fixed min-h-full w-full bg-[#FFF]">
        <Hero />
      </main>
    </HydrateClient>
  );
}
