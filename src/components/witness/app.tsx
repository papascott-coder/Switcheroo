import { type ReactNode } from "react";
import { Layers, UserRound } from "lucide-react";
import { useWitness } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CardsView, YouView } from "./home";
import {
  BumpSheet,
  ComposeSwap,
  ComposeWitness,
  DetailSheet,
  PickSheet,
  StampOverlay,
  VaultSheet,
} from "./sheets";

export function WitnessApp() {
  return (
    <Phone>
      <AppShell />
    </Phone>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-bg md:gap-12 md:px-8">
      <aside className="hidden w-72 shrink-0 flex-col justify-center md:flex">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Seeker</p>
        <p className="mt-3 font-display text-5xl leading-none tracking-wide text-fg">Switcheroo</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          You never start an argument over what was agreed upon. Two names. One card. Done while you are both there.
        </p>
      </aside>
      <div className="relative flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-bg md:my-8 md:min-h-[760px] md:rounded-xl md:shadow-paper">
        {children}
      </div>
    </div>
  );
}

function AppShell() {
  const tab = useWitness((s) => s.tab);
  const setTab = useWitness((s) => s.setTab);
  const sheet = useWitness((s) => s.sheet);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {tab === "cards" ? <CardsView /> : <YouView />}
      </div>
      <nav className="absolute inset-x-0 bottom-0 z-10 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-2 px-2 py-1">
          <NavBtn active={tab === "cards"} onClick={() => setTab("cards")} label="Cards">
            <Layers className="size-5" />
          </NavBtn>
          <NavBtn active={tab === "you"} onClick={() => setTab("you")} label="You">
            <UserRound className="size-5" />
          </NavBtn>
        </div>
      </nav>
      {sheet === "compose-witness" ? <ComposeWitness /> : null}
      {sheet === "compose-swap" ? <ComposeSwap /> : null}
      {sheet === "pick" ? <PickSheet /> : null}
      {sheet === "bump" ? <BumpSheet /> : null}
      {sheet === "vault" ? <VaultSheet /> : null}
      {sheet === "detail" ? <DetailSheet /> : null}
      <StampOverlay />
    </>
  );
}

function NavBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 flex-col items-center justify-center gap-0.5 text-xs",
        active ? "text-fg" : "text-faint",
      )}
    >
      {children}
      <span className="font-mono uppercase tracking-widest">{label}</span>
    </button>
  );
}
