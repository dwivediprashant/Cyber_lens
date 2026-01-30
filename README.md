 # Cyber Lens

Cyber Lens is a **Threat Intelligence & IOC Analysis Platform** built as part of a month-long open-source contribution event by the **Cyber Security Wing**.

The project focuses on collecting, analyzing, and correlating Indicators of Compromise (IOCs) such as IPs, domains, URLs, and hashes using multiple threat intelligence providers — all wrapped in a clean full-stack architecture.

---

## What is Cyber Lens?

Cyber Lens allows users to:
- Submit an IOC (IP, domain, URL, hash, etc.)
- Query multiple threat intelligence providers in parallel
- Aggregate results into a single **score & verdict**
- View historical lookups
- Read security news with extracted IOCs
- Visualize analytics and threat trends

This repository is intentionally **partially implemented** to encourage learning through contributions.

---

## Documentation

Get started with our comprehensive documentation:

### [User Guide](Docs/usage-guide.md)
Learn how to use Cyber Lens effectively:
- **IOC Lookup** - Analyze indicators across multiple threat intelligence sources
- **History** - Track and review your analysis history
- **News** - Stay updated with security news and extracted IOCs
- **Analytics** - Visualize threat trends and patterns

### [Developer Guide](Docs/developer-guide.md)
Set up your development environment and contribute:
- **Tech Stack Overview** - Understand our technology choices
- **Project Structure** - Navigate the codebase effectively
- **Environment Setup** - Get up and running locally
- **Contribution Workflow** - Learn how to contribute code

### [Threat Scoring Model](Docs/Scoring-model.md)
Understand how we calculate threat scores and determine verdicts.

---

## Quick Start

### For Users
1. **Read the [User Guide](docs/usage-guide.md)** to learn about all features
2. **Access the application** (deployment link coming soon)
3. **Start analyzing IOCs** with our threat intelligence platform

### For Developers
1. **Read the [Developer Guide](docs/developer-guide.md)** for setup instructions
2. **Fork and clone** this repository
3. **Set up your environment** following the guide
4. **Start contributing** by picking an issue from the Issues tab

---

## Contribution Workflow

1. **Fork** this repository
2. **Clone** your fork locally
3. Pick an issue from the Issues tab
4. Create a new branch
5. Implement your solution
6. Open a **Pull Request**

---

## Issue-Based Contribution System

All contributions are tracked through GitHub Issues.
Each issue has:
- Difficulty level
- Point value
- Contribution tag

### Sample Issues Include:
- Frontend routing & layout setup
- Backend Express & MongoDB initialization
- Provider integrations (VirusTotal, OTX, AbuseIPDB)
- IOC scoring & verdict engine
- News scraping & IOC extraction
- Analytics dashboard
- Batch lookup & alerting system

> Please read issue descriptions carefully before starting.

---

## Rules & Guidelines

- Follow the existing folder structure  
- Do not introduce unnecessary dependencies  
- Write clean, readable code  
- Handle errors properly  
- Respect API rate limits  
- One issue per PR (unless stated otherwise)

---

## Scoring & Recognition

- Each merged PR earns points based on issue difficulty  
- Competitive issues reward higher points  
- Top contributors will be recognized at the end of the event

---

## Final MVP Goals

By the end of the event, **Cyber Lens** should support:

- End-to-end IOC lookup  
- Parallel provider execution  
- Accurate scoring & verdicts  
- Persistent history  
- News ingestion with IOC extraction  
- Analytics dashboard  
- Clean and stable UI

---

## Maintainers

Maintained by the **Cyber Security Wing**  
For queries, check the **Issues** section or reach out to the maintainers.
