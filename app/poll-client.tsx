"use client";

import { useState, useEffect, useCallback } from "react";
import { Poll, PollOption, PollCard } from "./components/poll-card";
import { supabase } from "@/lib/supabase";

function generateSessionId() {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("daily_poll_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("daily_poll_session_id", sessionId);
  }
  return sessionId;
}

export function PollClient({
  initialPoll,
  initialOptions,
}: {
  initialPoll: Poll | null;
  initialOptions: PollOption[];
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [results, setResults] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVotedOptionId, setUserVotedOptionId] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!initialPoll) return;
    
    // In a real app, an RPC or grouped query might be better,
    // but here we can just fetch all votes for the poll.
    const { data: votesData } = await supabase
      .from("poll_votes")
      .select("option_id")
      .eq("poll_id", initialPoll.id);

    if (votesData) {
      setTotalVotes(votesData.length);
      const counts: Record<string, number> = {};
      votesData.forEach(v => {
        counts[v.option_id] = (counts[v.option_id] || 0) + 1;
      });
      setResults(counts);
    }
  }, [initialPoll]);

  useEffect(() => {
    const id = generateSessionId();
    setSessionId(id);

    if (initialPoll && id) {
      const checkVoteStatus = async () => {
        const { data, error } = await supabase
          .from("poll_votes")
          .select("id, option_id")
          .eq("poll_id", initialPoll.id)
          .eq("session_id", id)
          .single();

        if (data && !error) {
          setHasVoted(true);
          setUserVotedOptionId(data.option_id);
          fetchResults();
        }
      };
      
      checkVoteStatus();

      // Subscribe to real-time changes on poll_votes for this poll
      const channel = supabase
        .channel(`poll-results-${initialPoll.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "poll",
            table: "poll_votes",
            filter: `poll_id=eq.${initialPoll.id}`,
          },
          () => {
            // Refresh results whenever someone votes or unvotes
            fetchResults();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [initialPoll, fetchResults]);

  const handleVote = async (optionId: string) => {
    if (!initialPoll || !sessionId || hasVoted) return;

    setIsVoting(true);
    try {
      const { error } = await supabase.from("poll_votes").insert({
        poll_id: initialPoll.id,
        option_id: optionId,
        session_id: sessionId,
      });

      if (error) {
        console.error("Error submitting vote:", error);
      } else {
        setHasVoted(true);
        setUserVotedOptionId(optionId);
        fetchResults(); // Fetch new results
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleUnvote = async () => {
    if (!initialPoll || !sessionId || !hasVoted) return;

    setIsVoting(true);
    try {
      const { error } = await supabase
        .from("poll_votes")
        .delete()
        .eq("poll_id", initialPoll.id)
        .eq("session_id", sessionId);

      if (error) {
        console.error("Error removing vote:", error);
      } else {
        setHasVoted(false);
        setUserVotedOptionId(null);
        setResults({});
        setTotalVotes(0);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <PollCard
      poll={initialPoll}
      options={initialOptions}
      hasVoted={hasVoted}
      onVote={handleVote}
      onUnvote={handleUnvote}
      isVoting={isVoting}
      results={results}
      totalVotes={totalVotes}
      userVotedOptionId={userVotedOptionId}
    />
  );
}
