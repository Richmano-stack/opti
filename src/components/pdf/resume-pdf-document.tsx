import { Document, Page, Text, View, pdf } from "@react-pdf/renderer";

import { resumePdfStyles as styles } from "@/components/pdf/resume-pdf-styles";
import type { OptimizedResume } from "@/services/ai/types";

type ResumePdfDocumentProps = {
  resume: OptimizedResume;
};

type PdfDocumentElement = NonNullable<Parameters<typeof pdf>[0]>;

function pdfText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\u2022/g, "-");
}

function shouldKeepExperienceTogether(bullets: string[]): boolean {
  return bullets.reduce((length, bullet) => length + bullet.length, 0) <= 2_400;
}

function buildContactLine(resume: OptimizedResume): string {
  return [resume.contact.email, resume.contact.phone, resume.contact.location]
    .filter((value): value is string => Boolean(value))
    .map(pdfText)
    .join(" | ");
}

export function createResumePdfDocument(resume: OptimizedResume): PdfDocumentElement {
  const contactLine = buildContactLine(resume);
  const documentTitle = `${pdfText(resume.contact.name)} - Resume`;

  return (
    <Document title={documentTitle} author={pdfText(resume.contact.name)}>
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{pdfText(resume.contact.name)}</Text>
          {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={24}>
            Professional Summary
          </Text>
          <Text style={styles.bodyText} orphans={2} widows={2}>
            {pdfText(resume.summary)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={24}>Skills</Text>
          <Text style={styles.skillsText} orphans={2} widows={2}>
            {resume.skills.map(pdfText).join(", ")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={36}>Experience</Text>
          {resume.experience.map((entry) => (
            <View
              key={`${entry.company}-${entry.title}-${entry.dates}`}
              style={styles.experienceEntry}
              minPresenceAhead={64}
              wrap={!shouldKeepExperienceTogether(entry.bullets)}
            >
              <Text style={styles.jobTitle}>{pdfText(entry.title)}</Text>
              <Text style={styles.jobMeta}>
                {pdfText(entry.company)} | {pdfText(entry.dates)}
              </Text>
              {entry.bullets.map((bullet, index) => (
                <Text key={`${index}-${bullet}`} style={styles.bullet} orphans={2} widows={2}>
                  - {pdfText(bullet)}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={36}>Education</Text>
          {resume.education.map((entry) => (
            <View
              key={`${entry.institution}-${entry.degree}`}
              style={styles.educationEntry}
              wrap={false}
            >
              <Text style={styles.degree}>{pdfText(entry.degree)}</Text>
              <Text style={styles.educationMeta}>
                {pdfText(entry.institution)}
                {entry.dates ? ` | ${pdfText(entry.dates)}` : ""}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export function ResumePdfDocument({ resume }: ResumePdfDocumentProps): PdfDocumentElement {
  return createResumePdfDocument(resume);
}
