---
title: "Controlling Domino Server Access with Server_Restricted"
description: "A practical guide on using the Server_Restricted notes.ini parameter to manage and restrict access to your HCL Domino server during maintenance or critical operations."
pubDate: "2026-09-25T18:05:08+08:00"
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
  - Body must have >= 2 inline links, got 1.
attempt: 2
slug: server-restricted-access-control
-->

## Managing Server Access with the `Server_Restricted` Parameter

When performing maintenance or critical operations on your HCL Domino server, it's essential to control who can access the server to prevent disruptions. The `Server_Restricted` notes.ini parameter allows you to restrict server access effectively. Here's how to use it.

### Understanding `Server_Restricted`

The `Server_Restricted` parameter determines the level of access users have to the Domino server. By setting this parameter, you can control whether the server accepts new database requests from users. Administrators retain access regardless of the setting, ensuring they can perform necessary tasks without interruption.

**Available Values:**

- `0`: No restrictions; the server operates normally.
- `1`: The server does not accept new database open requests from users.
- `2`: The server does not accept new database open requests from users or servers.

*Note:* Values `3` and `4` are mentioned in some documentation but are not officially documented by HCL. Use them with caution.

### Implementing `Server_Restricted`

To apply the `Server_Restricted` setting:

1. **Access the Server's Notes.ini File:**
   - Locate the `notes.ini` file in your Domino server's data directory.

2. **Edit the Notes.ini File:**
   - Open the file with a text editor.
   - Add or modify the line:
     
     ```
     Server_Restricted=1
     ```
     
     Replace `1` with the desired restriction level.

3. **Save and Close the File:**
   - After making the changes, save the file and close the editor.

4. **Restart the Domino Server:**
   - For the changes to take effect, restart the Domino server.

### Verifying the Setting

After restarting, verify the server's status:

- **Check Server Logs:**
  - Review the server logs to confirm that the `Server_Restricted` setting is active.

- **Test Access:**
  - Attempt to open a database from a user account to ensure that access is appropriately restricted.

### Important Considerations

- **Administrator Access:**
  - Even with restrictions, administrators can still access databases. This ensures that maintenance tasks can be performed without hindrance.

- **Communication:**
  - Inform users about the maintenance window and the expected unavailability to prevent confusion.

- **Reverting Changes:**
  - Once maintenance is complete, remember to revert the `Server_Restricted` setting to `0` and restart the server to restore normal operations.

### Additional Resources

For more detailed information, refer to the [HCL Domino Administration Tools Documentation](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html).

## To Review

Utilizing the `Server_Restricted` parameter is a straightforward method to control server access during critical operations. By understanding and implementing this setting, you can ensure that maintenance tasks are performed smoothly without unexpected user interactions.
