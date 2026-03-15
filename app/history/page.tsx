import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HistoryPage() {
  // Get the start of today (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: polls } = await supabase
    .from("polls")
    .select("*")
    .lt("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Past Polls</h1>
        <Link 
          href="/" 
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-2"
        >
          Today's Poll <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {!polls || polls.length === 0 ? (
        <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
          <CalendarDays className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">No Past Polls Found</h2>
          <p className="text-slate-400">Past polls will appear here once they expire.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <Link 
              key={poll.id} 
              href={`/poll/${poll.id}`}
              className="group block bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="text-indigo-400 text-sm font-medium mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {new Date(poll.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-50 line-clamp-3 mb-4 leading-snug">
                {poll.question}
              </h3>
              <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
                View Results <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
