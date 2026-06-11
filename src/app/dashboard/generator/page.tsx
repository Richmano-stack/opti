import { ResumeGeneratorWizard } from "@/components/generator/resume-generator-wizard";

export default function GeneratorPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <ResumeGeneratorWizard />
    </main>
  );
}
