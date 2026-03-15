"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { ErrorModal } from "../components/error-modal";

export function CreatePollClient() {
  const router = useRouter();
  
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "" }, { id: 2, text: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 10) return;
    const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
    setOptions([...options, { id: newId, text: "" }]);
  };

  const handleRemoveOption = (idToRemove: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter(opt => opt.id !== idToRemove));
  };

  const handleOptionChange = (id: number, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    const trimmedQuestion = question.trim();
    const newErrorFields: string[] = [];

    if (!trimmedQuestion) {
      setError("Please enter a question.");
      setErrorFields(["question"]);
      setIsErrorModalOpen(true);
      return;
    }
    
    if (trimmedQuestion.length < 5) {
      setError("Question is too short (minimum 5 characters).");
      setErrorFields(["question"]);
      setIsErrorModalOpen(true);
      return;
    }

    if (trimmedQuestion.length > 200) {
      setError("Question is too long (maximum 200 characters).");
      setErrorFields(["question"]);
      setIsErrorModalOpen(true);
      return;
    }
    
    // Check for any empty option fields
    const emptyOptionFields = options.filter(opt => opt.text.trim() === "");
    if (emptyOptionFields.length > 0) {
      setError("Please fill in all option fields or remove the ones you don't need.");
      setErrorFields(emptyOptionFields.map(o => `option-${o.id}`));
      setIsErrorModalOpen(true);
      return;
    }

    const validOptions = options.map(opt => ({ id: opt.id, text: opt.text.trim() }));

    if (validOptions.length < 2) {
      setError("Please provide at least two options.");
      setErrorFields(options.map(o => `option-${o.id}`));
      setIsErrorModalOpen(true);
      return;
    }

    // Check for duplicates
    const seen = new Set();
    const duplicates = new Set();
    validOptions.forEach(opt => {
      const lower = opt.text.toLowerCase();
      if (seen.has(lower)) {
        duplicates.add(lower);
      }
      seen.add(lower);
    });

    if (duplicates.size > 0) {
      setError("All options must be unique.");
      const fieldsWithDuplicates = options
        .filter(o => duplicates.has(o.text.trim().toLowerCase()))
        .map(o => `option-${o.id}`);
      setErrorFields(fieldsWithDuplicates);
      setIsErrorModalOpen(true);
      return;
    }

    // Check option length
    const tooLongOptions = validOptions.filter(opt => opt.text.length > 100);
    if (tooLongOptions.length > 0) {
      setError("Each option must be 100 characters or less.");
      setErrorFields(tooLongOptions.map(o => `option-${o.id}`));
      setIsErrorModalOpen(true);
      return;
    }

    setErrorFields([]);

    setIsSubmitting(true);

    try {
      // 1. Create the poll
      // Set expiration to the end of the current day (23:59:59)
      const expireDate = new Date();
      expireDate.setHours(23, 59, 59, 999);

      const { data: pollData, error: pollError } = await supabase
        .from("polls")
        .insert({
          question: question.trim(),
          expire_at: expireDate.toISOString()
        })
        .select()
        .single();

      if (pollError || !pollData) {
        throw new Error(pollError?.message || "Failed to create poll");
      }

      // 2. Create the options
      const formattedOptions = validOptions.map(opt => ({
        poll_id: pollData.id,
        option_text: opt.text
      }));

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(formattedOptions);

      if (optionsError) {
        throw new Error(optionsError.message || "Failed to create options");
      }

      // 3. Redirect to the new poll page
      router.push(`/poll/${pollData.id}`);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
        Create a Poll
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        Ask anything. Polls are public and will expire at the end of the day.
      </p>

      {/* Error messages are now handled by ErrorModal */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-slate-300 mb-2">
            Your Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is the best programming language?"
            className={`w-full bg-slate-900/50 border rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all font-medium ${
              errorFields.includes("question") 
                ? "border-red-500 ring-red-500/20" 
                : "border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"
            }`}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Options
          </label>
          
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={`flex-1 bg-slate-900/50 border rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  errorFields.includes(`option-${option.id}`)
                    ? "border-red-500 ring-red-500/20"
                    : "border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"
                }`}
                disabled={isSubmitting}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(option.id)}
                  disabled={isSubmitting}
                  className="p-4 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors shrink-0 border border-transparent hover:border-slate-700"
                  aria-label="Remove option"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          {options.length < 10 && (
            <button
              type="button"
              onClick={handleAddOption}
              disabled={isSubmitting}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add another option
            </button>
          )}
        </div>

        <div className="pt-6 border-t border-slate-700/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              "Creating your poll..."
            ) : (
              <>
                Confirm & Create Poll 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      <ErrorModal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)} 
        message={error} 
      />
    </div>
  );
}
