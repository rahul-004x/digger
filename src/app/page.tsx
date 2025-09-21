import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="fixed h-full w-full bg-[#F5F6FA]">
        <Hero />
      </main>
    </HydrateClient>
  );
}
