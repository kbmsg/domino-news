---
title: "Using Server_Restricted to Control Domino Server Access"
description: "A practical guide on configuring the Server_Restricted setting in HCL Domino to manage server access during maintenance or troubleshooting."
pubDate: "2026-09-23T23:20:56+08:00"
slug: "server-restricted-maintenance"
tags:
  - "Domino Server"
  - "Security"
  - "Notes.ini"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
  - "set config Server_Restricted=0"
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Slug collision: "server-restricted-maintenance" already exists. The model ignored the FORBIDDEN SLUGS list, refusing to overwrite an existing post.
  - Need >= 2 sources, got 1.
  - At least one source should come from a trusted Domino-related host. Got: https://www.madicon.de/notes-ini-parameters/en/server_restricted/
  - Body must have >= 2 inline links, got 1.
attempt: 2
slug: server-restricted-maintenance
-->

## Understanding Server_Restricted in HCL Domino

When performing maintenance or troubleshooting on your HCL Domino server, it's crucial to control user access to prevent disruptions. The `Server_Restricted` setting in the `notes.ini` file allows you to manage this access effectively.

## What is Server_Restricted?

The `Server_Restricted` parameter determines the level of access users have to the Domino server. By configuring this setting, you can restrict or allow access as needed. The available values are:

- `0`: No restrictions; all users can access the server.
- `1`: Only administrators can access the server; all other users are denied.
- `2`: No new user sessions are allowed; existing sessions continue until they end naturally.

## Configuring Server_Restricted

To modify the `Server_Restricted` setting:

1. **Access the Domino Server Console:**
   - Open the Domino Administrator client.
   - Navigate to the **Server** tab and select **Status**.
   - Click on **Server Console**.

2. **Set the Desired Restriction Level:**
   - To restrict access to administrators only:
     ```
     set config Server_Restricted=1
     ```
   - To prevent new user sessions:
     ```
     set config Server_Restricted=2
     ```
   - To remove restrictions:
     ```
     set config Server_Restricted=0
     ```

3. **Verify the Change:**
   - After setting the parameter, monitor the server console for confirmation messages indicating the change has been applied.

**Note:** Changes made via the server console are temporary and will revert upon server restart. To make permanent changes, edit the `notes.ini` file directly:

1. **Locate the `notes.ini` File:**
   - Typically found in the Domino data directory.

2. **Edit the File:**
   - Open `notes.ini` with a text editor.
   - Add or modify the line:
     ```
     Server_Restricted=1
     ```
   - Save and close the file.

3. **Restart the Domino Server:**
   - This ensures the changes take effect.

## Practical Use Cases

- **Maintenance Windows:**
  - Set `Server_Restricted=1` to allow only administrators to access the server during maintenance, preventing user interference.

- **Troubleshooting:**
  - Use `Server_Restricted=2` to prevent new user sessions while allowing existing ones to conclude, facilitating a smoother troubleshooting process.

## Important Considerations

- **Administrator Access:**
  - Even when restrictions are in place, administrators retain access to the server.

- **Communication:**
  - Inform users about planned restrictions to avoid confusion and ensure a smooth maintenance process.

- **Testing:**
  - Before applying restrictions in a production environment, test the settings in a controlled environment to understand their impact.

## To Review

The `Server_Restricted` setting is a valuable tool for managing server access during critical operations. By understanding and configuring this parameter appropriately, you can ensure server stability and security during maintenance or troubleshooting activities.

For more detailed information, refer to the [Server_Restricted – Control Server Access (HCL Domino)](https://www.madicon.de/notes-ini-parameters/en/server_restricted/) documentation.
