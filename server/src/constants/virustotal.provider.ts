import type { ThreatIntelProvider, IocType } from "./provider.interface";

// 1 : virustotal response------------------------------------
interface VirusTotalResponse {
  data: {
    attributes: {
      last_analysis_stats: {
        malicious: number;
        suspicious: number;
        undetected: number;
        harmless: number;
        timeout: number;
      };
      reputation?: number;
      tags?: string[];
    };
  };
}

// 2 : normalized response------------------------------------------------------------
interface NormalizedResponse {
  provider_name: string;
  verdict: "benign" | "suspicious" | "malicious";
  score: number;
  tags?: string[];
  confidence?: number;
  summary?: string;
}

class VirusTotalProvider implements ThreatIntelProvider<NormalizedResponse> {
  readonly name = "virustotal";
  readonly supportedIocTypes: ReadonlyArray<IocType> = [
    "ip",
    "domain",
    "url",
    "hash",
  ];

  private apiKey = process.env.VIRUSTOTAL_API_KEY;
  private baseUrl =
    process.env.VIRUSTOTAL_BASE_URL || "https://www.virustotal.com/api/v3";

  async query(ioc: string, type: IocType): Promise<NormalizedResponse> {
    if (!this.apiKey) {
      return this.fail("VirusTotal API key not configured");
    }

    try {
      const endpoint = this.getEndpoint(ioc, type);
      if (!endpoint) {
        return this.fail("Unsupported IOC type");
      }
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "x-apikey": this.apiKey,
          accept: "application/json",
        },
      });

      if (response.status === 429) {
        return this.fail("Rate limit exceeded");
      }

      if (!response.ok) {
        return this.fail(`API error: ${response.status}`);
      }
      const data = (await response.json()) as VirusTotalResponse;
      return this.normalizeResponse(data);
    } catch {
      return this.fail("VirusTotal query failed");
    }
  }
  //----get endpoint based on ioc type-------------------------------------------------------
  private getEndpoint(ioc: string, type: IocType): string | null {
    switch (type) {
      case "ip":
        return `/ip_addresses/${ioc}`;
      case "domain":
        return `/domains/${ioc}`;
      case "hash":
        return `/files/${ioc}`;
      case "url":
        return `/urls/${this.encodeUrl(ioc)}`;
      default:
        return null;
    }
  }

  private encodeUrl(url: string): string {
    return Buffer.from(url).toString("base64url");
  }

  //----normalize response---------------------------------------------------------------------
  private normalizeResponse(data: VirusTotalResponse): NormalizedResponse {
    const stats = data.data?.attributes?.last_analysis_stats;
    if (!stats) {
      return this.fail("Incomplete VirusTotal response");
    }
    const total =
      stats.malicious +
      stats.suspicious +
      stats.undetected +
      stats.harmless +
      stats.timeout;
    const maliciousCount = stats.malicious;
    const suspiciousCount = stats.suspicious;

    let verdict: NormalizedResponse["verdict"] = "benign";
    if (maliciousCount > 0) verdict = "malicious";
    else if (suspiciousCount > 0) verdict = "suspicious";

    const score = total > 0 ? Math.round((maliciousCount / total) * 100) : 0;
    return {
      provider_name: this.name,
      verdict,
      score,
      tags: data.data.attributes.tags,
      confidence: Math.min(100, total),
      summary: `Malicious: ${maliciousCount}, Suspicious: ${suspiciousCount}, Harmless: ${stats.harmless}, Undetected: ${stats.undetected}, Timeout: ${stats.timeout}`,
    };
  }

  //FAILURE handler--------------------------------------------------------------------------------------------
  private fail(reason: string): NormalizedResponse {
    return {
      provider_name: this.name,
      verdict: "benign",
      score: 0,
      confidence: 0,
      summary: reason,
    };
  }
}

export { VirusTotalProvider };
