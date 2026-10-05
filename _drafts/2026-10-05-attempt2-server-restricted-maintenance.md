---
title: "Using Server_Restricted for Controlled Maintenance in HCL Domino"
description: "A practical guide on leveraging the Server_Restricted setting to manage server access during maintenance windows in HCL Domino environments."
pubDate: "2026-10-05T20:08:53+08:00"
slug: "server-restricted-maintenance"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "HCL Domino 14.5 Documentation"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
  - "set config Server_Restricted=0"
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/?utm_source=openai" appears 3/3 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 2
slug: server-restricted-maintenance
-->

## Understanding Server_Restricted in HCL Domino

When it's time for server maintenance, you don't want users or processes interfering. That's where the `Server_Restricted` setting comes into play. It lets you control who can access your Domino server during these periods.

## What Does Server_Restricted Do?

The `Server_Restricted` parameter in the `notes.ini` file determines the level of access to your Domino server:

- **0**: No restrictions. Everyone has access.
- **1**: Restricts access for the current session. Resets upon server restart.
- **2**: Restricts access persistently, even after a restart.
- **3**: Like `1`, but also blocks replication from non-administrator IDs.
- **4**: Like `2`, but also blocks replication from non-administrator IDs.

*Note*: Even with restrictions, administrators can still access databases. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/server_restricted/?utm_source=openai))

## Implementing Server_Restricted

### Temporary Restriction (Session-Based)

To restrict access for the current session:

1. Open the server console.
2. Enter:

   ```
   set config Server_Restricted=1
   ```

This setting will lift once the server restarts.

### Persistent Restriction

For a restriction that persists across restarts:

1. Open the server console.
2. Enter:

   ```
   set config Server_Restricted=2
   ```

To remove the restriction later:

1. Open the server console.
2. Enter:

   ```
   set config Server_Restricted=0
   ```

### Blocking Non-Admin Replication

If you need to block replication from non-administrator IDs:

1. Open the server console.
2. Enter:

   ```
   set config Server_Restricted=4
   ```

This setting remains until you change it.

## Important Considerations

- **Replication**: Settings `1` and `2` don't block replication. To block replication from non-admin IDs, use `3` or `4`. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/server_restricted/?utm_source=openai))

- **Protocol Limitations**: `Server_Restricted` affects NRPC connections but doesn't restrict HTTP, IMAP, or POP3 client requests. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/server_restricted/?utm_source=openai))

- **Cluster Environments**: In clustered setups, using `Server_Restricted` can trigger failover, redirecting clients to other cluster members.

## To Review

The `Server_Restricted` setting is a straightforward way to manage server access during maintenance. By understanding and applying the appropriate values, you can ensure smooth maintenance operations without unexpected interruptions.
