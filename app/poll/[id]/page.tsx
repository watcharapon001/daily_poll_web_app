import { supabase } from "@/lib/supabase";
import { ResultChart } from "@/app/components/result-chart";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 60; // Revalidate results every minute

export default async function PollResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pollId = resolvedParams.id;
  
  // Fetch poll details
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("*")
    .eq("id", pollId)
    .single();

  if (pollError || !poll) {
    notFound();
  }

  const { data: options } = await supabase
    .from("poll_options")
    .select("*")
    .eq("poll_id", poll.id);

  const { data: votesData } = await supabase
    .from("poll_votes")
    .select("option_id")
    .eq("poll_id", poll.id);

  const totalVotes = votesData?.length || 0;
  const results: Record<string, number> = {};
  
  if (votesData) {
    votesData.forEach(v => {
      results[v.option_id] = (results[v.option_id] || 0) + 1;
    });
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto py-8 lg:py-12">
      <Link 
        href="/history" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>
      
      <div className="w-full bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-medium border border-slate-600">
            Past Poll
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {new Date(poll.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          {poll.question}
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          This poll has ended. Here are the final results.
        </p>

        <ResultChart 
          options={options || []} 
          results={results} 
          totalVotes={totalVotes} 
        />
      </div>
    </div>
  );
}
