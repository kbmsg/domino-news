---
title: "Using Server_Restricted for Controlled Maintenance in HCL Domino"
description: "A practical guide on leveraging the Server_Restricted notes.ini parameter to manage server access during maintenance periods in HCL Domino environments."
pubDate: "2026-09-22T00:42:28+08:00"
slug: "server-restricted-maintenance"
tags:
  - "Domino Server"
  - "Security"
  - "Notes.ini"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "Overview of server maintenance"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_overviewofservermaintenance_c.html"
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
slug: server-restricted-maintenance
topicOverlap: false
issues:
  [critical] notes.ini file located in your Domino server's data directory
      problem: The notes.ini file is NOT located in the Domino data directory. It is located in the Domino program directory (e.g., /opt/hcl/domino/notes/latest/linux/ on Linux, or C:\Program Files\HCL\Domino\ on Windows). A reader who searches only the data directory will not find it, and if they create a second notes.ini there it will be ignored or cause confusion.
      fix:     Correct the path: notes.ini is in the Domino program directory, not the data directory. Add a note that the exact path varies by OS and installation choices.
  [major] set config Server_Restricted=1
      problem: The article omits a critical caveat: 'set config' updates notes.ini on disk AND takes effect immediately at the console, but already-authenticated, currently-connected sessions are NOT dropped. Users who are already logged in can continue working. The article implies the restriction is instantaneous for all users, which is misleading and could cause an administrator to believe the server is fully locked when it is not.
      fix:     Add a note that existing open sessions are not terminated by the parameter change. To fully clear connected users, the administrator may also need to use 'drop all' or wait for sessions to time out before beginning sensitive maintenance.
  [major] 2: No one can access the server, not even administrators
      problem: The description of value 2 is slightly inaccurate. Server_Restricted=2 blocks new Notes client and remote connections, but server-to-server replication and certain administrative tasks via the server console remain available. Stating 'no one can access the server' is an oversimplification that could mislead administrators who rely on replication status during a blackout window.
      fix:     Clarify that value 2 blocks interactive user and administrator client connections but does not necessarily halt all server-side processes such as replication or agent scheduling. Check HCL documentation for the precise scope and qualify the statement accordingly.
  [major] Only administrators can open databases. Regular users are locked out.
      problem: The article does not define what 'administrators' means in this context. Server_Restricted=1 grants access to users listed in the server's Administrator field in the Server document, not simply anyone with Manager access to a database or anyone in the Domino Directory Administrators group. This distinction is important and could cause confusion about who actually retains access.
      fix:     Explicitly state that 'administrators' here refers to users named in the Administrator field of the Server document in the Domino Directory, and that other privileged roles (e.g., database managers) are still locked out.
  [major] No version constraint mentioned anywhere in the article
      problem: The article makes no mention of which Domino versions support Server_Restricted or whether the behavior is consistent across versions. Server_Restricted has been present for many releases, but the cited HCL source is pinned to 11.0.1. Readers on older or newer versions (e.g., Domino 12.x, 14.x) deserve confirmation that behavior is unchanged.
      fix:     Add a brief version note, e.g., 'Server_Restricted has been available since at least Domino 8.x and behavior is consistent through Domino 14.x' (verify against current HCL docs), or at minimum note the version scope of the documentation being referenced.
  [major] No mention of the Server_Restricted alternative via the Domino Administrator client
      problem: The article frames notes.ini editing and 'set config' as the only mechanisms. Administrators can also control server access restrictions through the Domino Administrator client (Server... Restrictions tab) and via the server document in the Domino Directory without touching notes.ini directly. Omitting these alternatives presents an incomplete picture.
      fix:     Add a section or note mentioning that Server_Restricted can also be managed through the Server document in the Domino Directory via the Domino Administrator client, which is often safer and auditable.
  [minor] emergency access methods if needed
      problem: The article warns to 'ensure you have alternative access methods' when using Server_Restricted=2 but gives no guidance on what those methods are (e.g., direct console access, SSH to the OS, Domino remote console). This leaves a reader without actionable information at a critical moment.
      fix:     Briefly enumerate practical alternatives: physical or SSH console access to the OS, the Domino remote console, or a crash-recovery runbook, so administrators are not left guessing.
  [minor] Article uses no brand qualifier on 'Domino' in several places
      problem: HCL branding guidelines require 'HCL Domino' on first reference. The article title uses it correctly but the body sometimes just says 'Domino server' or 'Domino server's data directory' without the HCL prefix.
      fix:     Ensure 'HCL Domino' is used on first substantive reference in the body text, with 'Domino' acceptable for subsequent references.
-->

## Understanding the Server_Restricted Parameter

When it's time for server maintenance, you don't want users stumbling into half-finished updates or encountering unexpected errors. That's where the `Server_Restricted` parameter in the `notes.ini` file comes into play. It lets you control who can access the server during these periods.

### What Does Server_Restricted Do?

Setting `Server_Restricted` determines the level of access users have:

- **0**: No restrictions. Everyone can access the server as usual.
- **1**: Only administrators can open databases. Regular users are locked out.
- **2**: No one can access the server, not even administrators.

These settings are crucial when you need to perform maintenance without user interference. For instance, setting it to `1` ensures that only admins can access the server, allowing you to carry out tasks without user disruptions. [Source](https://www.madicon.de/notes-ini-parameters/en/server_restricted/)

## Implementing Server_Restricted

### Temporarily Restricting Access

To change the `Server_Restricted` setting without restarting the server, use the following console command:

```
set config Server_Restricted=1
```

This command restricts access to administrators only. Once maintenance is complete, revert the setting:

```
set config Server_Restricted=0
```

This reopens the server to all users. [Source](https://www.madicon.de/notes-ini-parameters/en/server_restricted/)

### Permanent Changes

For changes that persist after a server restart, edit the `notes.ini` file directly:

1. Open the `notes.ini` file located in your Domino server's data directory.
2. Add or modify the line:

   ```
   Server_Restricted=1
   ```

3. Save the file and restart the server to apply the changes.

Remember, setting `Server_Restricted=2` will block all access, including for administrators, so use it cautiously.

## Practical Use Cases

### Scheduled Maintenance

Before starting maintenance, restrict access to prevent user disruptions:

```
set config Server_Restricted=1
```

After completing the maintenance, reopen access:

```
set config Server_Restricted=0
```

### Emergency Situations

In critical scenarios where immediate action is required, setting `Server_Restricted=2` ensures no one can access the server, allowing you to address the issue without interference. However, be aware that this setting also locks out administrators, so ensure you have alternative access methods if needed.

## To Review

The `Server_Restricted` parameter is a straightforward yet powerful tool for managing server access during maintenance. By understanding and utilizing this setting, you can ensure smoother maintenance periods and minimize user disruptions. Always remember to revert the setting once maintenance is complete to restore normal server operations.
