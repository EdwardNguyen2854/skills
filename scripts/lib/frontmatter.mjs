import { parseDocument } from "yaml";

/**
 * Parse strict YAML frontmatter for a skill file.
 *
 * Supported constructs are ordinary YAML mappings with string, number,
 * boolean, null, sequence and mapping values. Duplicate keys, unclosed
 * quotes, unknown tags and other invalid YAML are reported rather than
 * repaired. The body is returned with LF endings for stable checks.
 */
export function parseFrontmatter(content, filePath = "SKILL.md") {
  const normalized = String(content).replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!match) {
    return { fields: {}, body: normalized, error: `${filePath}: missing YAML frontmatter` };
  }

  let document;
  try {
    document = parseDocument(match[1], {
      strict: true,
      uniqueKeys: true,
      prettyErrors: false,
      version: "1.2",
    });
  } catch (error) {
    return {
      fields: {},
      body: normalized.slice(match[0].length).replace(/^\n/, ""),
      error: `${filePath}: invalid YAML frontmatter (${error.message})`,
    };
  }

  if (document.errors.length > 0) {
    const detail = document.errors
      .map((error) => error.message.replace(/\s+/g, " ").trim())
      .join("; ");
    return {
      fields: {},
      body: normalized.slice(match[0].length).replace(/^\n/, ""),
      error: `${filePath}: invalid YAML frontmatter (${detail})`,
    };
  }

  const unresolvedTags = document.warnings.filter((warning) => /Unresolved tag/i.test(warning.message));
  if (unresolvedTags.length > 0) {
    return {
      fields: {},
      body: normalized.slice(match[0].length).replace(/^\n/, ""),
      error: `${filePath}: unsupported YAML tag (${unresolvedTags[0].message.replace(/\s+/g, " ").trim()})`,
    };
  }

  let value;
  try {
    value = document.toJS({ maxAliasCount: 0 });
  } catch (error) {
    return {
      fields: {},
      body: normalized.slice(match[0].length).replace(/^\n/, ""),
      error: `${filePath}: invalid YAML frontmatter (${error.message})`,
    };
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      fields: {},
      body: normalized.slice(match[0].length).replace(/^\n/, ""),
      error: `${filePath}: frontmatter must be a YAML mapping`,
    };
  }

  const fields = {};
  for (const [key, fieldValue] of Object.entries(value)) {
    fields[key] = fieldValue;
  }

  return {
    fields,
    body: normalized.slice(match[0].length).replace(/^\n/, ""),
    error: null,
  };
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Validate the supported skill-metadata shape. This is a repository schema,
 * not a second frontmatter parser.
 */
export function validateSkillFrontmatter(fields, filePath) {
  const errors = [];

  if (typeof fields.name !== "string" || fields.name.length === 0) {
    errors.push(`${filePath}: frontmatter name must be a non-empty string`);
  } else if (fields.name.length > 64) {
    errors.push(`${filePath}: frontmatter name is ${fields.name.length} characters (max 64)`);
  }

  if (typeof fields.description !== "string" || fields.description.trim().length === 0) {
    errors.push(`${filePath}: frontmatter description must be a non-empty string`);
  } else if (fields.description.length > 1024) {
    errors.push(`${filePath}: description is ${fields.description.length} characters (max 1024)`);
  }

  if (fields.metadata !== undefined) {
    if (!isPlainObject(fields.metadata)) {
      errors.push(`${filePath}: metadata must be a mapping`);
    } else {
      for (const [key, value] of Object.entries(fields.metadata)) {
        if (typeof value !== "string") {
          errors.push(`${filePath}: metadata.${key} must be a string`);
        }
      }
      if (fields.metadata["required-skills"] !== undefined) {
        const required = fields.metadata["required-skills"].split(/\s+/).filter(Boolean);
        if (required.length === 0) {
          errors.push(`${filePath}: metadata.required-skills must name at least one skill`);
        }
        for (const dependency of required) {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dependency)) {
            errors.push(`${filePath}: metadata.required-skills contains an invalid name ${JSON.stringify(dependency)}`);
          }
          if (dependency === fields.name) {
            errors.push(`${filePath}: metadata.required-skills cannot include the skill itself`);
          }
        }
      }
      if (fields.metadata["workflow-contract"] !== undefined && !/^\d+$/.test(fields.metadata["workflow-contract"])) {
        errors.push(`${filePath}: metadata.workflow-contract must be a numeric string`);
      }
    }
  }

  return errors;
}
