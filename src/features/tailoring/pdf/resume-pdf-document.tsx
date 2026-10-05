import { Document, Page, Text, View, pdf } from "@react-pdf/renderer";

import { resumePdfStyles as styles } from "@/features/tailoring/pdf/resume-pdf-styles";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

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

function hasEntries<T>(entries: T[] | undefined): entries is T[] {
  return Boolean(entries && entries.length > 0);
}

function buildContactLine(resume: OptimizedResume): string {
  return [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.portfolio,
  ]
    .filter((value): value is string => Boolean(value))
    .map(pdfText)
    .join(" | ");
}

function SectionLabel({ children, minPresenceAhead }: { children: string; minPresenceAhead: number }) {
  return (
    <View style={styles.sectionHeading} minPresenceAhead={minPresenceAhead}>
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <>
      {bullets.map((bullet, index) => (
        <View key={`${index}-${bullet}`} style={styles.bulletRow} wrap={false}>
          <View style={styles.bulletMark} />
          <Text style={styles.bulletText} orphans={2} widows={2}>
            {pdfText(bullet)}
          </Text>
        </View>
      ))}
    </>
  );
}

export function createResumePdfDocument(resume: OptimizedResume): PdfDocumentElement {
  const contactLine = buildContactLine(resume);
  const documentTitle = `${pdfText(resume.contact.name)} - Resume`;
  const headline = resume.headline ?? resume.experience[0]?.title;

  return (
    <Document title={documentTitle} author={pdfText(resume.contact.name)}>
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{pdfText(resume.contact.name)}</Text>
          {headline ? <Text style={styles.headline}>{pdfText(headline)}</Text> : null}
          {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
        </View>

        <View style={styles.section}>
          <SectionLabel minPresenceAhead={24}>Professional Summary</SectionLabel>
          <Text style={styles.bodyText} orphans={2} widows={2}>
            {pdfText(resume.summary)}
          </Text>
        </View>

        <View style={styles.section}>
          <SectionLabel minPresenceAhead={36}>Experience</SectionLabel>
          {resume.experience.map((entry) => (
            <View
              key={`${entry.company}-${entry.title}-${entry.dates}`}
              style={styles.experienceEntry}
              minPresenceAhead={64}
              wrap={!shouldKeepExperienceTogether(entry.bullets)}
            >
              <View style={styles.roleHeader}>
                <Text style={styles.roleTitle}>{pdfText(entry.title)}</Text>
                <Text style={styles.roleDates}>{pdfText(entry.dates)}</Text>
              </View>
              <Text style={styles.company}>{pdfText(entry.company)}</Text>
              <BulletList bullets={entry.bullets} />
            </View>
          ))}
        </View>

        {hasEntries(resume.skills) ? (
          <View style={styles.section}>
            <SectionLabel minPresenceAhead={24}>Skills</SectionLabel>
            <Text style={styles.skillsText} orphans={2} widows={2}>
              {resume.skills.map(pdfText).join("  ·  ")}
            </Text>
          </View>
        ) : null}

        {hasEntries(resume.education) ? (
          <View style={styles.section}>
            <SectionLabel minPresenceAhead={36}>Education</SectionLabel>
            {resume.education.map((entry) => (
              <View
                key={`${entry.institution}-${entry.degree}`}
                style={styles.educationEntry}
                wrap={false}
              >
                <View style={styles.roleHeader}>
                  <Text style={styles.degree}>{pdfText(entry.degree)}</Text>
                  {entry.dates ? <Text style={styles.roleDates}>{pdfText(entry.dates)}</Text> : null}
                </View>
                <Text style={styles.educationMeta}>{pdfText(entry.institution)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {hasEntries(resume.certifications) ? (
          <View style={styles.section}>
            <SectionLabel minPresenceAhead={36}>Certifications</SectionLabel>
            {resume.certifications.map((entry) => (
              <View key={`${entry.name}-${entry.issuer ?? ""}`} style={styles.educationEntry} wrap={false}>
                <View style={styles.roleHeader}>
                  <Text style={styles.degree}>{pdfText(entry.name)}</Text>
                  {entry.dates ? <Text style={styles.roleDates}>{pdfText(entry.dates)}</Text> : null}
                </View>
                {entry.issuer ? <Text style={styles.educationMeta}>{pdfText(entry.issuer)}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {hasEntries(resume.projects) ? (
          <View style={styles.section}>
            <SectionLabel minPresenceAhead={36}>Projects</SectionLabel>
            {resume.projects.map((entry) => (
              <View key={`${entry.name}-${entry.dates ?? ""}`} style={styles.experienceEntry} wrap={false}>
                <View style={styles.roleHeader}>
                  <Text style={styles.roleTitle}>{pdfText(entry.name)}</Text>
                  {entry.dates ? <Text style={styles.roleDates}>{pdfText(entry.dates)}</Text> : null}
                </View>
                <BulletList bullets={entry.bullets} />
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export function ResumePdfDocument({ resume }: ResumePdfDocumentProps): PdfDocumentElement {
  return createResumePdfDocument(resume);
}
