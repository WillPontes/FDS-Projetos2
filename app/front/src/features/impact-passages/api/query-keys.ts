export const impactKeys = {
  all: () => ["impact"] as const,
  summary: () => [...impactKeys.all(), "summary"] as const,
  passages: () => [...impactKeys.all(), "passages"] as const,
};