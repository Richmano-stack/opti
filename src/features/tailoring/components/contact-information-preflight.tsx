import { AlertCircle } from "lucide-react";

import type { ContactField } from "@/features/tailoring/lib/contact-info";

const fieldContent: Record<ContactField, { label: string; placeholder: string; type: string }> = {
  email: { label: "Email address", placeholder: "you@example.com", type: "email" },
  phone: { label: "Phone number", placeholder: "+254 712 345 678", type: "tel" },
  linkedin: { label: "LinkedIn profile", placeholder: "https://linkedin.com/in/you", type: "url" },
  portfolio: { label: "Portfolio website", placeholder: "https://yourname.com", type: "url" },
};

export function ContactInformationPreflight({
  missingFields,
  canSave,
  isPending,
}: {
  missingFields: ContactField[];
  canSave: boolean;
  isPending: boolean;
}) {
  return (
    <section
      aria-labelledby="missing-contact-heading"
      className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <div>
          <h3 id="missing-contact-heading" className="text-xs font-bold text-slate-900">
            Complete your contact details
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Opti found missing recommended information. Add it now or explicitly continue without it.
          </p>
        </div>
      </div>

      <input
        type="hidden"
        name="reviewedContactFields"
        value={missingFields.join(",")}
      />

      <div className="mt-3.5 grid gap-2.5">
        {missingFields.map((field) => {
          const content = fieldContent[field];
          return (
            <label key={field} className="grid gap-1 text-[11px] font-semibold text-slate-700">
              {content.label}
              <input
                name={`contact_${field}`}
                type={content.type}
                placeholder={content.placeholder}
                disabled={isPending}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-horizon-secondary focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </label>
          );
        })}
      </div>

      {canSave ? (
        <label className="mt-3 flex items-start gap-2 text-[11px] text-slate-600">
          <input name="saveContactInfo" type="checkbox" className="mt-0.5 accent-horizon-primary" />
          Save the details I add to my master résumé
        </label>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="submit"
          name="contactDecision"
          value="add"
          disabled={isPending}
          className="horizon-button-primary h-10 w-full px-4 text-xs font-bold disabled:pointer-events-none disabled:opacity-45"
        >
          Add details and continue
        </button>
        <button
          type="submit"
          name="contactDecision"
          value="continue"
          disabled={isPending}
          className="inline-flex h-9 w-full items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none disabled:opacity-45"
        >
          Continue without them
        </button>
      </div>
    </section>
  );
}
