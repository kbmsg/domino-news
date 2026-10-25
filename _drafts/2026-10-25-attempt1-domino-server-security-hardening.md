---
title: "Hardening Your Domino Server: Practical Security Measures"
description: "A hands-on guide for Domino administrators to enhance server security through practical configurations and best practices."
pubDate: "2026-10-25T17:39:27+08:00"
slug: "domino-server-security-hardening"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "Server security"
    url: "https://help.hcl-software.com/domino/10.0.1/admin/othr_serversecurity_c.html"
  - title: "Best Practices for HCL Notes/Domino Security. Part 2: The Domino Server"
    url: "https://www.panagenda.com/webinars/best-practices-for-hcl-notes-domino-security-part-2-the-domino-server/"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
  - "set config Server_Restricted=0"
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - topic overlap with **domino-security-vulnerabilities-2026** + 1 critical fact issue(s)
attempt: 1
slug: domino-server-security-hardening
topicOverlap: true (overlapWith=domino-security-vulnerabilities-2026)
issues:
  [critical] Server_Restricted=1: Restricts access for the current server session; administrators can still access databases.
      problem: The description of Server_Restricted=1 is materially incomplete and misleading in a way that could cause an administrator to misapply it. Server_Restricted has three meaningful values: 0 (no restriction), 1 (only users listed in 'Allow server access' in the Server document can access the server), and 2 (no users can access the server at all—only administrators with physical or console access). Describing =1 merely as 'restricts access for the current server session' omits the critical distinction from =2, and the phrase 'current server session' is not how this parameter works—it persists until changed; it is not session-scoped. An admin reading this could set =1 thinking it fully locks down the server when they actually need =2, or could be surprised that the restriction survives a restart.
      fix:     Correct the value table: Server_Restricted=0 means unrestricted; =1 means only users explicitly listed in the Server document's 'Allow server access' field can connect; =2 means the server is fully restricted to administrator access only. Remove the incorrect 'current session' framing and note that the setting persists across restarts unless changed.
  [major] set config Server_Restricted=1 ... To lift the restriction, set the value back to 0
      problem: 'set config' writes to notes.ini at runtime but the change may not take effect for active sessions as expected and behavior can differ by Domino version. More importantly, the article presents only the console 'set config' method and omits that this parameter is also configurable via the Server document in the Domino Directory (under Security tab), which is the more auditable and administrator-friendly approach in most production environments. Relying solely on notes.ini also means the setting could be overwritten by a Directory-driven push.
      fix:     Note that Server_Restricted can also be set via the Server document in the Domino Directory and that a Directory-sourced value can override a notes.ini value. Recommend the Directory method for production and note the console command as a quick/temporary option.
  [major] Running Fixup: At server startup and as needed to repair corrupted databases.
      problem: Recommending running Fixup at every server startup as a routine security or maintenance step is incorrect and potentially harmful to performance and availability. Fixup on a server with transaction logging enabled is largely unnecessary at startup (the log handles recovery), and running it indiscriminately takes databases offline and can be very time-consuming on large servers. It should be run only when corruption is detected or after an abnormal shutdown on a non-transaction-logged server.
      fix:     Clarify that Fixup at startup applies only to servers without transaction logging enabled or after abnormal shutdowns. On transaction-logged servers, recovery is handled automatically by the logger. Remove 'at server startup' as a general recommendation.
  [major] ECLs are your gatekeepers against malicious code. They define what actions signed code can perform on user workstations.
      problem: ECL configuration on the server side (via a policy or the Security Settings policy document pushed through the Domino Directory) is the correct administrative approach for managing ECLs across an enterprise. The article describes only the manual Domino Administrator client path, which is the workstation/client-side view and does not scale. It also omits that ECLs are a client-side (Notes client) control, not a server-side enforcement mechanism—they do not protect the server itself, only the workstation. This section is under a server-hardening article and could mislead readers into thinking they are hardening the server.
      fix:     Clarify that ECLs protect the Notes client workstation, not the server, and note that this section is included as part of the overall environment hardening. Describe the policy-based deployment method (Security Settings policy document) as the scalable administrative approach for pushing ECL settings to all clients.
  [major] Enforcing TLS for Secure Communications — steps 1-3
      problem: The TLS guidance is vague to the point of being non-actionable and omits important Domino-specific context: (1) Domino 12+ introduced the 'Domino Certificate Manager' (CertMgr) with ACME/Let's Encrypt support, which is the current recommended approach and does not use a traditional key ring file workflow. (2) The legacy key ring file (.kyr) workflow via the kyrtool or iKeyman is still relevant for older versions but is not described. (3) The article does not mention the TLS Cache console command ('tell http restart' or 'load tlsclnt') or the requirement to restart HTTP/SMTP after certificate changes. Presenting three vague bullet points as sufficient guidance for TLS configuration on a production server is not adequate.
      fix:     Add version-specific guidance: for Domino 12+, reference CertMgr and the ACME workflow. For earlier versions, reference kyrtool. Note that services must be restarted after certificate changes and that the Internet Site document or server document must be configured to reference the key ring.
  [minor] cited source for Server_Restricted: https://www.madicon.de/notes-ini-parameters/en/server_restricted/
      problem: The citation for Server_Restricted points to a third-party site (madicon.de) rather than official HCL documentation. Given that the information derived from it is factually incomplete (missing the =2 value), this is a credibility and accuracy risk. The article header cites help.hcl-software.com sources but this inline citation does not.
      fix:     Replace with the official HCL Domino documentation link for Server_Restricted or the Server document security settings in the HCL Help portal.
  [minor] Cited sources list includes https://help.hcl-software.com/domino/10.0.1/admin/othr_serversecurity_c.html
      problem: The article body never actually references this URL inline—it is listed as a cited source but no section links to it. Additionally, version 10.0.1 documentation is outdated relative to the article's other references (14.5.0, 11.0.x). If it is intended as a general reference, that should be made explicit.
      fix:     Either remove the orphaned URL from the cited sources or add an inline reference to it. If retained, consider updating to a current version of the documentation.
  [minor] Article title and throughout
      problem: The article does not mention the HCL Domino version(s) to which the guidance applies. Some settings and tools (CertMgr, policy-based ECL management, Server_Restricted behavior) differ across versions. Readers on older or newer releases may apply guidance that does not match their environment.
      fix:     Add a brief note at the top indicating the primary version(s) the article targets and flagging where behavior differs across releases.
-->

## Hardening Your Domino Server: Practical Security Measures

As Domino administrators, we know that securing our servers isn't just a checkbox—it's an ongoing battle against potential threats. Let's dive into some practical steps to fortify your Domino environment.

### Restricting Server Access

First off, controlling who gets through the door is fundamental. Domino offers the `Server_Restricted` setting to manage server accessibility:

- **`Server_Restricted=0`**: No restrictions; all users can access the server.
- **`Server_Restricted=1`**: Restricts access for the current server session; administrators can still access databases.

To apply this setting:

1. Open the Domino server console.
2. Enter the command:

   ```
   set config Server_Restricted=1
   ```

   This command restricts access for the current session. To lift the restriction, set the value back to `0`:

   ```
   set config Server_Restricted=0
   ```

   [Source: Server_Restricted – Control Server Access (HCL Domino)](https://www.madicon.de/notes-ini-parameters/en/server_restricted/)

### Implementing Execution Control Lists (ECLs)

ECLs are your gatekeepers against malicious code. They define what actions signed code can perform on user workstations. To configure ECLs:

1. Open the Domino Administrator client.
2. Navigate to the **Configuration** tab.
3. Select **Security** > **Execution Control List**.
4. Define the appropriate permissions for different signatures.

Regularly updating ECLs ensures that only trusted code executes, mitigating risks from unauthorized scripts.

[Source: Securing](https://help.hcl-software.com/domino/14.5.0/admin/conf_configuringsecurity_c.html)

### Enforcing TLS for Secure Communications

Transport Layer Security (TLS) encrypts data in transit, safeguarding against interception. To enable TLS:

1. Obtain a valid SSL/TLS certificate from a trusted Certificate Authority (CA).
2. Import the certificate into the Domino server's key ring file.
3. Configure the server to use TLS for HTTP, SMTP, and other protocols.

Detailed steps are available in the Domino documentation:

[Source: Securing](https://help.hcl-software.com/domino/14.5.0/admin/conf_configuringsecurity_c.html)

### Regular Maintenance and Monitoring

Security isn't a set-it-and-forget-it deal. Regular maintenance tasks include:

- **Backups**: Daily, weekly, and monthly backups are crucial. Ensure you can restore from them.
- **Monitoring Mail Routing**: Daily checks help identify unauthorized mail activities.
- **Running Fixup**: At server startup and as needed to repair corrupted databases.

A comprehensive maintenance checklist is provided here:

[Source: Server maintenance checklist](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### Physical Security Measures

Don't overlook the basics. Ensure your servers are in secure, access-controlled environments. Physical security breaches can render all other measures moot.

[Source: Physically securing the Domino server](https://help.hcl-software.com/domino/11.0.0/admin/conf_physicallysecuringthedominoserver_t.html)

## To Review

Securing your Domino server involves a mix of configuration tweaks and diligent maintenance. By restricting server access, implementing ECLs, enforcing TLS, and adhering to regular maintenance schedules, you significantly bolster your server's defenses. Remember, security is a continuous process—stay vigilant and proactive.
