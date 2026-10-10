import { getTemplate, type TemplateId } from "@/templates/registry";
import { ResumeSheet } from "@/templates/resume-sheet";
import type { ResumeData } from "@/templates/types";

const printPageStyle = `
@page { size: 8.5in 11in; margin: 0; }
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: #ffffff !important;
  height: auto !important;
  min-height: 0 !important;
  overflow: visible !important;
}
[data-resume-page] {
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
`;

export function ResumePrintDocument({
  resume,
  templateId,
}: {
  resume: ResumeData;
  templateId: TemplateId;
}) {
  const Template = getTemplate(templateId).Component;

  return (
    <>
      <style>{printPageStyle}</style>
      <ResumeSheet fitKey={`${templateId}:${JSON.stringify(resume)}`}>
        <Template resume={resume} />
      </ResumeSheet>
    </>
  );
}
