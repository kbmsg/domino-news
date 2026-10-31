---
title: "Managing Server Access with the Server_Restricted Notes.ini Parameter"
description: "A practical guide on using the Server_Restricted Notes.ini parameter to control HCL Domino server access during maintenance or troubleshooting."
pubDate: "2026-10-31T18:47:47+08:00"
slug: "server-restricted-notes-ini-parameter"
tags:
  - "Domino Server"
  - "Notes.ini"
  - "Security"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "Installation and Configuration of an Additional Domino Server on Windows"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0124228"
relatedConsoleCommands: []
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: server-restricted-notes-ini-parameter
topicOverlap: false
issues:
  [critical] Implementing Server Restrictions – Step 3: Restart the Server
      problem: The article states the server must be restarted for Server_Restricted to take effect. This is incorrect and potentially harmful. Server_Restricted can be changed at runtime via the Domino server console using 'set config Server_Restricted=1' (or =0 to lift it) without any restart. Instructing administrators to restart a production server for this change is unnecessary and could itself cause an outage or disrupt in-flight transactions.
      fix:     Replace the restart instruction with the live console command: 'set config Server_Restricted=1'. Note that a restart is NOT required and NOT recommended for this parameter change. Optionally mention that editing notes.ini directly does also require a restart, but that the console method is preferred during live maintenance.
  [critical] notes.ini file in your Domino server's data directory
      problem: The notes.ini file is located in the Domino program directory (e.g., /opt/hcl/domino/notes/latest/linux/ on Linux, or C:\Program Files\HCL\Domino\ on Windows), not the data directory. The data directory holds databases, templates, and server ID files. Pointing an admin to the wrong directory could cause them to miss the file or edit the wrong one.
      fix:     Correct the location to the Domino program directory. Acknowledge that in some older or custom installations the file may reside elsewhere, and advise confirming the path before editing.
  [major] Available Values – value 1 only and vague mention of 3 and 4
      problem: The article incompletely documents the supported values. Server_Restricted=2 is a well-documented value that restricts the server to administrators only (more restrictive than 1, which only blocks new database opens for non-admins). Values 1 and 2 have meaningfully different behaviors that administrators need to understand. Dismissing values 3 and 4 as 'less commonly used' without explanation is also misleading; administrators deserve accurate detail or an explicit 'not supported / behavior undefined' caveat.
      fix:     Document all supported values accurately: 0 = no restriction, 1 = only administrators can open databases (users get an error on new opens), 2 = server is completely restricted (no connections accepted except console). Verify values 3 and 4 against HCL documentation and either document them accurately or explicitly state they are not supported/documented.
  [major] Practical Use Case – 'install an additional Domino server'
      problem: The use case describes using Server_Restricted=1 while installing an additional Domino server. This scenario is confused: installing a separate Domino server is done on a different machine and does not require restricting the existing server. The parameter is relevant for maintenance on the server where it is set. The example misleads readers about when and why to apply this setting.
      fix:     Replace with a realistic use case such as: applying a fix pack, running a database consistency check (fixup), performing DAOS re-synchronization, or doing a backup that requires quiescing user activity on that specific server.
  [major] Understanding the Server_Restricted Parameter – 'preventing new database requests'
      problem: The description of what Server_Restricted=1 blocks is oversimplified. The parameter does not simply block 'new database requests' generically — it blocks non-administrator users from opening databases on the server. Existing open sessions/databases are typically not dropped immediately. The article omits that administrators are identified by their presence in the server's Administration ECL / 'Administrators' field in the Server document, which is a critical caveat.
      fix:     Clarify that existing user sessions are not forcibly terminated and that 'administrator' access is determined by the Administrators field in the Server document in the Domino Directory. Also note the behavior differs slightly between Notes client access and HTTP/IMAP/other internet protocol sessions.
  [minor] Article title and throughout – 'Notes.ini'
      problem: The file name is conventionally lowercased as 'notes.ini' on case-sensitive file systems (Linux/AIX). Capitalizing it as 'Notes.ini' in the title could cause confusion for administrators on Unix-based systems who might try to locate or reference a file with that exact casing.
      fix:     Use 'notes.ini' consistently in lowercase throughout, or add a note that on Linux/AIX the filename is case-sensitive and is lowercase.
  [minor] UTM parameters on cited URLs – '?utm_source=openai'
      problem: Both cited URLs contain '?utm_source=openai' tracking parameters appended to them, indicating these links were generated by an AI assistant rather than manually verified by the author. This raises a concern about whether the author actually reviewed the source pages, and the tracking parameters will appear in the published article.
      fix:     Remove the UTM parameters from all cited URLs and verify each source was actually reviewed before publication.
-->

## Managing Server Access with the Server_Restricted Notes.ini Parameter

Ever needed to perform maintenance on your Domino server without users interrupting the process? The `Server_Restricted` parameter in the `notes.ini` file is your go-to tool for controlling server access during such times. Here's how to use it effectively.

### Understanding the Server_Restricted Parameter

The `Server_Restricted` parameter allows you to restrict access to your Domino server, preventing new database requests while still permitting administrators to perform necessary tasks. This is particularly useful during maintenance windows or when troubleshooting issues that require minimal user interference.

**Available Values:**

- `0`: No restrictions; the server operates normally.
- `1`: Restricts access for the current server session. Users cannot open new databases, but administrators can.

*Note:* While values `3` and `4` are mentioned in some documentation, their specific functionalities are less commonly used and may not be applicable in standard scenarios. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/server_restricted/?utm_source=openai))

### Implementing Server Restrictions

To restrict server access:

1. **Edit the notes.ini File:**
   - Locate the `notes.ini` file in your Domino server's data directory.
   - Open it with a text editor.

2. **Add or Modify the Parameter:**
   - To restrict access for the current session, add or modify the line:
     ```
     Server_Restricted=1
     ```

3. **Restart the Server:**
   - For the changes to take effect, restart your Domino server.

*Important:* Always back up your `notes.ini` file before making changes. Incorrect configurations can lead to server issues.

### Practical Use Case

Imagine you're planning to install an additional Domino server and need to ensure that no new database requests interfere during the setup. By setting `Server_Restricted=1`, you can perform the installation and initial configuration without user interruptions. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0124228&utm_source=openai))

### To Review

- **Purpose:** The `Server_Restricted` parameter controls server access, allowing administrators to perform maintenance without user interference.
- **Values:**
  - `0`: No restrictions.
  - `1`: Restricts access for the current session; administrators can still access databases.
- **Implementation:** Modify the `notes.ini` file and restart the server for changes to take effect.

By effectively utilizing the `Server_Restricted` parameter, you can manage server access during critical operations, ensuring a smoother maintenance process.
