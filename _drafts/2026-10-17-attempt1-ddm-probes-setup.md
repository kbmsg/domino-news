---
title: "Setting Up and Managing DDM Probes in HCL Domino"
description: "A practical guide for Domino administrators on configuring, enabling, and scheduling DDM probes to monitor server health effectively."
pubDate: "2026-10-17T17:06:28+08:00"
slug: "ddm-probes-setup"
tags:
  - "Domino Server"
  - "Monitoring"
  - "Tutorial"
sources:
  - title: "Enabling and disabling DDM probes"
    url: "https://help.hcl-software.com/domino/10.0.1/admin/admn_enablinganddisablingddmprobes_t.html"
  - title: "Scheduling DDM probes"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_schedulingddmprobes_c.html"
  - title: "DDM probes"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_ddmprobes_c.html"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: ddm-probes-setup
topicOverlap: false
issues:
  [critical] Creating Custom DDM Probes – citation: ibm.com/docs/en/domino/10.0.0
      problem: The article cites an IBM.com URL for Domino documentation. HCL took over Domino from IBM; the authoritative documentation now lives on help.hcl-software.com. Directing administrators to IBM's legacy Domino docs is problematic: those pages may be outdated, removed, or contradict current HCL guidance. More importantly, it signals the author may have sourced procedural steps from IBM-era documentation that does not reflect current HCL Domino behavior or UI.
      fix:     Replace the IBM citation with the equivalent HCL Software Help page, e.g., https://help.hcl-software.com/domino/11.0.1/admin/ for creating probes. Verify all steps against current HCL documentation.
  [critical] Scheduling DDM Probes – Note about one-hour scheduling window – cited URL path: /domino/9.0.1/admin/admin/admn_schedulingddmprobes_c.html
      problem: The cited URL for the one-hour scheduling window note contains a doubled path segment ('/admin/admin/') which is a strong indicator of a fabricated or malformed URL. Additionally, it references Domino 9.0.1, which is an end-of-life release. Readers should not be pointed to EOL documentation for production guidance, and the malformed URL will not resolve correctly.
      fix:     Verify whether the one-hour scheduling window behavior still applies in current supported Domino releases (12.x/14.x). If it does, cite the correct current HCL help URL without the doubled path segment, e.g., https://help.hcl-software.com/domino/11.0.1/admin/admn_schedulingddmprobes_c.html (which is already cited earlier in the article).
  [major] Maintaining DDM Probes – citation URL: /domino/11.0.0/admin/admn_maintainingddmprobes_c.html
      problem: The cited URL references Domino 11.0.0 while all other HCL help citations in the article use 11.0.1. Minor versioning inconsistency, but more importantly the article as a whole is anchored to Domino 10.x and 11.x documentation with no mention of current supported releases (Domino 12.x and 14.x). Administrators running modern versions could encounter UI or behavioral differences not covered here.
      fix:     Update all citations to reference the latest supported Domino release documentation (12.x or 14.x as appropriate). Add a version note at the top of the article stating which Domino versions the guidance applies to.
  [major] Accessing the Monitoring Configuration Database – 'Navigate to the Files Tab'
      problem: DDM probes are typically accessed and configured via the Domino Administrator client's 'Monitoring' or 'Server' tab (specifically Server > Analysis > Domino Domain Monitoring), not by navigating raw to EVENTS4.NSF through the Files tab. While opening EVENTS4.NSF directly is technically possible, it is not the standard documented workflow and may confuse administrators who cannot locate the expected DDM views when opening the database this way from the Files tab.
      fix:     Clarify the standard navigation path: in Domino Administrator, go to the Server tab > Analysis > Domino Domain Monitoring, or describe opening EVENTS4.NSF and then explain which views to use once inside. Cross-reference the Monitoring tab approach as the primary method.
  [major] Enabling and Disabling DDM Probes – 'View Probes: Choose to view probes by All Probes by Author or All Probes by Type'
      problem: The standard DDM probe views documented by HCL include views such as 'All Probes by Type' and 'All Probes by Server', not 'All Probes by Author'. 'By Author' is not a standard DDM probe view. Presenting a non-existent view name in a step-by-step procedure will confuse administrators who cannot find it.
      fix:     Verify the exact view names against current HCL documentation. Replace 'All Probes by Author' with the correct view name (likely 'All Probes by Server' or 'All Probes by Type').
  [major] Creating Custom DDM Probes – probe types listed: 'Operating System', 'Web', 'Security'
      problem: The article presents only three example probe types without noting that the available probe types (and subtypes) differ depending on the Domino version. Certain probe types were added or changed across releases. Presenting a partial, unversioned list as representative examples without that caveat could mislead administrators into thinking these are the only or primary types.
      fix:     Either provide the complete list of probe types for a specified Domino version, or clearly label these as examples and direct readers to the HCL documentation for the full current list, noting it varies by release.
  [minor] Understanding DDM Probes – URL parameter '?utm_source=openai'
      problem: All HCL help.hcl-software.com URLs in this article contain '?utm_source=openai' query parameters. This strongly suggests the article was AI-generated with citations inserted automatically. These UTM parameters are not part of HCL's official documentation URLs and indicate the links were not manually verified. The URLs should be checked for accuracy before publication.
      fix:     Remove all '?utm_source=openai' query parameters from the URLs and manually verify each link resolves to the correct documentation page.
  [minor] To Review (section header)
      problem: The closing section is titled 'To Review' which is an unusual heading for a summary section. Standard convention would be 'Summary' or 'Conclusion'.
      fix:     Rename the section to 'Summary' or 'Conclusion' for clarity and professionalism.
-->

## Understanding DDM Probes

Domino Domain Monitoring (DDM) probes are essential tools for keeping tabs on your server's health. They automate problem detection across various server components, helping you identify and resolve issues before they escalate. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.1/admin/admn_ddmprobes_c.html?utm_source=openai))

## Accessing the Monitoring Configuration Database

To configure DDM probes, you'll need to work within the Monitoring Configuration database (`EVENTS4.NSF`). Here's how to get there:

1. **Open Domino Administrator**: Launch the Domino Administrator client.
2. **Navigate to the Files Tab**: Click on the 'Files' tab to view the server's file system.
3. **Open EVENTS4.NSF**: Locate and open the `EVENTS4.NSF` database.

## Enabling and Disabling DDM Probes

By default, Domino comes with a set of pre-configured DDM probes. To activate or deactivate these probes:

1. **Access DDM Configuration**: Within `EVENTS4.NSF`, select 'DDM Configuration'.
2. **View Probes**: Choose to view probes by 'All Probes by Author' or 'All Probes by Type'.
3. **Select Probes**: Click on the probe(s) you wish to enable or disable.
4. **Enable/Disable Probes**: Click 'Enable Probes' or 'Disable Probes', then confirm your selection. ([help.hcl-software.com](https://help.hcl-software.com/domino/10.0.1/admin/admn_enablinganddisablingddmprobes_t.html?utm_source=openai))

## Creating Custom DDM Probes

Sometimes, the default probes don't cover all your monitoring needs. Creating custom probes allows you to tailor monitoring to your environment:

1. **Initiate New Probe**: In the 'DDM Configuration' view, click 'New DDM Probe'.
2. **Select Probe Type**: Choose the appropriate probe type (e.g., 'Operating System', 'Web', 'Security').
3. **Configure Probe Details**:
   - **Probe Subtype**: Specify the subtype relevant to your monitoring needs.
   - **Description**: Provide a brief description for easy identification.
   - **Target Servers**: Define which servers the probe will monitor.
   - **Specifics**: Set parameters like thresholds and conditions for the probe.
4. **Save the Probe**: Once configured, save the probe document. ([ibm.com](https://www.ibm.com/docs/en/domino/10.0.0?topic=probes-creating-operating-system&utm_source=openai))

## Scheduling DDM Probes

Proper scheduling ensures probes run at optimal times without overloading your servers:

1. **Open the Probe Document**: Navigate to the probe you wish to schedule.
2. **Access the Schedule Tab**: Click on the 'Schedule' tab within the probe document.
3. **Set Frequency**: Choose how often the probe should run (e.g., daily, weekly, monthly).
4. **Define Timing**: Specify the exact times or intervals for the probe to execute.
5. **Handle Missed Probes**: Decide how to manage missed probes—options include running at startup, ignoring, or running in the next time period. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.1/admin/admn_schedulingddmprobes_c.html?utm_source=openai))

**Note**: DDM scheduled probes have a one-hour scheduling window. For example, if a probe is set to run at 1:00 AM, it will execute between 1:00 and 2:00 AM. ([help.hcl-software.com](https://help.hcl-software.com/domino/9.0.1/admin/admin/admn_schedulingddmprobes_c.html?utm_source=openai))

## Maintaining DDM Probes

Regular maintenance of your DDM probes ensures they remain effective:

- **View Probes**: Regularly review existing probes to ensure they're still relevant.
- **Modify Probes**: Update probe configurations as your server environment changes.
- **Delete Unnecessary Probes**: Remove probes that are no longer needed to keep the monitoring system efficient. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.0/admin/admn_maintainingddmprobes_c.html?utm_source=openai))

## To Review

Setting up and managing DDM probes in HCL Domino is a proactive approach to server monitoring. By configuring, scheduling, and maintaining these probes, you can detect and address potential issues promptly, ensuring optimal server performance and reliability.
