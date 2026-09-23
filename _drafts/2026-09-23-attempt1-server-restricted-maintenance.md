---
title: "Using Server_Restricted for Controlled Maintenance in HCL Domino"
description: "A practical guide on leveraging the Server_Restricted notes.ini parameter to manage server access during maintenance, ensuring minimal disruption and enhanced security."
pubDate: "2026-09-23T23:20:49+08:00"
slug: "server-restricted-maintenance"
tags:
  - "Domino Server"
  - "Security"
  - "Notes.ini"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Need >= 2 sources, got 1.
  - At least one source should come from a trusted Domino-related host. Got: https://www.madicon.de/notes-ini-parameters/en/server_restricted/
  - Body must have >= 2 inline links, got 1.
attempt: 1
slug: server-restricted-maintenance
-->

## Managing Server Access During Maintenance with Server_Restricted

When it's time for server maintenance, you don't want users stumbling into half-finished updates or encountering errors. That's where the `Server_Restricted` parameter in the `notes.ini` file comes into play. It lets you control who can access the server during these periods, ensuring a smoother maintenance process.

### What is Server_Restricted?

The `Server_Restricted` parameter determines the level of access users have to the Domino server. By setting this parameter, you can restrict access to prevent new database requests while allowing administrators to perform necessary tasks.

### Configuring Server_Restricted

To set this up, you'll need to modify the `notes.ini` file on your Domino server. Here's how:

1. **Access the Server Console:**
   - Open your Domino Administrator client.
   - Navigate to the server console.

2. **Set the Parameter:**
   - Enter the following command:
     ```
     set config Server_Restricted=1
     ```
   - This command sets the server to a restricted mode where only administrators can access databases.

3. **Verify the Setting:**
   - To confirm the change, you can check the current value by entering:
     ```
     show config Server_Restricted
     ```
   - The console should display the current setting of the parameter.

### Understanding the Values

The `Server_Restricted` parameter accepts the following values:

- `0`: No restrictions; all users can access the server.
- `1`: Only administrators can access databases; new user requests are denied.
- `2`: No new user requests are accepted; existing sessions continue until they end naturally.

By setting `Server_Restricted=1`, you ensure that during maintenance, only administrators can access the server, preventing users from encountering issues or incomplete updates.

### Practical Use Case

Imagine you're about to apply a critical update to your Domino server. You don't want users accessing the server during this process, as it could lead to data corruption or incomplete transactions. By setting `Server_Restricted=1`, you effectively lock out regular users, allowing only administrators to perform the update. Once maintenance is complete, you can revert the setting to `0` to restore normal access.

### Important Considerations

- **Communication:** Always inform your users about planned maintenance windows and expected downtimes.
- **Testing:** Before applying changes, test the `Server_Restricted` settings in a controlled environment to ensure they work as expected.
- **Monitoring:** Keep an eye on the server console for any unexpected behavior during the restricted period.

For more detailed information on the `Server_Restricted` parameter, refer to the [Madicon documentation](https://www.madicon.de/notes-ini-parameters/en/server_restricted/).

## To Review

Utilizing the `Server_Restricted` parameter is a straightforward yet effective method to manage server access during maintenance periods. By restricting access to administrators, you can perform updates and other critical tasks without user interference, ensuring the stability and security of your Domino environment.
