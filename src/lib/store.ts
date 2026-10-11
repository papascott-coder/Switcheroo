import { create } from "zustand";
import {
  YOU_ID,
  WITNESS_KINDS,
  type Card,
  type Mark,
  type Person,
  type TabId,
  type Verb,
} from "./witness";

export type Phase = "connect" | "app";
export type Sheet =
  | null
  | "compose-witness"
  | "compose-swap"
  | "pick"
  | "bump"
  | "vault"
  | "detail";

type StampFlash = {
  verb: Verb;
  otherId: string | null;
};

type Draft = {
  kind: "witness" | "swap";
  verb: Verb;
  title: string;
  body: string;
  have: string;
  want: string;
  mark: Mark;
  needOther: boolean;
  adultStamped: boolean;
  skrHold: number;
  other: Person | null;
};

const emptyDraft = (): Draft => ({
  kind: "witness",
  verb: "HANDED OVER",
  title: "",
  body: "",
  have: "",
  want: "",
  mark: "keys",
  needOther: true,
  adultStamped: false,
  skrHold: 0,
  other: null,
});

function seedCards(): Card[] {
  return [
    {
      id: "c-tonka",
      kind: "swap",
      verb: "SWAPPED",
      title: "Tonka dump truck ↔ LEGO city set",
      body: "The kids wanted to trade. Two adults stamped it. No kid wallets.",
      have: "Vintage Tonka dump truck",
      want: "LEGO city set",
      at: "2026-09-22T21:00:00.000Z",
      place: "Front porch",
      youId: YOU_ID,
      otherId: "noah.skr",
      otherName: "Noah",
      adultStamped: true,
      skrHold: 0,
      skrThanks: 4,
      status: "settled",
      mark: "toy",
    },
    {
      id: "c-civic",
      kind: "witness",
      verb: "HANDED OVER",
      title: "2014 Honda Civic · keys and title",
      body: "87,412 miles. Paid in full. Both of us stamped the handoff.",
      at: "2026-09-11T22:00:00.000Z",
      place: "Safeway lot, Ballard",
      youId: YOU_ID,
      otherId: "jen.skr",
      otherName: "Jen",
      adultStamped: false,
      skrHold: 0,
      skrThanks: 8,
      status: "settled",
      mark: "keys",
    },
    {
      id: "c-deck",
      kind: "witness",
      verb: "JOB DONE",
      title: "Back deck stain, two coats",
      body: "Sam finished Saturday. We both stamped the photo of the job.",
      at: "2026-09-23T15:00:00.000Z",
      place: "Backyard",
      youId: YOU_ID,
      otherId: "sam.skr",
      otherName: "Sam",
      adultStamped: false,
      skrHold: 25,
      skrThanks: 5,
      status: "held",
      mark: "house",
    },
  ];
}

type State = {
  hydrated: boolean;
  phase: Phase;
  tab: TabId;
  liquidSkr: number;
  cards: Card[];
  sheet: Sheet;
  draft: Draft;
  selectedId: string | null;
  stamp: StampFlash | null;
  setHydrated: () => void;
  connect: () => void;
  setTab: (tab: TabId) => void;
  openWitness: () => void;
  openSwap: () => void;
  patchDraft: (p: Partial<Draft>) => void;
  chooseKind: (k: (typeof WITNESS_KINDS)[number]) => void;
  closeSheet: () => void;
  goPick: () => void;
  pickPerson: (p: Person) => void;
  confirmBump: () => void;
  authorize: () => void;
  clearStamp: () => void;
  selectCard: (id: string | null) => void;
  settle: (id: string) => void;
};

function makeCard(draft: Draft): Card {
  const other = draft.other;
  const isSwap = draft.kind === "swap";
  const title = isSwap
    ? `${draft.have.trim() || "This"} ↔ ${draft.want.trim() || "that"}`
    : draft.body.trim() ||
      WITNESS_KINDS.find((k) => k.verb === draft.verb)?.hint ||
      draft.verb;
  const held = draft.skrHold > 0;
  return {
    id: `c-${Date.now()}`,
    kind: draft.kind,
    verb: isSwap ? "SWAPPED" : draft.verb,
    title,
    body: draft.body.trim(),
    have: isSwap ? draft.have.trim() : undefined,
    want: isSwap ? draft.want.trim() : undefined,
    at: new Date().toISOString(),
    place: "Seattle",
    youId: YOU_ID,
    otherId: other?.id ?? null,
    otherName: other?.name ?? null,
    adultStamped: draft.adultStamped,
    skrHold: draft.skrHold,
    skrThanks: other ? (isSwap ? 4 : 6) : 0,
    status: held ? "held" : "stamped",
    mark: draft.mark,
  };
}

export const useWitness = create<State>()((set, get) => ({
  hydrated: true,
  phase: "app",
  tab: "cards",
  liquidSkr: 420,
  cards: seedCards(),
  sheet: null,
  draft: emptyDraft(),
  selectedId: null,
  stamp: null,
  setHydrated: () => set({ hydrated: true }),
  connect: () => set({ phase: "app", hydrated: true }),
      setTab: (tab) => set({ tab, sheet: null, selectedId: null }),
      openWitness: () =>
        set({
          sheet: "compose-witness",
          draft: {
            ...emptyDraft(),
            kind: "witness",
            verb: "HANDED OVER",
            mark: "keys",
            needOther: true,
          },
        }),
      openSwap: () =>
        set({
          sheet: "compose-swap",
          draft: {
            ...emptyDraft(),
            kind: "swap",
            verb: "SWAPPED",
            mark: "toy",
            needOther: true,
            adultStamped: true,
          },
        }),
      patchDraft: (p) => set({ draft: { ...get().draft, ...p } }),
      chooseKind: (k) => {
        const needOther = k.verb !== "PACKAGE";
        set({
          draft: {
            ...get().draft,
            verb: k.verb,
            mark: k.mark,
            needOther,
            title: k.label,
          },
          sheet: needOther ? "pick" : "vault",
        });
      },
      closeSheet: () => set({ sheet: null, draft: emptyDraft(), stamp: null }),
      goPick: () => {
        const d = get().draft;
        if (!d.needOther) {
          set({ sheet: "vault" });
          return;
        }
        set({ sheet: "pick" });
      },
      pickPerson: (p) => set({ draft: { ...get().draft, other: p }, sheet: "bump" }),
      confirmBump: () => set({ sheet: "vault" }),
      authorize: () => {
        const { draft, cards, liquidSkr } = get();
        const card = makeCard(draft);
        const thanks = card.skrThanks;
        const hold = card.skrHold;
        set({
          cards: [card, ...cards],
          liquidSkr: Math.max(0, liquidSkr - hold),
          sheet: null,
          selectedId: null,
          stamp: { verb: card.verb, otherId: card.otherId },
          draft: emptyDraft(),
          tab: "cards",
        });
        void thanks;
      },
      clearStamp: () => set({ stamp: null }),
      selectCard: (id) => set({ selectedId: id, sheet: id ? "detail" : null }),
      settle: (id) => {
        const { cards, liquidSkr } = get();
        const card = cards.find((c) => c.id === id);
        if (!card || card.status !== "held") return;
        set({
          cards: cards.map((c) =>
            c.id === id ? { ...c, status: "settled", skrHold: 0 } : c,
          ),
          liquidSkr: liquidSkr + card.skrHold,
        });
      },
}));
