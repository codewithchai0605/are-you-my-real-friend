import { Panda } from "@/components/mascots";
import { Shell } from "@/components/shell";
import { BigLink } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
        <Panda className="w-32 animate-bob" mood="smirk" />
        <h1 className="font-display text-3xl font-bold text-[#17213e]">Oops! This quiz has flown…</h1>
        <p className="max-w-xs font-display text-lg font-medium text-[#3b4a6b]">Check the link you were shown, or make a brand-new one of your own!</p>
        <BigLink href="/create">make a quiz</BigLink>
      </div>
    </Shell>
  );
}
