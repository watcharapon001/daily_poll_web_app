import { PollSkeleton } from "./components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-start flex-1 w-full max-w-2xl mx-auto py-12 gap-8">
      <PollSkeleton />
      <PollSkeleton />
    </div>
  );
}
