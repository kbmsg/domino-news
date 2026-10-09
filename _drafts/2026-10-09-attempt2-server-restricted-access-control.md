---
title: "Controlling Server Access with the Server_Restricted Parameter"
description: "A practical guide for Domino administrators on using the Server_Restricted notes.ini parameter to manage server access during maintenance or troubleshooting."
pubDate: "2026-10-09T19:44:37+08:00"
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
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: server-restricted-access-control
topicOverlap: false
issues:
  [critical] `2`: Access is restricted until the server is restarted. Similar to `1`, but the restriction persists across server restarts.
      problem: The description of value 2 is self-contradicting and technically wrong. Server_Restricted=2 means the restriction is PERSISTENT — it survives a server restart because the value is written to notes.ini and remains there. Server_Restricted=1 is the session-only restriction that is cleared when the server restarts. The article has the behavior of 1 and 2 partially reversed in their descriptions, and the phrase 'persists across server restarts' is misleading: value 2 does not add any special restart-survival magic beyond simply being a notes.ini value — but more importantly, value 1 set via 'set config' also writes to notes.ini and persists unless removed, which contradicts the 'current server session only' claim. The functional difference between 1 and 2 is that value 1 restricts non-administrator users from opening databases while value 2 restricts ALL users including those listed as administrators in the Server document (only the console operator/local admin can act). This is a critical behavioral difference that is completely omitted and misrepresented.
      fix:     Accurately document the distinction: Server_Restricted=1 restricts normal users but allows administrators (as defined in the Server document) to still access the server; Server_Restricted=2 restricts ALL users including administrators, with only the Domino console operator retaining access. Clarify persistence behavior: both values written via 'set config' persist in notes.ini across restarts. Verify against current HCL documentation and test in a lab before publishing.
  [critical] Administrator Access: Even when access is restricted, administrators can still open databases
      problem: This statement is only conditionally true. It applies to Server_Restricted=1, where users listed as administrators in the Server document retain access. With Server_Restricted=2, even administrators defined in the Server document are locked out; only the server console operator retains control. Publishing this without the distinction could lead an administrator to set value 2 thinking they can still get in remotely, potentially locking themselves out of a production server.
      fix:     Clearly differentiate behavior by value: state explicitly that administrator access is preserved with value 1 but NOT with value 2, and explain how to recover console access if locked out.
  [major] `1`: Access is restricted for the current server session. Users cannot open new databases, but existing sessions remain active.
      problem: The claim that 'existing sessions remain active' needs clarification. Server_Restricted=1 prevents new database OPEN requests but does not forcibly terminate active sessions. However, saying sessions 'remain active' without caveats overstates continuity — replication and other server-to-server tasks are also affected and this is not mentioned. The article also omits that the Domino HTTP task and other server tasks (SMTP, LDAP, etc.) may or may not be affected depending on version and configuration, which is a meaningful operational caveat.
      fix:     Clarify that existing open database handles may continue but new open requests are blocked, and note that server tasks such as HTTP, SMTP, and replication may also be impacted. Add a version caveat if behavior differs across Domino releases.
  [major] Note: Additional values 3 and 4 are mentioned in some documentation but are less commonly used.
      problem: Mentioning values 3 and 4 without any description of what they do is worse than not mentioning them. A reader may apply them to a production server without understanding their effect. If the article is unsure of these values, they should be omitted rather than vaguely referenced.
      fix:     Either document values 3 and 4 accurately with their precise behavior (sourced from HCL documentation), or remove the reference entirely. Do not publish a vague mention of undescribed parameter values that an administrator might try on a production server.
  [major] Editing the notes.ini File Directly ... Restart the Server (if necessary): Some changes may require a server restart to take effect.
      problem: For Server_Restricted specifically, editing notes.ini directly while the server is running is unreliable — Domino can overwrite notes.ini on shutdown or the running server will not pick up the change without a 'set config' command or restart. The article implies a direct edit takes effect without a restart in some cases ('if necessary'), which is misleading. The preferred and safer method for a live server is always the console command. The article does not warn that direct edits to notes.ini on a running server may be overwritten by Domino.
      fix:     Warn explicitly that notes.ini should not be edited while the Domino server is running because the server may overwrite the file on shutdown, losing the change. Recommend using 'set config' on the console for live changes and reserving direct notes.ini edits for pre-start configuration.
  [minor] notes.ini file is typically found in the Domino data directory
      problem: On Windows, notes.ini is typically in the Domino program directory, not the data directory. On Linux it is in the data directory. This platform difference is relevant for administrators on Windows who may look in the wrong place.
      fix:     Clarify: on Windows, notes.ini is typically in the Domino program directory (e.g., C:\Program Files\HCL\Domino\); on Linux/AIX it is typically in the Domino data directory.
  [minor] Article title and throughout: no version context provided
      problem: The article does not specify which versions of HCL Domino the behavior applies to. The cited HCL help URL references version 11.0.1 specifically. Behavior or supported values could differ in older or newer releases.
      fix:     Add a version scope statement, e.g., 'Tested against HCL Domino 11.0.1 and 12.x; verify behavior on other versions.'
-->

## Managing Server Access with the Server_Restricted Parameter

As a Domino administrator, there are times when you need to restrict access to your server—be it for maintenance, troubleshooting, or other administrative tasks. The `Server_Restricted` parameter in the `notes.ini` file is a straightforward way to control server access without shutting it down completely.

### Understanding the Server_Restricted Parameter

The `Server_Restricted` parameter determines the level of access users have to the Domino server. By setting this parameter, you can control whether the server accepts new database requests from users. Importantly, even when access is restricted, administrators retain the ability to open databases, ensuring that necessary administrative tasks can still be performed.

**Available Values:**

- `0`: No restrictions; the server operates normally.
- `1`: Access is restricted for the current server session. Users cannot open new databases, but existing sessions remain active.
- `2`: Access is restricted until the server is restarted. Similar to `1`, but the restriction persists across server restarts.

*Note:* Additional values `3` and `4` are mentioned in some documentation but are less commonly used. For most administrative purposes, values `0`, `1`, and `2` suffice. [Source](https://www.madicon.de/notes-ini-parameters/en/server_restricted/)

### Implementing Access Restrictions

To modify the `Server_Restricted` parameter, you can either edit the `notes.ini` file directly or use the Domino console. Here's how:

**Using the Domino Console:**

1. **Open the Domino Console:**
   - Access the console through the Domino Administrator client or via a remote session.

2. **Set the Restriction Level:**
   - To restrict access for the current session:
     ```
     set config Server_Restricted=1
     ```
   - To restrict access until the server is restarted:
     ```
     set config Server_Restricted=2
     ```
   - To remove restrictions and restore normal access:
     ```
     set config Server_Restricted=0
     ```

**Editing the notes.ini File Directly:**

1. **Locate the notes.ini File:**
   - Typically found in the Domino data directory.

2. **Open the File:**
   - Use a text editor to open `notes.ini`.

3. **Modify the Parameter:**
   - Add or update the line:
     ```
     Server_Restricted=1
     ```
   - Replace `1` with your desired value (`0`, `1`, or `2`).

4. **Save and Close:**
   - Save the changes and close the editor.

5. **Restart the Server (if necessary):**
   - Some changes may require a server restart to take effect.

*Note:* Directly editing the `notes.ini` file is a more permanent change and should be done with caution. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html)

### Practical Use Cases

- **Scheduled Maintenance:**
  - Before performing server maintenance, set `Server_Restricted=1` to prevent new user sessions while allowing existing ones to conclude naturally.

- **Troubleshooting:**
  - If you're diagnosing server issues and need to prevent user interference, restricting access ensures a controlled environment.

- **Security Measures:**
  - In response to a security incident, restricting access can prevent unauthorized activities while you assess and mitigate the situation.

### Important Considerations

- **Administrator Access:**
  - Even when access is restricted, administrators can still open databases, ensuring that necessary tasks can be performed without interruption.

- **User Communication:**
  - Always inform users ahead of time when you plan to restrict access to avoid confusion and potential data loss.

- **Monitoring:**
  - After setting restrictions, monitor the server to ensure that the desired access control is in effect and that no unintended disruptions occur.

## To Review

The `Server_Restricted` parameter is a valuable tool for managing server access during maintenance or troubleshooting. By understanding and correctly implementing this parameter, you can ensure that your administrative tasks are carried out smoothly while minimizing disruption to users. Always remember to communicate with your user base and monitor the server's behavior after making changes to access settings.
