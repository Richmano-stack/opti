import { AlertCircle } from "lucide-react";

import type { ContactField } from "@/services/contact-info";
import { Button } from "@/components/ui/button";

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
      className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-4"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <div>
          <h3 id="missing-contact-heading" className="text-sm font-bold text-slate-900">
            Complete your contact details
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Opti found missing recommended information. Add it now or explicitly continue without it.
          </p>
        </div>
      </div>

      <input
        type="hidden"
        name="reviewedContactFields"
        value={missingFields.join(",")}
      />

      <div className="mt-4 grid gap-3">
        {missingFields.map((field) => {
          const content = fieldContent[field];
          return (
            <label key={field} className="grid gap-1 text-xs font-semibold text-slate-700">
              {content.label}
              <input
                name={`contact_${field}`}
                type={content.type}
                placeholder={content.placeholder}
                disabled={isPending}
                className="h-10 rounded-lg border border-amber-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-brand-muted focus:ring-2 focus:ring-brand-soft"
              />
            </label>
          );
        })}
      </div>

      {canSave ? (
        <label className="mt-4 flex items-start gap-2 text-xs text-slate-600">
          <input name="saveContactInfo" type="checkbox" className="mt-0.5" />
          Save the details I add to my master résumé
        </label>
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button
          type="submit"
          name="contactDecision"
          value="add"
          disabled={isPending}
          className="bg-brand-action text-slate-900 hover:bg-brand-action-hover"
        >
          Add details and continue
        </Button>
        <Button
          type="submit"
          name="contactDecision"
          value="continue"
          disabled={isPending}
          variant="outline"
        >
          Continue without them
        </Button>
      </div>
    </section>
  );
}
