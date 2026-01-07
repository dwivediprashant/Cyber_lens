# Threat Scoring & Verdict Model Proposal

## Overview

This document proposes a clear and explainable threat scoring and verdict model for aggregating results from multiple threat-intelligence providers.

The objective is to compute:
- A unified **numeric threat score (0–100)**
- A final **verdict**: `benign`, `suspicious`, or `malicious`

The design focuses on transparency, real-world applicability, and robust handling of partial or conflicting data.

---

## Inputs

Each IOC (Indicator of Compromise) is evaluated using multiple providers.

### Provider Attributes
- **Provider Name**
  - Example: Provider A, Provider B, Provider C

- **Provider Verdict / Flags (hypothetical)**
  - Benign / Clean
  - Suspicious
  - Malicious

- **Provider Confidence (optional)**
  - High
  - Medium
  - Low

- **Provider Status**
  - Success
  - Timeout / Failed
  - Not Available

---

## Normalized Provider Scoring

Each provider verdict is normalized into a base score.

| Provider Verdict | Base Score |
|------------------|------------|
| Benign           | 0          |
| Suspicious       | 50         |
| Malicious        | 100        |

### Confidence Adjustment (Optional)

| Confidence | Score Adjustment |
|-----------|------------------|
| High      | +10              |
| Medium    | 0                |
| Low       | −10              |

Scores are capped between **0 and 100** per provider.

---

## Provider Weighting

Providers are weighted based on trust and reliability.

| Provider Type        | Weight |
|----------------------|--------|
| Primary / High trust | 1.0    |
| Secondary            | 0.7    |
| Experimental         | 0.4    |

Weights are configurable and documented.

---

## Aggregation Logic

1. Ignore providers that timeout or fail.
2. For each valid provider:
   - Apply base score
   - Adjust for confidence
   - Multiply by provider weight
3. Calculate the final threat score using a weighted average:

Final Score = (Sum of weighted provider scores) / (Sum of provider weights)

The final score is normalized to a **0–100 range**.

---

## Verdict Thresholds

| Final Score Range | Verdict     |
|------------------|-------------|
| 0 – 29           | Benign      |
| 30 – 69          | Suspicious  |
| 70 – 100         | Malicious   |

### Rationale
- Avoids false positives from weak signals
- Suspicious range enables analyst review
- Malicious verdict requires strong evidence

---

## Example Scenarios

### Example 1: Clearly Malicious IOC

| Provider | Verdict    | Confidence | Weight | Score |
|--------|------------|------------|--------|-------|
| A      | Malicious  | High       | 1.0    | 100 |
| B      | Malicious  | Medium     | 0.7    | 70  |
| C      | Suspicious | Medium     | 0.4    | 20  |

Final Score ≈ **82**  
Final Verdict: **Malicious**

---

### Example 2: Mixed Signals

| Provider | Verdict    | Confidence | Weight | Score |
|--------|------------|------------|--------|-------|
| A      | Benign     | High       | 1.0    | 0  |
| B      | Suspicious | Medium     | 0.7    | 35 |
| C      | Malicious  | Low        | 0.4    | 36 |

Final Score ≈ **28**  
Final Verdict: **Benign**

---

### Example 3: Mostly Suspicious

| Provider | Verdict    | Confidence | Weight | Score |
|--------|------------|------------|--------|-------|
| A      | Suspicious | High       | 1.0    | 60 |
| B      | Suspicious | Medium     | 0.7    | 35 |

Final Score ≈ **49**  
Final Verdict: **Suspicious**

---

## Edge Cases

### Single Provider Available
- Use that provider’s weighted score
- Verdict follows standard thresholds
- Result flagged as low confidence

---

### All Providers Timeout
- Final Score: `null`
- Verdict: `unknown`
- IOC flagged for retry or manual review

---

### Conflicting Benign and Malicious Signals
- Weighted average reduces dominance of a single provider
- Verdict often resolves to `suspicious`
- Encourages analyst validation

---

## Trade-Offs

### Advantages
- Explainable and transparent
- Handles missing data gracefully
- Configurable provider trust
- Aligns with SOC workflows

### Limitations
- May delay decisive verdicts
- Requires provider trust calibration
- Cannot eliminate all false positives

---

## Conclusion

This model provides a balanced, extensible, and practical framework for threat scoring and verdict determination.  
It is suitable as a baseline design and can evolve with additional contextual intelligence.

---