import { BarChart3, CheckCircle2, Undo2, Share2, Check, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { ResultChart } from "./result-chart";

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
}

export interface Poll {
  id: string;
  question: string;
  created_at: string;
  expire_at: string;
}

interface PollCardProps {
  poll: Poll | null;
  options: PollOption[];
  hasVoted: boolean;
  onVote: (optionId: string) => Promise<void>;
  onUnvote?: () => Promise<void>;
  isVoting: boolean;
  results?: Record<string, number>;
  totalVotes?: number;
  userVotedOptionId?: string | null;
}

export function PollCard({
  poll,
  options,
  hasVoted,
  onVote,
  onUnvote,
  isVoting,
  results = {},
  totalVotes = 0,
  userVotedOptionId,
}: PollCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!poll?.expire_at) return;

    const calculateTimeLeft = () => {
      const difference = new Date(poll.expire_at).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return "Poll ended";
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      return parts.join(" ");
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [poll?.expire_at]);

  const handleShare = async () => {
    if (!poll) return;
    const url = `${window.location.origin}/poll/${poll.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (!poll) {
    return (
      <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center backdrop-blur-sm shadow-xl">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No Poll Available Today</h2>
        <p className="text-slate-400">Please check back later for the next daily poll.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-indigo-500/10">
      <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20">
          Daily Poll
        </span>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft}</span>
        </div>
        <button
          onClick={handleShare}
          className="ml-auto p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-600/50 flex items-center gap-2 text-xs font-medium"
          title="Share Poll"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              Share
            </>
          )}
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight">
        {poll.question}
      </h1>

      {hasVoted ? (
        <div>
          <ResultChart
            options={options}
            results={results}
            totalVotes={totalVotes}
            userVotedOptionId={userVotedOptionId}
          />
          {onUnvote && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={onUnvote}
                disabled={isVoting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent hover:border-slate-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Undo2 className="w-4 h-4" />
                ยกเลิกโหวต
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onVote(option.id)}
              disabled={isVoting}
              className="w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group bg-slate-800/50 border-slate-700 hover:border-indigo-400 hover:bg-slate-700 cursor-pointer"
            >
              <span className="text-base font-medium transition-colors text-white group-hover:text-indigo-50">
                {option.option_text}
              </span>
              <div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-indigo-400 flex items-center justify-center transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
