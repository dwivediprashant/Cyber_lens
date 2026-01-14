import { Router } from "express";
import { orchestrateThreatIntelligence } from "../services/iocOrchestrator";
import {
  computeScore,
  type ProviderConfidence,
  type NormalizedProviderResponse,
} from "../services/scoringEngine";
import { OTXProvider } from "../constants/otx.provider";
import { AbuseIPDBProvider } from "../constants/abuseipdb.provider";
import { VirusTotalProvider } from "../constants/virustotal.provider";
import type { IocType } from "../constants/provider.interface";
import type { ProviderExecutionResult } from "../services/providerExecutor";

const router = Router();

function mapToScoringFormat(
  providers: ProviderExecutionResult<any>[],
): ProviderExecutionResult<NormalizedProviderResponse>[] {
  return providers.map((result) => {
    if (result.status !== "success" || !result.data) {
      return result as ProviderExecutionResult<NormalizedProviderResponse>;
    }

    let confidence: ProviderConfidence = "medium";
    if (result.data.confidence !== undefined) {
      if (result.data.confidence >= 70) {
        confidence = "high";
      } else if (result.data.confidence >= 40) {
        confidence = "medium";
      } else {
        confidence = "low";
      }
    }

    const mapped: NormalizedProviderResponse = {
      provider_name: result.data.provider_name || result.provider,
      verdict: result.data.verdict || "unknown",
      confidence: confidence,
      score: result.data.score,
      summary: result.data.summary,
      tags: result.data.tags,
    };

    return {
      ...result,
      data: mapped,
    };
  });
}

router.post("/", async (req, res) => {
  const { ioc, type } = req.body;
  const owner = req.owner;

  if (!ioc || typeof ioc !== "string" || ioc.trim() === "") {
    return res.status(400).json({ error: "Missing or invalid 'ioc' field" });
  }

  let userSelectedType: IocType | undefined;
  if (type && typeof type === "string") {
    userSelectedType = type as IocType;
  }

  try {
    const providerList = [
      new OTXProvider(),
      new AbuseIPDBProvider(),
      new VirusTotalProvider(),
    ];

    const orchestratedResult = await orchestrateThreatIntelligence(
      ioc,
      providerList,
      owner,
      userSelectedType ? { userSelectedType } : {},
    );

    const mappedProviders = mapToScoringFormat(orchestratedResult.providers);

    const scoringResult = computeScore({
      providers: mappedProviders,
    });

    const response = {
      ioc: orchestratedResult.ioc,
      type: orchestratedResult.detectedType,
      score: scoringResult.finalScore,
      verdict: scoringResult.verdict,
      providers: orchestratedResult.providers,
      meta: {
        ...orchestratedResult.meta,
        validation: orchestratedResult.validation,
        scoring: {
          processedProviders: scoringResult.processedProviders,
          warnings: scoringResult.warnings,
          scoringMeta: scoringResult.meta,
        },
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Lookup failed", details: String(error) });
  }
});

export default router;
