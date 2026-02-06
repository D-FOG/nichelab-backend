export const baseSpec = {
  openapi: "3.0.0",
  info: {
    title: "Wamze API",
    version: "1.0.0",
    description: "API documentation for Wamze",
  },
  servers: [
    {
      url: "",
      description: "Default server",
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [],
};

function mergeObjects(target = {}, source = {}) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof out[key] === "object"
    ) {
      out[key] = mergeObjects(out[key], source[key]);
    } else if (Array.isArray(source[key]) && Array.isArray(out[key])) {
      out[key] = [...out[key], ...source[key]];
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

export function getSpec(...specs) {
  const spec = JSON.parse(JSON.stringify(baseSpec));
  for (const s of specs) {
    if (!s) continue;
    spec.paths = mergeObjects(spec.paths || {}, s.paths || {});
    spec.components = mergeObjects(spec.components || {}, s.components || {});
    if (Array.isArray(s.tags)) spec.tags = [...spec.tags, ...s.tags];
  }
  // remove duplicate tags by name
  const seen = new Set();
  spec.tags = (spec.tags || []).filter((t) => {
    if (!t || !t.name) return false;
    if (seen.has(t.name)) return false;
    seen.add(t.name);
    return true;
  });
  return spec;
}

export default {
  baseSpec,
  getSpec,
};
