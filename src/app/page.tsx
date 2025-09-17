import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/Hero";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="w-full h-full bg-[#F5F6FA] fixed">
          <Hero />
      </main>
    </HydrateClient>
  );
}
