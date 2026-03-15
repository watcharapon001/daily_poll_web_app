import { CheckCircle2 } from "lucide-react";
import { PollOption } from "./poll-card";

interface ResultChartProps {
  options: PollOption[];
  results: Record<string, number>;
  totalVotes: number;
  userVotedOptionId?: string | null;
}

export function ResultChart({ options, results, totalVotes, userVotedOptionId }: ResultChartProps) {
  // Find the max vote to highlight the winning option
  const maxVotes = Math.max(...Object.values(results), 0);

  return (
    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h3 className="text-lg font-medium text-white mb-4">Current Results</h3>
      
      <div className="space-y-3">
        {options.map((option) => {
          const votes = results[option.id] || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isWinner = maxVotes > 0 && votes === maxVotes;
          const isUserChoice = userVotedOptionId === option.id;

          return (
             <div key={option.id} className="relative w-full text-left p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden">
                {/* Progress Bar Background */}
                <div 
                  className={`absolute top-0 left-0 h-full opacity-20 transition-all duration-1000 ease-out ${
                    isWinner ? "bg-indigo-400" : "bg-slate-500"
                  }`} 
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-base font-medium ${
                        isWinner ? "text-indigo-50" : "text-white"
                      }`}
                    >
                      {option.option_text}
                    </span>
                    {isUserChoice && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className={`font-semibold ${isWinner ? "text-indigo-300" : "text-slate-400"}`}>
                    {percentage}%
                  </span>
                </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center text-sm text-slate-500">
        Based on {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
      </div>
    </div>
  );
}
