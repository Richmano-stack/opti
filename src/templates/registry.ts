import type { ComponentType } from "react";

import { MinimalTemplate } from "@/templates/minimal-template";
import { ModernTemplate } from "@/templates/modern-template";
import type { ResumeData } from "@/templates/types";

export const templateIds = ["modern", "minimal"] as const;

export type TemplateId = (typeof templateIds)[number];

export type TemplateComponent = ComponentType<{ resume: ResumeData }>;

export type TemplateDefinition = {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  Component: TemplateComponent;
};

const templates: Record<TemplateId, TemplateDefinition> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Accent header with the role history on the left and skills beside it.",
    thumbnail: "/templates/modern.svg",
    Component: ModernTemplate,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Single column with tight type and rules, suited to an ATS read.",
    thumbnail: "/templates/minimal.svg",
    Component: MinimalTemplate,
  },
};

export function isTemplateId(id: string): id is TemplateId {
  return templateIds.some((templateId) => templateId === id);
}

export function getTemplate(id: string): TemplateDefinition {
  if (!isTemplateId(id)) {
    throw new Error(`Unknown resume template: ${id}`);
  }
  return templates[id];
}

export function listTemplates(): TemplateDefinition[] {
  return templateIds.map((id) => templates[id]);
}
