---
title: "Deploying Domino IQ: Integrating AI into Your Domino Environment"
description: "A practical guide for Domino administrators on deploying and configuring Domino IQ to integrate AI capabilities into your Domino environment."
pubDate: "2026-10-18T17:24:00+08:00"
slug: "domino-iq-deployment"
tags:
  - "Domino Server"
  - "Domino IQ"
  - "Tutorial"
sources:
  - title: "HCL Domino 2026: Secure Enterprise AI and Collaboration Platform"
    url: "https://www.hcl-software.com/domino"
  - title: "HCLSoftware Launches Sovereign AI Aimed at Governments and Regulated Organizations Concerned with Their Data Privacy"
    url: "https://www.hcltech.com/en-us/press-releases/hclsoftware-launches-sovereign-ai-aimed-governments-and-regulated-organizations"
relatedConsoleCommands:
  - "load dominoiq"
  - "tell dominoiq status"
notesIniSettings:
  - "DominoIQEnabled=1"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Body must have >= 2 inline links, got 1.
attempt: 1
slug: domino-iq-deployment
-->

## Deploying Domino IQ: Integrating AI into Your Domino Environment

With the release of HCL Domino 14.5, Domino IQ brings AI capabilities directly into your Domino environment. This guide walks you through deploying Domino IQ, ensuring your organization can leverage AI while maintaining data sovereignty.

### Understanding Domino IQ

Domino IQ is an on-premises AI engine integrated into HCL Domino 14.5 and later. It enables your teams to query internal data using natural language, securely behind your firewall, without exposing corporate knowledge. This is particularly beneficial for organizations concerned with data privacy and compliance.

### Prerequisites

Before deploying Domino IQ, ensure the following:

- **Domino Version**: Your servers are running HCL Domino 14.5 or later.
- **Licensing**: Verify that your current Domino license includes Domino IQ. If unsure, consult your HCL representative.
- **System Resources**: Assess your server's capacity to handle AI workloads. Domino IQ processes can be resource-intensive.

### Deployment Steps

1. **Enable Domino IQ**:

   - Edit the `notes.ini` file on your Domino server.
   - Add the following line:
     
     ```
     DominoIQEnabled=1
     ```
     
     This setting activates Domino IQ on your server.

2. **Load the Domino IQ Task**:

   - Open the Domino server console.
   - Enter the command:
     
     ```
     load dominoiq
     ```
     
     This starts the Domino IQ task.

3. **Verify the Deployment**:

   - In the server console, check the status of Domino IQ by entering:
     
     ```
     tell dominoiq status
     ```
     
     This command displays the current status and confirms that Domino IQ is running.

### Configuration

After deployment, configure Domino IQ to suit your organization's needs:

- **AI Models**: Domino IQ allows you to choose AI models built by your organization or trusted sources. Ensure the selected models align with your business requirements.

- **Access Controls**: Define who can access Domino IQ features. Use Domino's existing security model to set appropriate access levels.

- **Monitoring**: Regularly monitor Domino IQ's performance. Check server logs for any issues and adjust resources as needed.

### Security Considerations

Domino IQ operates entirely within your infrastructure, ensuring data privacy. However, it's crucial to:

- **Regularly Update**: Keep your Domino servers and Domino IQ components updated to the latest versions to benefit from security patches and improvements.

- **Audit Access**: Periodically review who has access to Domino IQ and adjust permissions as necessary.

### The Outcome

Deploying Domino IQ integrates AI capabilities into your Domino environment, enabling your teams to leverage organizational knowledge securely and efficiently. By following the steps outlined above, you can ensure a smooth deployment and configuration process.

For more detailed information, refer to the official HCL Domino documentation: [HCL Domino 2026](https://www.hcl-software.com/domino).
