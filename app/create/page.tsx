import { CreatePollClient } from "./create-poll-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePollPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto py-12">
      <div className="w-full mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
      <CreatePollClient />
    </div>
  );
}
