# User Guide

Welcome to Cyber Lens, your comprehensive threat intelligence and IOC analysis platform. This guide will help you navigate the key features and make the most of your security investigations.

---

## IOC Lookup

The IOC (Indicator of Compromise) Lookup is the core feature of Cyber Lens, allowing you to analyze potential threats across multiple threat intelligence providers simultaneously.

### How to Use

1. **Navigate to the Home page** - You'll find the IOC lookup interface prominently displayed
2. **Enter your IOC** - Supported formats include:
   - IP addresses (e.g., `192.168.1.1`, `2001:db8::1`)
   - Domain names (e.g., `malicious-site.com`)
   - URLs (e.g., `https://suspicious-url.com/path`)
   - File hashes (MD5, SHA1, SHA256)
3. **Click "Analyze"** - Cyber Lens will query multiple threat intelligence providers in parallel
4. **Review Results** - Get a comprehensive threat score and detailed analysis

### Understanding Results

- **Threat Score (0-100)**: Higher scores indicate greater threat likelihood
- **Verdict**: Clear classification as Benign, Suspicious, or Malicious
- **Provider Details**: See which threat intelligence sources flagged the IOC
- **Confidence Level**: Indicates the reliability of the assessment

### Tips for Effective Analysis

- **Be specific**: Use complete URLs rather than just domains when possible
- **Cross-reference**: Check multiple related IOCs for comprehensive analysis
- **Consider context**: Legitimate business tools may sometimes trigger alerts

---

## History

The History feature maintains a complete record of all your IOC analyses, enabling you to track investigations and identify patterns over time.

### Accessing History

1. **Click "History"** in the navigation menu
2. **Browse chronologically** - Your searches are ordered by date and time
3. **Filter and search** - Find specific IOCs or analysis results quickly

### History Features

- **Timestamp tracking**: See exactly when each analysis was performed
- **Result preservation**: All threat scores and verdicts are stored permanently
- **Quick re-analysis**: Click on any historical IOC to run a fresh analysis
- **Export capabilities**: Download your analysis history for reporting

### Use Cases

- **Investigation tracking**: Monitor the evolution of threats over time
- **Pattern recognition**: Identify recurring malicious indicators
- **Compliance reporting**: Generate audit trails for security reviews
- **Team collaboration**: Share investigation histories with team members

---

## News

Stay informed about the latest cybersecurity threats with our curated news feed, which automatically extracts and highlights IOCs from current security news.

### News Features

- **Real-time updates**: Continuously updated with the latest security news
- **IOC extraction**: Automatically identifies and highlights indicators in articles
- **Categorized content**: News organized by threat type, industry, or geography
- **Direct analysis**: Click any extracted IOC to run an immediate threat analysis

### Using News for Threat Intelligence

1. **Browse headlines** - Scan for emerging threats relevant to your organization
2. **Read detailed articles** - Get context about new attack vectors or campaigns
3. **Extract IOCs** - Find indicators mentioned in news stories
4. **Analyze immediately** - Click any IOC to check its current threat status

### News Categories

- **Malware outbreaks**: Information about new malicious software campaigns
- **Vulnerability disclosures**: Details about newly discovered security flaws
- **Attack campaigns**: Coverage of ongoing or recent cyber attacks
- **Industry alerts**: Sector-specific threat intelligence

---

## Analytics

The Analytics dashboard provides visual insights into your threat landscape, helping you identify trends, patterns, and potential security gaps.

### Analytics Overview

- **Threat trends**: Visualize how different types of threats evolve over time
- **IOC statistics**: See breakdowns of analyzed indicators by type and verdict
- **Provider performance**: Monitor which threat intelligence sources are most valuable
- **Geographic distribution**: Understand the geographic origins of threats

### Key Analytics Features

- **Interactive charts**: Click on chart elements to drill down into specific data
- **Custom date ranges**: Analyze threats during specific time periods
- **Export capabilities**: Download charts and data for presentations
- **Real-time updates**: Analytics refresh automatically as new data comes in

### Using Analytics Effectively

1. **Monitor trends**: Look for increases in specific threat types
2. **Identify patterns**: Spot recurring attack vectors or sources
3. **Measure impact**: Assess how threats affect your organization over time
4. **Inform strategy**: Use data to guide security investment and policy decisions

### Common Analytics Questions

- **What are our top threat sources?** - Identify the most common malicious indicators
- **Are threats increasing or decreasing?** - Track overall threat volume trends
- **Which IOCs need attention?** - Prioritize based on threat scores and frequency
- **How effective are our defenses?** - Measure success through threat reduction metrics

---

## Pro Tips

### General Usage

- **Save frequently analyzed IOCs** - Bookmark important indicators for quick access
- **Set up alerts** - Configure notifications for specific threat types or scores
- **Use batch analysis** - Analyze multiple IOCs simultaneously when investigating incidents
- **Document findings** - Add notes to analyses for future reference

### Security Best Practices

- **Verify before acting** - Always cross-reference high-threat IOCs with additional sources
- **Consider false positives** - Legitimate business tools may sometimes trigger alerts
- **Update regularly** - Keep your threat intelligence current with frequent analyses
- **Share insights** - Distribute important findings across your security team

### Troubleshooting

- **Slow analysis**: Check your internet connection and try again
- **Unexpected results**: Verify IOC format and try alternative threat intelligence sources
- **Missing history**: Ensure you're logged in to save analysis results
- **Analytics not loading**: Refresh the page and check your browser compatibility

---

## Getting Help

If you encounter issues or have questions about using Cyber Lens:

- **Check this guide** - Most common questions are answered here
- **Review the FAQ** - Look for answers to frequently asked questions
- **Contact support** - Reach out through the support channels provided
- **Community forums** - Connect with other Cyber Lens users for tips and advice

---

## Additional Resources

- **Developer Guide**: [Learn about the technical architecture](developer-guide.md)
- **API Documentation**: For integration with your existing security tools
- **Training Materials**: Video tutorials and walkthroughs for advanced features
- **Security Blog**: Latest threat research and Cyber Lens updates

*This guide is continuously updated. Check back regularly for new features and improved workflows.*
