import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowCard } from "./glow-card";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  span?: "wide" | "tall" | "default";
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I went from zero callbacks to three interviews in two weeks. The keyword insights alone are worth it.",
    name: "Alex Jonas",
    role: "Software Engineer",
    avatar: "bg-blue-500",
    span: "wide",
  },
  {
    quote:
      "The AI rewrites turned my vague bullets into quantified wins. Recruiters actually read my resume now.",
    name: "Priya Sharma",
    role: "Product Manager",
    avatar: "bg-violet-500",
  },
  {
    quote:
      "Finally passed ATS at a Fortune 500 company. The scoring feature showed me exactly what was missing.",
    name: "Marcus Chen",
    role: "Data Analyst",
    avatar: "bg-cyan-500",
    span: "tall",
  },
  {
    quote:
      "Switched careers and needed a total rewrite. Opti matched my transferable skills perfectly.",
    name: "Jordan Lee",
    role: "UX Designer",
    avatar: "bg-indigo-500",
  },
  {
    quote:
      "Clean templates, instant exports, and real results. Landed my dream role in healthcare tech.",
    name: "Sofia Reyes",
    role: "Healthcare Admin",
    avatar: "bg-emerald-500",
    span: "wide",
  },
  {
    quote:
      "Used it for every application this month. The tailored job matching saves hours of manual editing.",
    name: "David Okonkwo",
    role: "Marketing Lead",
    avatar: "bg-amber-500",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <GlowCard
      className={cn(
        "flex flex-col justify-between",
        testimonial.span === "wide" && "sm:col-span-2",
        testimonial.span === "tall" && "sm:row-span-2",
      )}
    >
      <div>
        <StarRating />
        <p className="mt-4 text-base font-semibold leading-snug text-foreground sm:text-lg">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div
          className={cn(
            "size-10 shrink-0 rounded-full",
            testimonial.avatar,
          )}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </GlowCard>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute right-0 top-1/3 h-[450px] w-[550px] rounded-full bg-blue-600/10 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Loved by job seekers
        </h2>

        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
