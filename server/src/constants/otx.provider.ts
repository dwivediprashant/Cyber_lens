import type { ThreatIntelProvider, IocType } from "./provider.interface";

interface OTXResponse {
  indicator: string;
  type: string;
  reputation?: number;
  pulse_info?: {
    count: number;
    pulses: OTXPulse[];
  };
}

interface OTXPulse {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  created: string;
  modified: string;
  author_name?: string;
  tlp?: string;
}

interface NormalizedResponse {
  provider_name: string;
  verdict: "benign" | "suspicious" | "malicious";
  score: number;
  tags?: string[];
  confidence?: number;
  summary?: string;
}

class OTXProvider implements ThreatIntelProvider<NormalizedResponse> {
  readonly name = "otx";

  readonly supportedIocTypes: ReadonlyArray<IocType> = [
    "ip",
    "domain",
    "url",
    "hash",
  ];

  private apiKey = process.env.OTX_API_KEY;
  private baseUrl =
    process.env.OTX_BASE_URL || "https://otx.alienvault.com/api/v1";

  async query(ioc: string, type: IocType): Promise<NormalizedResponse> {
    if (!this.apiKey) {
      return this.fail("OTX API key not configured");
    }

    try {
      const endpoint = this.getEndpoint(ioc, type);
      if (!endpoint) {
        return this.fail("Unsupported IOC type");
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "X-OTX-API-KEY": this.apiKey,
          accept: "application/json",
        },
      });

      if (response.status === 429) {
        return this.fail("Rate limit exceeded");
      }

      if (!response.ok) {
        return this.fail(`API error: ${response.status}`);
      }

      const data = (await response.json()) as OTXResponse;
      return this.normalizeResponse(data);
    } catch {
      return this.fail("OTX query failed");
    }
  }

  //----get endpoint based on ioc type-------------------------------------------------------
  private getEndpoint(ioc: string, type: IocType): string | null {
    switch (type) {
      case "ip":
        return `/indicators/IPv4/${ioc}/general`;
      case "domain":
        return `/indicators/domain/${ioc}/general`;
      case "hash":
        return `/indicators/file/${ioc}/general`;
      case "url":
        return `/indicators/url/${encodeURIComponent(ioc)}/general`;
      default:
        return null;
    }
  }

  //----normalize response---------------------------------------------------------------------
  private normalizeResponse(data: OTXResponse): NormalizedResponse {
    const pulseInfo = data.pulse_info;

    if (!pulseInfo || pulseInfo.count === 0) {
      return {
        provider_name: this.name,
        verdict: "benign",
        score: 0,
        tags: [],
        confidence: 0,
        summary: "This indicator is not reported in any known threat reports.",
      };
    }

    const pulseCount = pulseInfo.count;
    const pulses = pulseInfo.pulses || [];

    let verdict: NormalizedResponse["verdict"] = "benign";

    if (pulseCount >= 3) {
      verdict = "malicious";
    } else {
      verdict = "suspicious";
    }

    const tags: string[] = [];
    pulses.forEach((pulse) => {
      pulse.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    const score = Math.min(100, pulseCount * 25);

    const summary =
      verdict === "malicious"
        ? `This indicator appears in ${pulseCount} threat reports and is likely dangerous.`
        : `This indicator appears in ${pulseCount} threat reports and should be treated with caution.`;

    return {
      provider_name: this.name,
      verdict,
      score,
      tags,
      confidence: Math.min(100, pulseCount * 25),
      summary,
    };
  }

  private fail(reason: string): NormalizedResponse {
    return {
      provider_name: this.name,
      verdict: "benign",
      score: 0,
      tags: [],
      confidence: 0,
      summary: reason,
    };
  }
}

export { OTXProvider };
