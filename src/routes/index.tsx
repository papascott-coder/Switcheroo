import { createFileRoute } from "@tanstack/react-router";
import { WitnessApp } from "@/components/witness/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <WitnessApp />;
}
