import { EMPTY_RESULT, type IngestionSource } from "../types";

/**
 * SEC EDGAR connector (stub). Parses 10-K/10-Q/8-K filings and Form D private
 * placements for public infra/energy entities (NVIDIA, CoreWeave, Constellation)
 * to extract revenue, market cap inputs, and disclosed strategic investments.
 *
 * To go live: query https://data.sec.gov/submissions/CIK##########.json and the
 * XBRL company-concept API, then map financials onto existing entities.
 */
export const secSource: IngestionSource = {
  id: "sec",
  label: "SEC EDGAR",
  description: "Public filings: revenue, market cap inputs, and disclosed strategic stakes.",
  docsUrl: "https://www.sec.gov/edgar/sec-api-documentation",
  live: false,
  async fetch() {
    return EMPTY_RESULT;
  },
};
