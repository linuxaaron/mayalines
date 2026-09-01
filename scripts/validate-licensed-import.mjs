import { readFile } from "node:fs/promises";

const input = JSON.parse(await readFile("data/quotes.licensed.json", "utf8"));
const allowedLicenses = new Set(["CC0-1.0", "CC-BY-4.0", "PUBLIC-DOMAIN"]);
const required = ["id", "quote", "author", "category", "source", "sourceName", "sourceCommit", "license", "licenseUrl", "rightsJurisdiction", "authorDeathYear", "verificationStatus"];
const errors = [];
const seen = new Set();

if (!Array.isArray(input)) errors.push("Licensed import must be a JSON array.");
for (const [index, quote] of (Array.isArray(input) ? input : []).entries()) {
  const label = `record ${index + 1}`;
  for (const field of required) if (quote?.[field] === undefined || quote[field] === "") errors.push(`${label}: missing ${field}`);
  if (!/^licensed-[a-z0-9_-]{1,100}$/i.test(String(quote?.id ?? ""))) errors.push(`${label}: id must start with licensed-`);
  if (!/^https:\/\//.test(String(quote?.source ?? "")) || !/^https:\/\//.test(String(quote?.licenseUrl ?? ""))) errors.push(`${label}: source and licenseUrl must use HTTPS`);
  if (!allowedLicenses.has(quote?.license)) errors.push(`${label}: unsupported license`);
  if (!Number.isInteger(quote?.authorDeathYear) || quote.authorDeathYear > new Date().getUTCFullYear() - 70) errors.push(`${label}: authorDeathYear does not meet the 70-year review rule`);
  if (quote?.verificationStatus !== "verified") errors.push(`${label}: verificationStatus must be verified`);
  if (quote?.attributionStatus !== "verified" || quote?.copyrightStatus !== "cleared" || quote?.indexable !== true) errors.push(`${label}: indexable records require cleared, verified rights metadata`);
  const key = String(quote?.quote ?? "").trim().toLowerCase();
  if (seen.has(key)) errors.push(`${label}: duplicate quote text`); else seen.add(key);
}
if (errors.length) { for (const error of errors) console.error(`ERROR: ${error}`); process.exit(1); }
console.log(`Licensed import gate: ${input.length} verified records accepted.`);
