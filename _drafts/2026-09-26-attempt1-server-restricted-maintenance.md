---
title: "Using Server_Restricted for Controlled Maintenance in HCL Domino"
description: "A practical guide on leveraging the Server_Restricted notes.ini parameter to manage server access during maintenance windows in HCL Domino environments."
pubDate: "2026-09-26T17:46:37+08:00"
slug: "server-restricted-maintenance"
tags:
  - "Domino Server"
  - "Security"
  - "Notes.ini"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "Administration tools"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html"
relatedConsoleCommands: []
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: server-restricted-maintenance
topicOverlap: false
issues:
  [critical] Restart the Server: For the changes to take effect, restart your Domino server.
      problem: Server_Restricted does NOT require a server restart to take effect. It is a dynamic notes.ini parameter that can be set live from the server console using 'set config Server_Restricted=1' and takes effect immediately without restarting. Instructing administrators to restart a production server to activate this parameter is unnecessary and potentially disruptive — and defeats part of the purpose of using the parameter (graceful access control without downtime).
      fix:     Replace the restart step with the console command method: 'set config Server_Restricted=1' issued at the server console or via a remote console takes effect immediately. Also mention that editing notes.ini directly while the server is running may not be picked up without a restart, so the console command is the preferred live method. Remove the restart instruction or clearly qualify it as only applicable if the server is already down.
  [critical] Reverting Changes: remember to set Server_Restricted back to 0 and restart the server
      problem: Again, the article incorrectly states a restart is required to revert the setting. This compounds the first error: an administrator following this literally would restart a production server twice (once to restrict, once to unrestrict) when neither restart is needed. A restart to unrestrict after maintenance could itself cause an outage.
      fix:     Replace with: issue 'set config Server_Restricted=0' at the server console. No restart is required. Optionally note that the notes.ini file will be updated automatically when the console command is used.
  [major] Value 2: No new database opens are allowed; existing sessions continue until they end naturally.
      problem: The description of value 2 is incomplete and potentially misleading. Server_Restricted=2 blocks ALL new connections/database opens from ALL users including administrators (not just regular users), which is a significantly more aggressive lock-down than the article implies. The phrasing 'existing sessions continue until they end naturally' is accurate but the article does not warn that setting this on a busy server could leave many open sessions for an extended and unpredictable time before the server is truly quiesced.
      fix:     Clarify that value 2 restricts new database opens for all users including administrators. Add a caveat that quiescing may take considerable time on a busy server, and that administrators should monitor active sessions (e.g., via 'show users' console command) before proceeding with maintenance steps that require a fully idle server.
  [major] notes.ini file is typically found in the Domino data directory
      problem: This is inaccurate. On most platforms (Windows, Linux) notes.ini for the server is located in the Domino program directory, not the data directory. The data directory location is more common for the Notes client. Administrators acting on this could search in the wrong place.
      fix:     Correct to: 'notes.ini is typically found in the Domino program directory (e.g., /opt/hcl/domino/notes/latest/linux on Linux, or C:\Program Files\HCL\Domino on Windows). On some installations the location may differ; check the server startup configuration if unsure.'
  [major] Only administrators can open databases; regular users are restricted.
      problem: The article does not define what 'administrators' means in this context. Server_Restricted=1 allows access to users listed in the 'Administrators' field of the Server document in the Domino Directory, not simply anyone with an admin role on a database. This is an important distinction that could cause confusion about who actually retains access.
      fix:     Clarify that 'administrators' here means users listed in the Administrators field of the server's Server document in the Domino Directory (names.nsf), not database-level administrators or users with admin roles in individual databases.
  [major] For more detailed information on these settings, refer to the Server_Restricted – Control Server Access (HCL Domino) documentation (https://www.madicon.de/notes-ini-parameters/en/server_restricted/)
      problem: The primary citation for a production-impacting notes.ini parameter points to a third-party site (madicon.de), not to official HCL documentation. While madicon.de is a known community resource, it should not be the primary reference for authoritative parameter behavior. The HCL official documentation (help.hcl-software.com) should be the primary source, and the community resource can be listed as supplementary.
      fix:     Link first to the official HCL Domino documentation for Server_Restricted on help.hcl-software.com and demote the madicon.de reference to a secondary/community resource.
  [major] https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html
      problem: The HCL documentation link references Domino version 11.0.1. Current shipping releases are 12.x and 14.x. Linking to 11.0.1 documentation in a new article signals outdated content and may point readers to documentation that does not reflect current behavior or UI.
      fix:     Update the link to the current Domino release documentation (v14 or at minimum v12) or use the version-agnostic URL if HCL provides one.
  [minor] Edit the File: Open notes.ini with a text editor.
      problem: The article does not caution that editing notes.ini directly while the server is running is generally not recommended and changes may not be picked up reliably without a restart, whereas the console command approach is safe and immediate. This omission could lead an administrator to edit the file live and wonder why nothing changed.
      fix:     Add a note that direct file editing is best done when the server is stopped, and that the preferred live method is the 'set config' console command.
  [minor] To Review
      problem: Section header 'To Review' is an unusual label for a conclusion/summary section and could be confused with the editorial review note. 'Summary' or 'Conclusion' would be clearer.
      fix:     Rename to 'Summary' or 'Conclusion'.
-->

## Managing Server Access During Maintenance with Server_Restricted

When it's time for server maintenance, you don't want users stumbling into half-finished updates or encountering unexpected errors. That's where the `Server_Restricted` parameter in your `notes.ini` file comes into play. It lets you control who gets in and who stays out during those critical periods.

### What is Server_Restricted?

The `Server_Restricted` parameter determines the level of access users have to your Domino server. By setting this parameter, you can restrict access to ensure that only authorized personnel can interact with the server during maintenance or other sensitive operations.

### Configuring Server_Restricted

To set this up, you'll need to edit the `notes.ini` file on your Domino server. Here's how:

1. **Locate the notes.ini File**: This file is typically found in the Domino data directory.

2. **Edit the File**: Open `notes.ini` with a text editor.

3. **Add or Modify the Parameter**: Insert or update the following line:

   ```
   Server_Restricted=1
   ```

   This setting restricts access to the server, allowing only administrators to open databases. Regular users will be unable to access the server during this time.

4. **Save and Close**: After making the change, save the file and close the editor.

5. **Restart the Server**: For the changes to take effect, restart your Domino server.

### Understanding the Parameter Values

The `Server_Restricted` parameter can be set to different values, each dictating a specific level of access:

- `0`: No restrictions; all users have access.
- `1`: Only administrators can open databases; regular users are restricted.
- `2`: No new database opens are allowed; existing sessions continue until they end naturally.

For more detailed information on these settings, refer to the [Server_Restricted – Control Server Access (HCL Domino)](https://www.madicon.de/notes-ini-parameters/en/server_restricted/) documentation.

### Practical Application

Imagine you're about to perform a critical update on your Domino server. You don't want users accessing databases during this time, as it could lead to data corruption or incomplete transactions. By setting `Server_Restricted=1`, you ensure that only administrators can access the server, allowing you to carry out maintenance without user interference.

### Important Considerations

- **Communication**: Always inform your users about planned maintenance windows. Unexpected access restrictions can lead to confusion and frustration.

- **Testing**: Before applying the restriction on a production server, test it in a controlled environment to ensure it behaves as expected.

- **Reverting Changes**: Once maintenance is complete, remember to set `Server_Restricted` back to `0` and restart the server to restore normal access.

### To Review

Utilizing the `Server_Restricted` parameter is a straightforward yet effective method to manage server access during maintenance periods. By understanding and correctly implementing this setting, you can ensure smoother maintenance operations and maintain the integrity of your Domino server environment.

For further reading on administration tools and best practices, consult the [Administration tools](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html) documentation.
