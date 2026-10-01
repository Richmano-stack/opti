export const openRouterResumeJsonSchema = {
  type: "object", additionalProperties: false,
  required: ["contact", "headline", "summary", "skills", "experience", "education", "certifications", "projects", "matchNote"],
  properties: {
    contact: { type: "object", additionalProperties: false,
      required: ["name", "email", "phone", "location", "linkedin", "portfolio"],
      properties: {
        name: { type: "string", minLength: 1, maxLength: 200 },
        email: { type: ["string", "null"], maxLength: 320 },
        phone: { type: ["string", "null"], maxLength: 100 },
        location: { type: ["string", "null"], maxLength: 200 },
        linkedin: { type: ["string", "null"], maxLength: 500 },
        portfolio: { type: ["string", "null"], maxLength: 500 },
      } },
    headline: { type: "string", minLength: 1, maxLength: 120 },
    summary: { type: "string", minLength: 1, maxLength: 2000 },
    skills: { type: "array", minItems: 1, maxItems: 12, items: { type: "string", minLength: 1, maxLength: 100 } },
    experience: { type: "array", minItems: 1, maxItems: 30,
      items: { type: "object", additionalProperties: false,
        required: ["company", "title", "dates", "bullets"],
        properties: {
          company: { type: "string", minLength: 1, maxLength: 200 },
          title: { type: "string", minLength: 1, maxLength: 200 },
          dates: { type: "string", minLength: 1, maxLength: 100 },
          bullets: { type: "array", minItems: 1, maxItems: 6, items: { type: "string", minLength: 1, maxLength: 500 } },
        } } },
    education: { type: "array", minItems: 0, maxItems: 10,
      items: { type: "object", additionalProperties: false,
        required: ["institution", "degree", "dates"],
        properties: {
          institution: { type: "string", minLength: 1, maxLength: 200 },
          degree: { type: "string", minLength: 1, maxLength: 200 },
          dates: { type: ["string", "null"], maxLength: 100 },
        } } },
    certifications: { type: "array", minItems: 0, maxItems: 8,
      items: { type: "object", additionalProperties: false,
        required: ["name", "issuer", "dates"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 200 },
          issuer: { type: ["string", "null"], maxLength: 200 },
          dates: { type: ["string", "null"], maxLength: 100 },
        } } },
    projects: { type: "array", minItems: 0, maxItems: 6,
      items: { type: "object", additionalProperties: false,
        required: ["name", "dates", "bullets"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 200 },
          dates: { type: ["string", "null"], maxLength: 100 },
          bullets: { type: "array", minItems: 1, maxItems: 4, items: { type: "string", minLength: 1, maxLength: 500 } },
        } } },
    matchNote: { type: "object", additionalProperties: false,
      required: ["strengths", "gaps"],
      properties: {
        strengths: { type: "string", minLength: 1, maxLength: 400 },
        gaps: { type: "string", minLength: 1, maxLength: 400 },
      } },
  },
} as const;

const geminiUnsupportedKeywords = new Set([
  "additionalProperties",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
]);

function isSchemaRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableString(type: unknown) {
  return Array.isArray(type) && type.includes("string") && type.includes("null");
}

function adaptSchemaForGemini(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(adaptSchemaForGemini);
  if (!isSchemaRecord(schema)) return schema;

  const adapted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (geminiUnsupportedKeywords.has(key)) continue;
    adapted[key] = adaptSchemaForGemini(value);
  }

  if (isNullableString(schema.type)) adapted.type = "string";

  const properties = schema.properties;
  if (Array.isArray(schema.required) && isSchemaRecord(properties)) {
    adapted.required = schema.required.filter((name) => {
      if (typeof name !== "string") return false;
      const property = properties[name];
      return !(isSchemaRecord(property) && isNullableString(property.type));
    });
  }

  return adapted;
}

export const geminiResumeJsonSchema = adaptSchemaForGemini(openRouterResumeJsonSchema);
