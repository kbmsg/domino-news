---
title: "Managing Server Access with the Server_Restricted Parameter"
description: "A practical guide on using the Server_Restricted notes.ini parameter to control HCL Domino server access during maintenance or troubleshooting."
pubDate: "2026-09-27T18:26:04+08:00"
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
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_administrationtools_c.html"
relatedConsoleCommands: []
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Body must have >= 2 inline links, got 1.
attempt: 2
slug: server-restricted-access-control
-->

## Managing Server Access with the Server_Restricted Parameter

When performing maintenance or troubleshooting on your HCL Domino server, it's often necessary to restrict user access temporarily. The `Server_Restricted` parameter in the `notes.ini` file provides a straightforward way to control server availability without shutting it down completely.

### Understanding the Server_Restricted Parameter

The `Server_Restricted` parameter determines the level of access users have to the Domino server. By setting this parameter, you can control whether the server accepts new database requests from users. Importantly, administrators retain the ability to access databases even when restrictions are in place.

**Available Values:**

- `0`: No restrictions; the server operates normally.
- `1`: The server does not accept new database open requests from users.
- `2`: The server does not accept new database open requests from users or administrators.

*Note:* Values `3` and `4` are mentioned in some documentation but are not officially documented by HCL. Use them with caution and test in a controlled environment before deployment.

### Implementing Server Restrictions

To apply the `Server_Restricted` parameter:

1. **Edit the notes.ini File:**
   - Locate the `notes.ini` file in your Domino server's data directory.
   - Open it with a text editor.

2. **Add or Modify the Parameter:**
   - To restrict user access while allowing administrators:
     ```
     Server_Restricted=1
     ```
   - To restrict all access, including administrators:
     ```
     Server_Restricted=2
     ```

3. **Save and Restart the Server:**
   - Save the changes to the `notes.ini` file.
   - Restart the Domino server to apply the new settings.

### Practical Use Cases

- **Scheduled Maintenance:**
  Before performing updates or maintenance tasks, set `Server_Restricted=1` to prevent user access while allowing administrators to work uninterrupted.

- **Troubleshooting:**
  If the server is experiencing issues, restricting access can prevent further complications from user activity.

- **Security Incidents:**
  In the event of a security breach, setting `Server_Restricted=2` can halt all access, mitigating potential damage.

### Important Considerations

- **Administrator Access:**
  Even with `Server_Restricted=1`, administrators can access databases. Ensure that only authorized personnel have administrative privileges.

- **Communication:**
  Inform users about planned restrictions to avoid confusion and reduce support inquiries.

- **Testing:**
  Before applying restrictions in a production environment, test the settings in a controlled environment to ensure they behave as expected.

For more detailed information, refer to the [HCL Domino Administration Tools Documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_administrationtools_c.html).

## To Review

Utilizing the `Server_Restricted` parameter is an effective method to manage server access during critical operations. By understanding and implementing this setting appropriately, you can maintain server integrity and ensure smooth maintenance processes.
