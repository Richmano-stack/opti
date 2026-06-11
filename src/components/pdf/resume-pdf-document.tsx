import { Document, Page, Text, View, pdf } from "@react-pdf/renderer";
import type { OptimizedResume } from "@/services/ai/types";
import { resumePdfStyles as styles } from "@/components/pdf/resume-pdf-styles";

type ResumePdfDocumentProps = {
  resume: OptimizedResume;
};

type PdfDocumentElement = NonNullable<Parameters<typeof pdf>[0]>;

function buildContactLine(resume: OptimizedResume): string {
  const { contact } = resume;
  return [contact.email, contact.phone, contact.location].filter(Boolean).join(" · ");
}

export function createResumePdfDocument(resume: OptimizedResume): PdfDocumentElement {
  const contactLine = buildContactLine(resume);
  const skillsLine = resume.skills.join(", ");

  return (
    <Document title={`${resume.contact.name} - Resume`} author={resume.contact.name}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{resume.contact.name}</Text>
          {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.bodyText}>{resume.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skillsText}>{skillsLine}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((entry) => (
            <View
              key={`${entry.company}-${entry.title}-${entry.dates}`}
              style={styles.experienceEntry}
            >
              <Text style={styles.jobTitle}>{entry.title}</Text>
              <Text style={styles.jobMeta}>
                {entry.company} · {entry.dates}
              </Text>
              {entry.bullets.map((bullet) => (
                <Text key={bullet} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resume.education.map((entry) => (
            <View
              key={`${entry.institution}-${entry.degree}`}
              style={styles.educationEntry}
            >
              <Text style={styles.degree}>{entry.degree}</Text>
              <Text style={styles.educationMeta}>
                {entry.institution}
                {entry.dates ? ` · ${entry.dates}` : ""}
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
