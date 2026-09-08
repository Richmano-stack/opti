import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ActionGroup, ContentContainer, DocumentPreviewCard, FormSection, HorizonDialog, PageHeader, ScrollRegion, SectionHeader } from "./page-composition";

describe("Horizon page composition", () => {
  it("renders a responsive page hierarchy and document preview", () => {
    const html = renderToStaticMarkup(
      <ContentContainer size="narrow">
        <PageHeader actions={<button type="button">Tailor for a role</button>} description="Use one source document for every application." eyebrow="Workspace" title="Master résumé" />
        <SectionHeader action={<button type="button">Edit</button>} description="A concise overview of your source document." title="Your document" />
        <DocumentPreviewCard metadata="Updated today" summary="Your saved source document." title="Master résumé" />
        <FormSection description="This is saved to your account." title="Document details"><input aria-label="Resume title" /></FormSection>
      </ContentContainer>,
    );
    expect(html).toContain("Master résumé");
    expect(html).toContain("Tailor for a role");
    expect(html).toContain("Document preview");
    expect(html).toContain('aria-label="Resume title"');
  });

  it("renders an intentional scroll region and accessible open dialog", () => {
    const html = renderToStaticMarkup(
      <><ScrollRegion aria-label="Scrollable resume" className="max-h-72">Long document content</ScrollRegion><HorizonDialog description="Edit your saved source document." isOpen onClose={() => undefined} title="Edit master résumé"><p>Dialog content</p></HorizonDialog><ActionGroup><button type="button">Save changes</button></ActionGroup></>,
    );
    expect(html).toContain('aria-label="Scrollable resume"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Close dialog"');
    expect(html).toContain("Save changes");
  });
});
