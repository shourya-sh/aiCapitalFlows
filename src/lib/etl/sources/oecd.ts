import { EMPTY_RESULT, type IngestionSource } from "../types";

/**
 * OECD / government AI investment connector (stub). Ingests national and
 * supranational AI investment programs (OECD.AI, EU InvestAI, UK AI Action Plan,
 * Gulf sovereign programs) and models them as `government` funding entities.
 *
 * To go live: pull the OECD.AI investment datasets + government press releases,
 * then emit `government` entities and `grant` / `partnership` flows.
 */
export const oecdSource: IngestionSource = {
  id: "oecd",
  label: "OECD & Government Reports",
  description: "Sovereign and supranational AI investment programs and commitments.",
  docsUrl: "https://oecd.ai/en/data",
  live: false,
  async fetch() {
    return EMPTY_RESULT;
  },
};
