import { BenefitsSection } from "./benefits-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingNavbar } from "./landing-navbar";
import { PricingSection } from "./pricing-section";
import { TestimonialsSection } from "./testimonials-section";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <div id="benefits">
          <BenefitsSection />
        </div>
        <HowItWorksSection />
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
      </main>
      <footer className="border-t border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-bold text-foreground">Opti</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Opti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
