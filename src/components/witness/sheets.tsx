import { type ReactNode, useEffect } from "react";
import { Fingerprint, Nfc, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWitness } from "@/lib/store";
import {
  PEOPLE,
  WITNESS_KINDS,
  YOU_ID,
  formatSkr,
  type Mark,
} from "@/lib/witness";
import { cn } from "@/lib/utils";
import { DeedCard } from "./home";

function SheetShell({
  title,
  kicker,
  children,
  onClose,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-bg/95">
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">{kicker}</p>
          <h2 className="mt-1 font-display text-3xl tracking-wide">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-md text-muted"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>
      {children}
    </div>
  );
}

export function ComposeWitness() {
  const chooseKind = useWitness((s) => s.chooseKind);
  const closeSheet = useWitness((s) => s.closeSheet);
  const primary = WITNESS_KINDS[0];
  const rest = WITNESS_KINDS.slice(1);

  return (
    <SheetShell title="Stamp this" kicker="What happened?" onClose={closeSheet}>
      <div className="mt-4 flex min-h-0 flex-1 flex-col px-5 pb-8">
        <p className="text-sm leading-relaxed text-muted">Tap the red button. That is Handed over.</p>
        <Button
          className="mt-5 h-auto w-full flex-col items-start gap-1 px-5 py-5"
          size="lg"
          variant="stamp"
          onClick={() => chooseKind(primary)}
        >
          <span className="font-display text-3xl tracking-wide">Handed over</span>
          <span className="text-sm font-normal text-paper/80">Keys, cash, a thing. Tap here.</span>
        </Button>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">Or pick another</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {rest.map((k) => (
            <button
              key={k.verb}
              type="button"
              onClick={() => chooseKind(k)}
              className="min-h-14 rounded-md bg-surface px-4 py-3 text-left"
            >
              <span className="block text-sm font-medium text-fg">{k.label}</span>
              <span className="mt-0.5 block text-xs text-muted">{k.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </SheetShell>
  );
}

export function ComposeSwap() {
  const draft = useWitness((s) => s.draft);
  const patchDraft = useWitness((s) => s.patchDraft);
  const goPick = useWitness((s) => s.goPick);
  const closeSheet = useWitness((s) => s.closeSheet);

  return (
    <SheetShell title="Start a swap" kicker="One little thing" onClose={closeSheet}>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <p className="text-sm leading-relaxed text-muted">
            Something you don't want, for something you do. Toys, tools, a leftover.
          </p>
          <label className="mt-5 block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">I have</span>
            <input
              id="swap-have"
              className="mt-2 h-12 w-full rounded-md bg-elevated px-3 text-sm text-fg outline-none"
              placeholder="Extra 18v drill"
              value={draft.have}
              onChange={(e) => patchDraft({ have: e.target.value, mark: guessMark(e.target.value) })}
            />
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">I want</span>
            <input
              id="swap-want"
              className="mt-2 h-12 w-full rounded-md bg-elevated px-3 text-sm text-fg outline-none"
              placeholder="Pressure washer"
              value={draft.want}
              onChange={(e) => patchDraft({ want: e.target.value })}
            />
          </label>

          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-muted">Hold a little SKR?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[0, 10, 25].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => patchDraft({ skrHold: n })}
                className={cn(
                  "h-12 rounded-md text-sm",
                  draft.skrHold === n ? "bg-paper text-paper-ink" : "bg-surface text-fg",
                )}
              >
                {n === 0 ? "None" : `${n} SKR`}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            Held in the middle until you both tap Settled. Optional. Like a polite deposit.
          </p>

          <label className="mt-5 flex items-start gap-3 rounded-md bg-surface px-3 py-3">
            <input
              type="checkbox"
              className="mt-1 size-4"
              checked={draft.adultStamped}
              onChange={(e) => patchDraft({ adultStamped: e.target.checked })}
            />
            <span className="text-sm leading-relaxed text-muted">
              Adults stamp this. Keep on for kids' toys. Children never hold tokens here.
            </span>
          </label>
        </div>
        <div className="px-5 pb-8 pt-2">
          <Button
            className="w-full"
            size="lg"
            variant="paper"
            onClick={goPick}
            disabled={!draft.have?.trim() || !draft.want?.trim()}
          >
            Pick who you're swapping with
          </Button>
        </div>
      </div>
    </SheetShell>
  );
}

function guessMark(have: string): Mark {
  const t = have.toLowerCase();
  if (/(toy|lego|tonka|doll|truck)/.test(t)) return "toy";
  if (/(drill|washer|tool|saw|mower)/.test(t)) return "tool";
  if (/(key|car|bike)/.test(t)) return "keys";
  return "hands";
}

export function PickSheet() {
  const draft = useWitness((s) => s.draft);
  const pickPerson = useWitness((s) => s.pickPerson);
  const closeSheet = useWitness((s) => s.closeSheet);

  return (
    <SheetShell title="Who agrees?" kicker="Nearby Seekers" onClose={closeSheet}>
      <div className="mt-4 flex-1 overflow-y-auto px-5 pb-8">
        <p className="text-sm leading-relaxed text-muted">
          In real life you bump phones. Here, tap a name. This is pretend.
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          {PEOPLE.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => pickPerson(p)}
                className="flex w-full items-center justify-between rounded-lg bg-surface px-4 py-4 text-left"
              >
                <span>
                  <span className="block font-medium text-fg">{p.name}</span>
                  <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-muted">
                    {p.id}
                  </span>
                  <span className="mt-1 block text-xs text-faint">{p.note}</span>
                </span>
                {draft.adultStamped && p.id === "noah.skr" ? (
                  <span className="rounded-sm bg-paper px-2 py-1 font-mono text-xs uppercase tracking-widest text-paper-ink">
                    Parent
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </SheetShell>
  );
}

export function BumpSheet() {
  const draft = useWitness((s) => s.draft);
  const confirmBump = useWitness((s) => s.confirmBump);
  const closeSheet = useWitness((s) => s.closeSheet);
  const other = draft.other;

  return (
    <SheetShell title="Bump phones" kicker="NFC" onClose={closeSheet}>
      <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex h-40 w-full items-center justify-center">
            <span className="bump-pulse absolute size-28 rounded-full bg-elevated" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-paper text-paper-ink">
              <Nfc className="size-8" />
            </span>
          </div>
          <p className="mt-4 font-display text-4xl tracking-wide">
            {YOU_ID} · {other?.id}
          </p>
          <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-muted">
            Hold the phones together. On Seeker this is a real tap. Here, tap the light button.
          </p>
        </div>
        <Button className="w-full" size="lg" variant="paper" onClick={confirmBump}>
          Bump with {other?.name ?? "them"}
        </Button>
      </div>
    </SheetShell>
  );
}

export function VaultSheet() {
  const draft = useWitness((s) => s.draft);
  const authorize = useWitness((s) => s.authorize);
  const closeSheet = useWitness((s) => s.closeSheet);
  const other = draft.other;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-bg/90">
      <div className="rounded-t-xl bg-surface px-5 pb-8 pt-4 shadow-paper">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Seed Vault</p>
        <p className="mt-2 font-display text-3xl tracking-wide">
          {draft.kind === "swap" ? "Stamp this swap" : "Stamp this"}
        </p>
        <p className="mt-3 rounded-md bg-elevated px-3 py-3 font-mono text-xs leading-relaxed text-muted">
          {YOU_ID}
          {other ? ` · ${other.id}` : ""} · {draft.kind === "swap" ? `${draft.have} ↔ ${draft.want}` : draft.verb}
          {draft.adultStamped ? " · adults stamp" : ""}
          {draft.skrHold ? ` · hold ${draft.skrHold} SKR` : ""}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-faint">
          This is pretend. Tap once. On Seeker this is a fingerprint in the vault. Keys never leave the phone.
        </p>
        <Button className="mt-5 w-full" variant="paper" size="lg" onClick={authorize}>
          <Fingerprint className="size-5" />
          Tap to continue
        </Button>
        <Button className="mt-2 w-full" variant="ghost" onClick={closeSheet}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function DetailSheet() {
  const selectedId = useWitness((s) => s.selectedId);
  const cards = useWitness((s) => s.cards);
  const selectCard = useWitness((s) => s.selectCard);
  const settle = useWitness((s) => s.settle);
  const card = cards.find((c) => c.id === selectedId);
  if (!card) return null;

  return (
    <SheetShell title={card.verb} kicker="Card" onClose={() => selectCard(null)}>
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-8 pt-4">
        <DeedCard card={card} large />
        {card.skrThanks ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {card.otherName ?? "The other person"} earned {formatSkr(card.skrThanks)} for co-signing.
          </p>
        ) : null}
        {card.status === "held" ? (
          <Button className="mt-auto w-full" size="lg" variant="paper" onClick={() => settle(card.id)}>
            Settled — release {formatSkr(card.skrHold)}
          </Button>
        ) : (
          <p className="mt-auto text-center text-xs text-faint">This card is on the chain in the real app.</p>
        )}
      </div>
    </SheetShell>
  );
}

export function StampOverlay() {
  const stamp = useWitness((s) => s.stamp);
  const clearStamp = useWitness((s) => s.clearStamp);

  useEffect(() => {
    if (!stamp) return;
    const t = window.setTimeout(clearStamp, 2200);
    return () => window.clearTimeout(t);
  }, [stamp, clearStamp]);

  if (!stamp) return null;

  return (
    <button
      type="button"
      onClick={clearStamp}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg/90"
    >
      <span className="stamp-hit pointer-events-none relative left-auto top-auto flex size-56 flex-col items-center justify-center rounded-full bg-stamp text-paper shadow-paper">
        <span className="font-display text-5xl tracking-wide">{stamp.verb}</span>
        <span className="mt-2 font-mono text-xs uppercase tracking-widest text-paper/80">
          {YOU_ID}
          {stamp.otherId ? ` · ${stamp.otherId}` : ""}
        </span>
      </span>
      <span className="btn-paper rounded-md px-6 py-3 font-medium">Tap here — you're done</span>
    </button>
  );
}


