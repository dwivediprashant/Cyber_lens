# Threat Scoring & Verdict Model 

## Quick idea (TL;DR)
- We ask several threat-intel providers about an IOC (IP/URL/domain/hash).
- Each provider’s answer is turned into a number. More confident and more trusted providers count more.
- We average the numbers, apply simple safety rules, and map to a verdict: benign, suspicious, or malicious. If nothing came back, we say “inconclusive.”

## What we take in from each provider
- `provider_name`
- `verdict`: malicious | suspicious | benign | unknown
- `confidence`: 0-100 (if missing, assume 50)
- `flags` (optional): sandbox hit, malware family, phishing/brand abuse, C2/infrastructure, heuristics-only, age/prevalence
- `status`: ok | timeout | error (timeouts/errors do not affect the math but are recorded)
- `timestamp` (optional): if the data is old, we trust it less

## How one provider is turned into a number
1) Start with a base score (0 to 1):
   - malicious: 1.00
   - suspicious: 0.65
   - unknown: 0.25
   - benign: 0.05
2) Nudge the base score with flags (then clamp between 0 and 1):
   - +0.10 if sandbox/behavioral evidence exists
   - +0.05 if there are multiple independent detections (family + infra, etc.)
   - +0.05 if the infrastructure is very new/rare and the verdict is malicious/suspicious
   - -0.10 if it is heuristics-only or low-evidence
3) Account for confidence: divide confidence by 100 (default 0.50 if missing).
4) Account for how much we trust the provider (weights are tunable):
   - Tier A (reputable sandbox/AV): 1.2
   - Tier B (standard reputation feed): 1.0
   - Tier C (community/experimental): 0.8
5) Final contribution from this provider:
   - `adjusted_score = clamp(base + flag_adj, 0, 1)`
   - `contribution = adjusted_score * (confidence/100) * provider_weight`
   - `weight_for_avg = provider_weight`

## How all providers are combined
1) Ignore providers whose `status` is timeout/error (but keep a note they failed).
2) If no providers are usable: score = N/A, verdict = inconclusive.
3) Weighted average on the usable ones:
   - `agg_score_0_to_1 = sum(contribution_i) / sum(weight_for_avg_i)`
   - `agg_score_0_to_100 = round(agg_score_0_to_1 * 100)`

## Safety rules (overrides) and conflicts
- Malicious floor: set score to at least 75 if either:
  - Two or more providers say malicious with confidence >= 70, or
  - One provider says malicious with confidence >= 90 and another says suspicious (or higher) with confidence >= 60.
- Benign cap: if every usable provider is benign/unknown and none has `adjusted_score > 0.40`, cap the score at 25.
- Conflict handling: if provider scores disagree a lot (variance > 1500 on the 0-100 scale), switch to the median score instead of the average, cut confidence by 30%, and add the flag `conflict`.

## Verdict thresholds
- 0-29: benign
- 30-69: suspicious
- 70-100: malicious
- Inconclusive: no usable provider data (all timeouts/errors or no responses)

## How confident are we?
- `response_rate = usable_providers / total_providers`
- `signal_consensus = 1 - (std_dev(normalized_scores) / 100)`
- `overall_confidence = (response_rate * 0.6) + (signal_consensus * 0.4)`
- If we flagged a conflict, multiply `overall_confidence` by 0.7.

## Examples (with fake numbers)
1) Phishing domain (clear bad)
   - A (Tier A): malicious, conf 95, sandbox hit -> contribution 1.14; weight 1.2
   - B (Tier B): malicious, conf 85 -> contribution 0.85; weight 1.0
   - C (Tier B): benign, conf 70 -> contribution 0.035; weight 1.0
   - Average ~63, but malicious floor triggers (two strong malicious) -> final 75 -> verdict: malicious; confidence: high

2) Noisy IP (mixed but leaning bad)
   - A (Tier B): suspicious, conf 90, infra flag -> contribution 0.63; weight 1.0
   - B (Tier C): benign, conf 80 -> contribution 0.032; weight 0.8
   - C: timeout -> ignored
   - D (Tier B): suspicious, conf 50, heuristics-only -> contribution 0.275; weight 1.0
   - Average ~33 -> verdict: suspicious; confidence: medium (only some providers responded, signals mixed)

3) File hash (mostly clean, one weak hit)
   - A (Tier B): benign, conf 90 -> 0.045; weight 1.0
   - B (Tier A): benign, conf 85 -> 0.051; weight 1.2
   - C (Tier C): suspicious, conf 35, heuristics-only -> 0.154; weight 0.8
   - Average ~8 -> verdict: benign; confidence: medium (note the single low-confidence heuristic hit)

## Edge cases
- Single provider only: do the same math, then reduce the score by 10% and cap confidence at 0.75; flag `single_provider_warning`.
- All providers timeout/error: verdict = inconclusive; score = N/A; confidence = 0; flag `all_providers_failed`; retry later.
- High conflict: if variance > 1500, use median, cut confidence (x0.7), flag `conflict`.
- Low-confidence only (all conf <30): expect benign/suspicious unless the malicious floor rule triggers.
- Stale data: if the timestamp is older than your freshness SLA, reduce confidence (example: halve it if older than 30 days).

## Tuning and why these numbers
- The weight tiers (1.2/1.0/0.8) and score bands (29/69) are starting points. Adjust after you see real precision/recall on known datasets.
- We keep logs of raw inputs, derived scores, conflicts, and overrides so analysts can see why a verdict was produced.
