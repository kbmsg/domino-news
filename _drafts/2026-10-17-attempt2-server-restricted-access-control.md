---
title: "Controlling Server Access with the Server_Restricted Parameter in HCL Domino"
description: "A hands-on guide for Domino administrators on using the Server_Restricted notes.ini parameter to manage server access during maintenance or troubleshooting."
pubDate: "2026-10-17T17:07:32+08:00"
slug: "server-restricted-access-control"
tags:
  - "Domino Server"
  - "Security"
  - "Notes.ini"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "Administration tools"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
  - "set config Server_Restricted=0"
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - 1 critical fact issue(s)
attempt: 2
slug: server-restricted-access-control
topicOverlap: false
issues:
  [critical] Setting the parameter via the console applies the change immediately. However, for permanent changes, it's recommended to add the parameter directly to the notes.ini file
      problem: This is misleading and potentially dangerous guidance. 'set config' on the Domino console DOES write the value to notes.ini immediately and persistently — it is not session-only. The article implies that a console 'set config' is transient and that manual notes.ini editing is required for persistence. A reader following this advice might manually edit notes.ini while the server is running (risky) or be confused about why the setting already persisted after a restart. The distinction the article is trying to draw between values 1 and 2 (session vs. permanent) is what governs persistence, not the method of setting. Value=1 is described by some sources as being cleared on server restart, while value=2 persists; this is the real distinction to explain, not console-vs-file editing.
      fix:     Remove or rewrite the note. Clarify that 'set config' always writes to notes.ini and is persistent. The actual behavioral difference between Server_Restricted=1 and Server_Restricted=2 regarding persistence across restarts should be explained clearly and verified against HCL documentation. If value=1 is indeed cleared on restart and value=2 persists, say so explicitly rather than implying the persistence depends on whether you use the console or edit the file directly.
  [major] Server_Restricted=1: Restricts access for the current server session. New database open requests are denied, but administrators can still access databases.
      problem: The description of what 'administrators can still access databases' means is vague and potentially misleading. The parameter definition of who qualifies as an 'administrator' in this context (i.e., those listed in the 'Administrators' field of the Server document, or those with console access) is not specified. A reader might incorrectly assume any user with Manager ACL access to a database is exempt, which is not the case. Additionally, the article does not mention that existing open sessions/connections by regular users are typically not dropped immediately — only new open requests are denied — which is an important operational caveat.
      fix:     Clarify that 'administrators' in this context refers specifically to those listed in the Administrators field of the Server document (and/or with full console access), not ACL-level managers. Also note that existing user sessions already open at the time the restriction is applied are generally not forcibly terminated; only new database open requests are blocked.
  [major] show config Server_Restricted
      problem: The 'show config' console command is not a standard, officially documented HCL Domino console command for retrieving a specific notes.ini parameter value. The correct and well-known approach is to use 'set config' to change values, but verification of a specific parameter is typically done by opening notes.ini directly or using the 'show server' command for server-level settings. Administrators acting on this command against a production server may get an error or no output and be confused.
      fix:     Verify whether 'show config <parameter>' is a valid Domino console command in supported releases. If it is not reliably documented, replace with guidance to verify the notes.ini file directly, or use the Domino Administrator client's Server > Analysis > notes.ini view, or reference the correct console command if one exists.
  [major] cited source: https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html
      problem: The cited HCL documentation URL points to a Domino 11.0.1 page about 'administration tools' generically, which does not appear to be specifically about the Server_Restricted notes.ini parameter. This looks like an imprecise or fabricated citation used to lend authority to the claim about console vs. file persistence, which is itself incorrect. Readers who follow this link expecting documentation of Server_Restricted behavior will not find it.
      fix:     Replace with the correct HCL documentation URL that specifically documents the Server_Restricted parameter. If no official HCL page exists for this parameter, remove the citation rather than citing an unrelated page.
  [minor] There are additional undocumented values (3 and 4) mentioned in some sources
      problem: The article mentions undocumented values 3 and 4 but provides no useful context about what they might do or why they appear in third-party sources. Mentioning undocumented values without any caveat about whether they have ever worked or are simply artifacts of speculation adds noise and could invite experimentation on production servers.
      fix:     Either remove the mention of values 3 and 4 entirely, or add a stronger warning that these are entirely unsupported, their behavior is unknown, and they should never be used on a production server.
  [minor] Article title and throughout
      problem: The article correctly uses 'HCL Domino' in most places, which is good. However, there is no version range specified for this guidance. The behavior of Server_Restricted (particularly the session-vs-permanent distinction between values 1 and 2) may vary across Domino versions, and readers on older or newer releases should know the version context.
      fix:     Add a brief statement of which Domino versions this guidance applies to, or note that behavior was verified on a specific release (e.g., Domino 12.x or 14.x).
-->

## Managing Server Access with the Server_Restricted Parameter in HCL Domino

As a Domino administrator, there are times when you need to restrict access to your server—be it for maintenance, troubleshooting, or other administrative tasks. One effective way to achieve this is by using the `Server_Restricted` parameter in the `notes.ini` file. Let's walk through how to implement this and what each setting entails.

### Understanding the Server_Restricted Parameter

The `Server_Restricted` parameter controls the level of access users have to the Domino server. By configuring this parameter, you can limit or completely restrict user access, ensuring that only administrators can perform necessary tasks without interference.

**Available Settings:**

- `0`: No restrictions; all users have full access.
- `1`: Restricts access for the current server session. New database open requests are denied, but administrators can still access databases.
- `2`: Restricts access permanently until the setting is changed. Similar to `1`, new database open requests are denied, but administrators retain access.

*Note:* There are additional undocumented values (`3` and `4`) mentioned in some sources, but their specific behaviors are not officially documented by HCL. It's advisable to stick with the documented values to avoid unexpected behavior. [Source](https://www.madicon.de/notes-ini-parameters/en/server_restricted/)

### Implementing Server Restrictions

To set the `Server_Restricted` parameter:

1. **Access the Server Console:**
   - Open your Domino Administrator client.
   - Navigate to the **Server** tab and select **Status**.
   - Click on **Server Console**.

2. **Set the Parameter:**
   - To restrict access for the current session, enter:
     ```
     set config Server_Restricted=1
     ```
   - To restrict access permanently, enter:
     ```
     set config Server_Restricted=2
     ```

3. **Verify the Setting:**
   - After setting the parameter, it's good practice to verify its value. Enter:
     ```
     show config Server_Restricted
     ```
   - The console should display the current value of the parameter.

*Note:* Setting the parameter via the console applies the change immediately. However, for permanent changes, it's recommended to add the parameter directly to the `notes.ini` file to ensure it persists across server restarts. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html)

### Reverting to Normal Access

Once maintenance or troubleshooting is complete, you'll want to restore normal access:

1. **Remove the Restriction:**
   - Enter the following command in the server console:
     ```
     set config Server_Restricted=0
     ```

2. **Confirm the Change:**
   - Again, verify the setting by entering:
     ```
     show config Server_Restricted
     ```
   - Ensure the value is now `0`.

### Important Considerations

- **Administrator Access:** Even when the server is restricted (`Server_Restricted=1` or `2`), administrators can still access databases. This ensures that necessary administrative tasks can be performed without hindrance.

- **User Communication:** Before restricting server access, inform your users about the maintenance window. Unexpected access restrictions can disrupt workflows and lead to confusion.

- **Testing:** Always test the restriction settings in a controlled environment before applying them to production servers. This ensures you understand the behavior and can anticipate any issues.

## To Review

Utilizing the `Server_Restricted` parameter is a straightforward method to control server access during critical periods. By understanding and implementing this setting, you can ensure that maintenance and administrative tasks are carried out smoothly, without unexpected user interruptions. Always remember to communicate with your user base and test configurations to maintain a stable and efficient Domino environment.
