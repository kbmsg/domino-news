---
title: "Managing Server Access with the Server_Restricted Parameter"
description: "Learn how to control HCL Domino server access using the Server_Restricted notes.ini parameter to manage maintenance periods and enhance security."
pubDate: "2026-09-16T23:12:53+08:00"
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
relatedConsoleCommands: []
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Body must have >= 3 inline links, got 1.
attempt: 1
slug: server-restricted-access-control
-->

## Managing Server Access with the Server_Restricted Parameter

As HCL Domino administrators, there are times when we need to restrict server access—be it for maintenance, troubleshooting, or security reasons. The `Server_Restricted` parameter in the `notes.ini` file provides a straightforward method to control server accessibility.

### Understanding the Server_Restricted Parameter

The `Server_Restricted` parameter determines the level of access allowed to the Domino server. By configuring this setting, you can control whether users can open databases or if access is limited to administrators.

**Available Values:**

- `0`: No restrictions; all users can access the server.
- `1`: Only administrators can access the server; regular users are denied.
- `2`: No new database open requests are accepted; existing sessions continue.

*Note:* Additional values `3` and `4` are mentioned in HCL's knowledge base article KB0033359, but their specific functionalities are not detailed in the provided sources.

### Implementing Server Access Restrictions

To modify the `Server_Restricted` setting:

1. **Edit the notes.ini File:**
   - Locate the `notes.ini` file on your Domino server.
   - Open it with a text editor.
   - Add or modify the line: `Server_Restricted=1` (or the desired value).

2. **Restart the Domino Server:**
   - For the changes to take effect, restart the Domino server.

*Important:* Always ensure you have a backup of the `notes.ini` file before making changes.

### Practical Use Cases

- **Scheduled Maintenance:**
  - Set `Server_Restricted=1` to allow only administrators to access the server during maintenance windows.

- **Security Incidents:**
  - In case of a security breach, setting `Server_Restricted=2` can prevent new user sessions while allowing current sessions to conclude.

- **Performance Troubleshooting:**
  - Restricting access can help in diagnosing performance issues without user interference.

### Considerations

- **Administrator Access:**
  - Even when restrictions are in place, administrators retain access to the server.

- **Communication:**
  - Inform users about planned restrictions to avoid confusion and ensure a smooth maintenance process.

- **Testing:**
  - Before applying restrictions in a production environment, test the settings in a controlled environment to understand their impact.

For more detailed information on administration tools and server management, refer to HCL's official documentation on [Administration tools](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html).

By effectively utilizing the `Server_Restricted` parameter, you can manage server access during critical periods, ensuring both security and operational efficiency.
