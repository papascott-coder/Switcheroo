export type Kind = "witness" | "swap";
export type Status = "stamped" | "held" | "settled";
export type Verb =
  | "WITNESSED"
  | "SWAPPED"
  | "HANDED OVER"
  | "PAID"
  | "JOB DONE"
  | "PICKED UP"
  | "PACKAGE";

export type Person = {
  id: string;
  name: string;
  note: string;
};

export type Card = {
  id: string;
  kind: Kind;
  verb: Verb;
  title: string;
  body: string;
  have?: string;
  want?: string;
  at: string;
  place: string;
  youId: string;
  otherId: string | null;
  otherName: string | null;
  adultStamped: boolean;
  skrHold: number;
  skrThanks: number;
  status: Status;
  mark: Mark;
};

export type Mark = "keys" | "toy" | "tool" | "house" | "box" | "hands";

export type TabId = "cards" | "you";

export const YOU_ID = "papadot.skr";
export const YOU_NAME = "Scott";

export const PEOPLE: Person[] = [
  { id: "mike.skr", name: "Mike", note: "Next door. Has a pressure washer." },
  { id: "jen.skr", name: "Jen", note: "Sold you the Civic last spring." },
  { id: "noah.skr", name: "Noah", note: "Maya's dad. Adults stamp the kids' trades." },
  { id: "sam.skr", name: "Sam", note: "Did the back deck." },
];

export const WITNESS_KINDS: { verb: Verb; label: string; hint: string; mark: Mark }[] = [
  { verb: "HANDED OVER", label: "Handed over", hint: "Keys, cash, a thing.", mark: "keys" },
  { verb: "PAID", label: "Paid", hint: "Deposit, invoice, handshake pay.", mark: "hands" },
  { verb: "JOB DONE", label: "Job done", hint: "Contractor finished the work.", mark: "house" },
  { verb: "PICKED UP", label: "Picked up", hint: "Kids, a package, a friend.", mark: "box" },
  { verb: "PACKAGE", label: "Left at the door", hint: "Just you. No second phone.", mark: "box" },
  { verb: "WITNESSED", label: "Something else", hint: "Any moment you both agree on.", mark: "hands" },
];

export function formatSkr(n: number) {
  return `${n.toLocaleString()} SKR`;
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });
}

export function personById(id: string | null) {
  if (!id) return null;
  return PEOPLE.find((p) => p.id === id) ?? null;
}
