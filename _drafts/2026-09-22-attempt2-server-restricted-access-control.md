---
title: "Controlling Domino Server Access with Server_Restricted"
description: "A hands-on guide to using the Server_Restricted notes.ini parameter to manage and restrict access to your HCL Domino server during maintenance or critical operations."
pubDate: "2026-09-22T23:14:22+08:00"
slug: "server-restricted-access-control"
tags:
  - "Domino Server"
  - "Security"
  - "Notes.ini"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "The Domino Administrator"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_thedominoadministrator_c.html"
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
  [critical] Restriction Levels: `1`: Only administrators can access the server.
      problem: The article presents Server_Restricted as a binary 0/1 parameter, but it actually accepts three meaningful values: 0 (no restriction), 1 (only users listed in the server document's 'Administer the server from a Notes client' field plus console admins can access), and 2 (the server is completely restricted — NO users, including Notes client administrators, can access it; only the server console works). Omitting value 2 is a critical gap because an administrator who needs a full lockout would not know it exists, and an administrator who accidentally sets 2 thinking it behaves like 1 could lock out all client-based admin access entirely.
      fix:     Add value 2 to the Restriction Levels section and clearly describe its behavior: the server refuses all client connections, including from administrators via Notes client. Warn that recovery from an accidental Server_Restricted=2 requires console access or a direct notes.ini edit followed by a restart.
  [critical] **Note:** Changes made via the console are temporary and will revert upon server restart.
      problem: 'set config' on the Domino console DOES write the value to notes.ini immediately and persistently — it does not revert on restart. This is a fundamental misstatement of how 'set config' works. Telling administrators that the change is temporary when it is actually persistent could cause them to also edit notes.ini directly, resulting in a duplicate or conflicting entry, or give them false confidence that a restart will undo an unintended restriction.
      fix:     Remove or correct this note. State instead that 'set config Server_Restricted=1' writes the value to notes.ini immediately and persists across restarts. If the intent is to apply a temporary restriction only for the current server session without touching notes.ini, a different approach (e.g., editing notes.ini after a future restart is planned) should be described, but 'set config' is not that mechanism.
  [major] Locate the notes.ini File: The `notes.ini` file is typically found in the Domino data directory.
      problem: On most Domino server installations, notes.ini is located in the Domino program directory (e.g., /opt/hcl/domino/notes/latest/linux/ on Linux, or C:\Program Files\HCL\Domino\ on Windows), NOT the data directory. The data directory contains databases and other data files. Conflating the two could cause an administrator to search the wrong directory or, worse, edit the wrong file.
      fix:     Correct the location: notes.ini is in the Domino program directory on the server. Note that on some Windows installations it may be in the Windows directory or elsewhere depending on how Domino was installed, and administrators should verify via the running process or installer documentation.
  [major] Practical Use Cases — Security Incidents: immediately setting `Server_Restricted=1`
      problem: During a live security incident, setting Server_Restricted=1 restricts Notes client user access but does NOT block server-to-server connections, web (HTTP) access, or other protocol access (SMTP, LDAP, etc.) depending on server configuration. Presenting this as a containment measure without those caveats could give administrators a false sense of security and cause them to under-respond to an active breach.
      fix:     Add a caveat that Server_Restricted=1 limits Notes client user access only; other protocols (HTTP, SMTP, LDAP, IMAP, server-to-server replication) may remain active and require separate measures to restrict during a security incident.
  [major] Restriction Levels: `1`: Only administrators can access the server.
      problem: The article does not define who counts as an 'administrator' in the context of Server_Restricted=1. In practice, access is governed by the 'Administer the server from a Notes client' field in the Server document and related security settings — not simply any user with Administrator role in any database. This distinction matters operationally.
      fix:     Clarify that 'administrators' in this context means those listed in the appropriate fields of the Server document in the Domino Directory, and point readers to the Server document security settings for authoritative control over who retains access.
  [minor] Article title and throughout: no version context
      problem: The article does not state which versions of HCL Domino the guidance applies to. Server_Restricted has existed for a long time, but behavior nuances or valid values could vary, and readers on older supported releases deserve confirmation.
      fix:     Add a brief statement of the Domino version range this guidance was validated against (e.g., Domino 12.x and 14.x).
  [minor] Cited source: https://www.madicon.de/notes-ini-parameters/en/server_restricted/
      problem: This is a third-party community site (madicon.de), not an official HCL source. It is cited alongside official HCL documentation without distinguishing it as unofficial. Readers may treat it as authoritative.
      fix:     Label the madicon.de link as a community/unofficial reference and ensure all authoritative claims are backed by the official HCL documentation link.
-->

## Understanding the Server_Restricted Parameter

When performing maintenance or critical operations on your HCL Domino server, it's essential to control user access to prevent disruptions. The `Server_Restricted` notes.ini parameter allows you to restrict server access, ensuring that only administrators can interact with the server during these periods.

## Configuring Server_Restricted

To modify the `Server_Restricted` setting, you can use the Domino server console. Here's how:

1. **Access the Server Console:**
   - Open the Domino Administrator client.
   - Navigate to the **Server** tab and select **Status**.
   - Click on **Server Console**.

2. **Set the Restriction Level:**
   - To restrict access to administrators only, enter:
     ```
     set config Server_Restricted=1
     ```
   - To allow full access to all users, enter:
     ```
     set config Server_Restricted=0
     ```

**Note:** Changes made via the console are temporary and will revert upon server restart. To make permanent changes, edit the `notes.ini` file directly.

## Permanent Configuration via notes.ini

To set the `Server_Restricted` parameter permanently:

1. **Locate the notes.ini File:**
   - The `notes.ini` file is typically found in the Domino data directory.

2. **Edit the File:**
   - Open `notes.ini` with a text editor.
   - Add or modify the line:
     ```
     Server_Restricted=1
     ```
   - Save and close the file.

3. **Restart the Server:**
   - For the changes to take effect, restart the Domino server.

## Restriction Levels

The `Server_Restricted` parameter accepts the following values:

- `0`: No restrictions; all users have access.
- `1`: Only administrators can access the server.

**Important:** Even when access is restricted, administrators retain the ability to open databases and perform necessary tasks. This ensures that maintenance can proceed without interference from regular users.

## Practical Use Cases

- **Scheduled Maintenance:**
  - Before applying updates or patches, set `Server_Restricted=1` to prevent user access and ensure a smooth maintenance process.

- **Troubleshooting:**
  - When diagnosing server issues, restricting access can prevent further complications caused by user activities.

- **Security Incidents:**
  - In the event of a security breach, immediately setting `Server_Restricted=1` can help contain the issue by limiting access.

## To Review

Managing server access is a critical aspect of maintaining a stable and secure Domino environment. By effectively utilizing the `Server_Restricted` parameter, you can control user interactions during maintenance windows, troubleshooting sessions, or security incidents. Always remember to revert the setting (`Server_Restricted=0`) once normal operations resume to restore full user access.

For more detailed information, refer to the [Domino Administrator documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_thedominoadministrator_c.html) and the [Server_Restricted parameter guide](https://www.madicon.de/notes-ini-parameters/en/server_restricted/).
