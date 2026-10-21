import { lstatSync, realpathSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

/**
 * Conservative physical-path policy for repository-managed files.
 *
 * The policy rejects symbolic links and Windows junctions anywhere beneath a
 * managed root. It never claims to protect against a hostile process swapping
 * paths concurrently; callers should re-check immediately before a mutation.
 */

export function toDisplayPath(root, target) {
  const rel = relative(root, target);
  if (!rel) return ".";
  return rel.split(sep).join("/");
}

export function isInside(root, target) {
  const rel = relative(root, target);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
}

export function canonicalDirectory(path, label = "directory") {
  let stats;
  try {
    stats = lstatSync(path);
  } catch {
    return { ok: false, error: `${label} does not exist: ${path}` };
  }
  if (stats.isSymbolicLink()) {
    return { ok: false, error: `${label} must not be a symbolic link or junction: ${path}` };
  }
  if (!stats.isDirectory()) {
    return { ok: false, error: `${label} must be a directory: ${path}` };
  }
  try {
    return { ok: true, path: realpathSync.native(path) };
  } catch (error) {
    return { ok: false, error: `${label} cannot be resolved (${error.code ?? error.message}): ${path}` };
  }
}

/**
 * Inspect every existing component between a canonical managed root and a
 * target. `kind` is "file" or "directory". Missing targets are rejected unless
 * `allowMissing` is true.
 */
export function inspectManagedPath(root, target, { label = "managed path", kind = "file", allowMissing = false } = {}) {
  const absolute = resolve(target);
  const display = toDisplayPath(root, absolute);

  if (!isInside(root, absolute)) {
    return { ok: false, error: `${label} is outside the managed root: ${absolute}` };
  }

  const parts = relative(root, absolute).split(sep).filter(Boolean);
  let current = root;

  for (let index = 0; index < parts.length; index += 1) {
    current = join(current, parts[index]);
    const isLast = index === parts.length - 1;
    let stats;

    try {
      stats = lstatSync(current);
    } catch (error) {
      if (error.code === "ENOENT" && allowMissing) {
        return { ok: true, missing: true, path: absolute, display };
      }
      return { ok: false, error: `${label} is missing or inaccessible: ${toDisplayPath(root, current)}` };
    }

    if (stats.isSymbolicLink()) {
      return {
        ok: false,
        error: `${label} traverses a symbolic link or junction at ${toDisplayPath(root, current)}`,
      };
    }

    if (!isLast && !stats.isDirectory()) {
      return {
        ok: false,
        error: `${label} traverses a non-directory entry at ${toDisplayPath(root, current)}`,
      };
    }

    if (isLast) {
      if (kind === "file" && !stats.isFile()) {
        return { ok: false, error: `${label} must be a regular file: ${display}` };
      }
      if (kind === "directory" && !stats.isDirectory()) {
        return { ok: false, error: `${label} must be a directory: ${display}` };
      }
    }
  }

  if (kind === "directory" && parts.length === 0) {
    return { ok: true, path: root, display: "." };
  }

  try {
    const real = realpathSync.native(absolute);
    if (!isInside(root, real)) {
      return { ok: false, error: `${label} resolves outside the managed root: ${display}` };
    }
    return { ok: true, path: real, display };
  } catch (error) {
    return { ok: false, error: `${label} cannot be resolved (${error.code ?? error.message}): ${display}` };
  }
}

/**
 * Enumerate directory entries without following links. Each entry is described
 * as regular-file, directory, link or other so callers can fail closed.
 */
export function describeEntry(directory, entry) {
  const absolute = join(directory, entry.name);
  let stats;
  try {
    stats = lstatSync(absolute);
  } catch {
    return { name: entry.name, absolute, kind: "inaccessible" };
  }
  if (stats.isSymbolicLink()) return { name: entry.name, absolute, kind: "link" };
  if (stats.isDirectory()) return { name: entry.name, absolute, kind: "directory" };
  if (stats.isFile()) return { name: entry.name, absolute, kind: "file" };
  return { name: entry.name, absolute, kind: "other" };
}
