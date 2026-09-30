---
title: "Restricting Device Access in HCL Traveler"
description: "A hands-on guide to configuring device access restrictions in HCL Traveler to enhance security by controlling which devices can sync with your Domino server."
pubDate: "2026-09-30T19:01:49+08:00"
slug: "restricting-device-access-in-hcl-traveler"
tags:
  - "HCL Traveler"
  - "Security"
  - "Tutorial"
sources:
  - title: "Restricting access by device category - Domino Workspace Help Center"
    url: "https://help.hcl-software.com/domino-workspace/1.0/traveler-docs/restrictingaccessbydevicecategory.html"
  - title: "HCL Domino - Secure Enterprise AI and Collaboration Platform | HCLTech"
    url: "https://www.hcltech.com/hcl-domino"
relatedConsoleCommands: []
notesIniSettings:
  - "NTS_USER_AGENT_ALLOWED_ANDROID"
  - "NTS_USER_AGENT_ALLOWED_IBM_APPLE"
  - "NTS_USER_AGENT_ALLOWED_REGEX"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://help.hcl-software.com/domino-workspace/1.0/traveler-docs/restrictingaccessbydevicecategory.html" appears 3/3 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 2
slug: restricting-device-access-in-hcl-traveler
-->

## Restricting Device Access in HCL Traveler

Managing which devices can sync with your HCL Domino server via HCL Traveler is crucial for maintaining security and compliance. Here's how you can configure device access restrictions effectively.

### Understanding Device Security Settings

HCL Traveler allows administrators to prevent devices that don't support security features from syncing. This is controlled by the setting **Prohibit devices incapable of security enablement**. When enabled, it blocks devices that cannot enforce security policies, such as remote wipe or mandatory passwords.

**For Android devices**, this setting:

- Blocks devices running Android OS versions below 2.2.
- Blocks devices where the user hasn't enabled the Device Administrator when prompted.

When a device is blocked due to this setting, it receives a "403 (Forbidden)" status, and the device document in the administration application shows "Prohibit" in the Access field.

*Source: [Restricting access by device category - Domino Workspace Help Center](https://help.hcl-software.com/domino-workspace/1.0/traveler-docs/restrictingaccessbydevicecategory.html)*

### Restricting Access by Device Type

To restrict access based on device type, you can use the `NTS_USER_AGENT_ALLOWED` notes.ini settings. These settings allow you to specify which device types are permitted to sync with the server.

**Available settings include:**

- `NTS_USER_AGENT_ALLOWED_ANDROID`
- `NTS_USER_AGENT_ALLOWED_IBM_APPLE`
- `NTS_USER_AGENT_ALLOWED_OTHER`
- `NTS_USER_AGENT_ALLOWED_REGEX`

**Example Configuration:**

To allow only HCL Domino Workspace Mail clients (Android and Apple devices) and block all others:

1. Set the following notes.ini parameters:

   ```
   NTS_USER_AGENT_ALLOWED_ANDROID=true
   NTS_USER_AGENT_ALLOWED_IBM_APPLE=true
   NTS_USER_AGENT_ALLOWED_OTHER=false
   NTS_USER_AGENT_ALLOWED_REGEX=.*
   ```

2. Restart the HCL Traveler server to apply the changes.

This configuration permits only Android and Apple devices to sync, while all other device types are denied access.

*Source: [Restricting access by device category - Domino Workspace Help Center](https://help.hcl-software.com/domino-workspace/1.0/traveler-docs/restrictingaccessbydevicecategory.html)*

### Implementing the Restrictions

1. **Edit the notes.ini File:**

   - Locate the `notes.ini` file on your Domino server.
   - Add or modify the `NTS_USER_AGENT_ALLOWED` parameters as needed.

2. **Restart the Traveler Server:**

   - After saving the changes, restart the HCL Traveler server to ensure the new settings take effect.

3. **Verify the Configuration:**

   - Attempt to sync devices that should be allowed and those that should be blocked to confirm the settings are working as intended.

### The Outcome

By configuring these settings, you can control which devices are permitted to sync with your HCL Domino server via HCL Traveler, enhancing your organization's security posture. Regularly review and update these settings to adapt to new device types and evolving security requirements.

*Source: [Restricting access by device category - Domino Workspace Help Center](https://help.hcl-software.com/domino-workspace/1.0/traveler-docs/restrictingaccessbydevicecategory.html)*
