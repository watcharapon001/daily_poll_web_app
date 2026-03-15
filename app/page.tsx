import { supabase } from "@/lib/supabase";
import { PollClient } from "./poll-client";

// Revalidate every minute or leave it dynamic
export const revalidate = 60;

export default async function Home() {
  // Get the start of today (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch only polls created today
  const { data: polls, error: pollError } = await supabase
    .from("polls")
    .select("*")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  // If there are polls, fetch options for all of them
  let allOptions: any[] = [];
  if (polls && polls.length > 0) {
    const pollIds = polls.map(p => p.id);
    const { data: optionsData } = await supabase
      .from("poll_options")
      .select("*")
      .in("poll_id", pollIds);
      
    allOptions = optionsData || [];
  }

  return (
    <div className="flex flex-col items-center justify-start flex-1 w-full max-w-2xl mx-auto py-12 gap-8">
      {(!polls || polls.length === 0) ? (
        <div className="w-full bg-slate-800/80 border border-slate-700/50 rounded-3xl p-12 text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
          <h2 className="text-2xl font-bold text-white mb-2">No Polls Available Today</h2>
          <p className="text-slate-400">Please check back later or go create a new poll!</p>
        </div>
      ) : (
        polls.map(poll => {
          const pollOptions = allOptions.filter(opt => opt.poll_id === poll.id);
          return (
            <div key={poll.id} className="w-full">
              <PollClient initialPoll={poll} initialOptions={pollOptions} />
            </div>
          );
        })
      )}
    </div>
  );
}
