// components/forms/ProfileForm/shared/AiImportDialog.js
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Clipboard, Check } from "lucide-react";
import {
  generateAiImportPrompt,
  extractJson,
  normalizeAiResult,
} from "./aiImport";
import { getFormDefaultValues } from "./getFormDefaultValues";

// onApply(data) receives a full, form-shaped object — the caller just does
// form.reset(data). Nothing here touches the database; this only fills in
// the form so the person can review before hitting the real Save button.
export default function AiImportDialog({ user, onApply }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState("");
  const [error, setError] = useState("");

  const prompt = generateAiImportPrompt(user);

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(prompt)
      .then(() => {
        setCopied(true);
        toast.success(
          "Prompt copied — paste it into Claude, ChatGPT, or any AI.",
        );
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() =>
        toast.error(
          "Couldn't copy — try selecting the text and copying manually.",
        ),
      );
  };

  const handleApply = () => {
    const raw = extractJson(pasted);
    if (!raw) {
      setError(
        "Couldn't find valid JSON in that. Paste the AI's whole reply, including the code block.",
      );
      return;
    }

    const currentValues = getFormDefaultValues(user);
    const normalized = normalizeAiResult(raw, currentValues, user.email);

    onApply(normalized);
    toast.success("Profile imported — review the fields below, then save.");
    setOpen(false);
    setPasted("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="rounded-none gap-2"
          aria-label="Import and optimize profile with AI"
        >
          <Sparkles size={15} />
          Import with AI
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle>Import &amp; optimize with AI</DialogTitle>
          <DialogDescription>
            Copy the prompt below into Claude, ChatGPT, or any AI you like — add
            your LinkedIn, GitHub, coding profiles, resume, whatever you want
            considered — then bring the result back here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">1. Copy this prompt</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-none gap-1.5"
                onClick={handleCopy}
                aria-label="copy AI import prompt"
              >
                {copied ? <Check size={13} /> : <Clipboard size={13} />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              readOnly
              value={prompt}
              onFocus={(e) => e.target.select()}
              className="h-40 font-mono text-xs rounded-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              2. Paste what the AI gives back
            </label>
            <Textarea
              value={pasted}
              onChange={(e) => {
                setPasted(e.target.value);
                if (error) setError("");
              }}
              placeholder="Paste the AI's full reply here, including the json code block…"
              className="h-40 font-mono text-xs rounded-none resize-none"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 rounded-none"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-none"
            onClick={handleApply}
            disabled={!pasted.trim()}
            aria-label="apply AI result to form"
          >
            Apply to form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
