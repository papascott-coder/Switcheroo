import { ArrowLeftRight, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWitness } from "@/lib/store";
import { YOU_ID, formatSkr, formatWhen, type Card, type Mark } from "@/lib/witness";
import { cn } from "@/lib/utils";

export function CardsView() {
  const cards = useWitness((s) => s.cards);
  const openWitness = useWitness((s) => s.openWitness);
  const openSwap = useWitness((s) => s.openSwap);
  const selectCard = useWitness((s) => s.selectCard);

  return (
    <div className="flex flex-1 flex-col px-5 pb-28 pt-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">papadot.skr</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide">Switcheroo</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        You never start an argument over what was agreed upon. You can turn a leftover into something you want.
      </p>

      <div className="mt-4 grid gap-2">
        <a
          className="rounded-md bg-stamp px-4 py-3 text-sm text-paper"
          href="/Switcheroo-pitch.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the pitch
        </a>
        <a
          className="btn-paper rounded-md px-4 py-3 text-sm"
          href="/Switcheroo-spoken.mp4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Luna’s video
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button className="h-auto flex-col items-start gap-3 px-4 py-4" variant="stamp" onClick={openWitness}>
          <Stamp className="size-5" />
          <span className="text-left">
            <span className="block font-display text-2xl tracking-wide">Stamp this</span>
            <span className="mt-1 block text-xs font-normal text-paper/80">A deal. A handoff. Proof.</span>
          </span>
        </Button>
        <Button
          className="btn-paper h-auto flex-col items-start gap-3 px-4 py-4"
          variant="paper"
          onClick={openSwap}
        >
          <ArrowLeftRight className="size-5" />
          <span className="text-left">
            <span className="block font-display text-2xl tracking-wide text-paper-ink">Start a swap</span>
            <span className="mt-1 block text-xs font-normal text-paper-ink/70">Toys, tools, one thing.</span>
          </span>
        </Button>
      </div>

      <div className="mt-8 flex items-end justify-between">
        <p className="font-display text-3xl tracking-wide">Cards</p>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">{cards.length}</p>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {cards.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => selectCard(c.id)} className="w-full text-left">
              <DeedCard card={c} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function YouView() {
  const liquidSkr = useWitness((s) => s.liquidSkr);
  const cards = useWitness((s) => s.cards);
  const thanks = cards.reduce((n, c) => n + c.skrThanks, 0);

  return (
    <div className="flex flex-1 flex-col px-5 pb-28 pt-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">Seeker ID</p>
      <h1 className="mt-2 font-display text-5xl tracking-wide">{YOU_ID}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">Scott · Genesis Token on this demo phone.</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Stat label="Liquid SKR" value={formatSkr(liquidSkr)} />
        <Stat label="Thanks to others" value={formatSkr(thanks)} />
      </div>

      <div className="mt-6 rounded-lg bg-surface px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Kids and tokens</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Kids do not get wallets in this app. If two children trade a toy, two adults stamp the
          card. The toy moves. The tokens stay with the grown-ups.
        </p>
      </div>

      <div className="mt-4 rounded-lg bg-surface px-4 py-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">What's in it for you</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          You get a card that still exists in November. The other person can earn a little SKR for
          co-signing. Optional hold keeps a few SKR in the middle until both of you say settled.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-4">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 font-mono text-sm tabular-nums text-fg">{value}</p>
    </div>
  );
}

export function DeedCard({ card, large = false }: { card: Card; large?: boolean }) {
  return (
    <article
      className={cn(
        "time-card relative overflow-hidden rounded-lg px-4 py-4 text-paper-ink",
        large && "px-5 py-5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-paper-ink/55">{card.verb}</p>
          <h2 className={cn("mt-1 font-display tracking-wide", large ? "text-3xl" : "text-2xl")}>
            {card.title}
          </h2>
        </div>
        <MarkDot mark={card.mark} />
      </div>
      {card.body ? (
        <p className="mt-2 text-sm leading-relaxed text-paper-ink/70">{card.body}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono uppercase tracking-widest text-paper-ink/55">
          {card.youId}
          {card.otherId ? ` · ${card.otherId}` : " · just you"}
        </span>
        {card.adultStamped ? (
          <span className="rounded-sm bg-paper-ink px-2 py-1 font-mono uppercase tracking-widest text-paper">
            Adults stamped
          </span>
        ) : null}
        {card.status === "held" ? (
          <span className="rounded-sm bg-stamp px-2 py-1 font-mono uppercase tracking-widest text-paper">
            {card.skrHold} SKR held
          </span>
        ) : (
          <span className="rounded-sm bg-paper-ink/10 px-2 py-1 font-mono uppercase tracking-widest text-paper-ink/70">
            {card.status}
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-xs text-paper-ink/45">
        {formatWhen(card.at)} · {card.place}
      </p>
    </article>
  );
}

export function MarkDot({ mark }: { mark: Mark }) {
  const letter =
    mark === "keys" ? "K" : mark === "toy" ? "T" : mark === "tool" ? "L" : mark === "house" ? "H" : mark === "box" ? "B" : "W";
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-paper-ink font-display text-lg text-paper">
      {letter}
    </span>
  );
}
