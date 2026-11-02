---
title: "Using Server_Restricted for Maintenance in HCL Domino"
description: "A practical guide on leveraging the Server_Restricted setting to manage server access during maintenance windows in HCL Domino environments."
pubDate: "2026-11-02T21:16:23+08:00"
slug: "server-restricted-maintenance"
tags:
  - "Domino Server"
  - "Notes.ini"
  - "Tutorial"
sources:
  - title: "Server_Restricted – Control Server Access (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_restricted/"
  - title: "HCL Domino 14.5.1 Documentation: Server_Restricted"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/conf_server_restricted_r.html"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
  - "set config Server_Restricted=0"
notesIniSettings:
  - "Server_Restricted"
draft: true
---
<!--
REJECTED DRAFT - 1 critical fact issue(s)
attempt: 1
slug: server-restricted-maintenance
topicOverlap: false
issues:
  [critical] Replication Continues: Even with restrictions, replication between servers continues.
      problem: This is only partially true and is dangerously misleading. Values 3 and 4 explicitly block replication by non-admin servers/users. The article itself defines values 3 and 4 as 'Non-admins can't open databases OR REPLICATE', which directly contradicts the blanket statement that 'replication between servers continues' regardless of the restriction level. An admin following this article who sets Server_Restricted=3 or =4 expecting replication to continue will be wrong, potentially leaving cluster partners or hub servers out of sync without realising it.
      fix:     Qualify the statement: replication continues only when Server_Restricted is set to 1 or 2. At levels 3 and 4, replication initiated by non-admin servers is also blocked. Admins should plan accordingly and consider whether hub-spoke or cluster replication schedules will be affected before choosing level 3 or 4.
  [major] HTTP, IMAP, and POP3: The Server_Restricted setting primarily affects NRPC connections. HTTP, IMAP, and POP3 client requests aren't restricted by this setting.
      problem: This is an oversimplification that may be incorrect depending on the Domino release and configuration. In many Domino versions, Server_Restricted does affect HTTP access as well, because the HTTP task itself may check the restriction flag before serving database requests. Presenting HTTP/IMAP/POP3 as universally unaffected could cause an administrator to leave those services running under the false belief users will be blocked only at the NRPC layer, when in practice the behaviour may differ. No version caveat or source is given to support the claim.
      fix:     Test and document the actual behaviour for HTTP/IMAP/POP3 against a specific Domino release, cite the HCL documentation explicitly on this point, and add a caveat that administrators should verify behaviour in their own environment or disable the relevant tasks (e.g., 'tell http quit') during maintenance if full isolation is required.
  [major] Admins Always Have Access: Admins can still access databases
      problem: The article does not define who counts as an 'admin' in this context. Server_Restricted honours the server's Administrators field in the Server document and the LocalDomainAdmins group, not just anyone with Manager ACL access to a database. A reader might assume their database Manager-level ID bypasses the restriction when it does not unless that ID is listed in the server's administrator list.
      fix:     Clarify that 'admins' here means identities listed in the Administrators field of the Server document (or members of the LocalDomainAdmins group as configured), not simply users with high ACL roles on individual databases.
  [major] set config Server_Restricted=1 ... This immediately restricts access for the current session.
      problem: The article does not mention that using 'set config' writes the value to notes.ini on disk as well as applying it in memory. For a setting intended to be temporary (reset on restart), administrators may prefer to know that the on-disk notes.ini is being modified, and that if the server crashes and restarts unexpectedly during maintenance it will come back unrestricted (value 1 resets), which is the desired behaviour — but this nuance is never explained. More importantly, the article does not mention the alternative of setting Server_Restricted directly in the Server document via the Domino Administrator client, which is the GUI approach many admins use and which also persists across restarts for values 2 and 4.
      fix:     Note that 'set config' modifies notes.ini on disk and explain the restart-reset behaviour clearly. Also mention the Domino Administrator client / Server document as an alternative method for setting persistent restriction levels.
  [minor] This immediately restricts access for the current session.
      problem: The phrase 'current session' is ambiguous. It is not a user session; the restriction applies to the running server process until it is restarted. 'Current server session' or 'until the next server restart' would be clearer.
      fix:     Replace 'current session' with 'until the next server restart' for clarity.
  [minor] Article title and throughout: no mention of version constraints
      problem: The cited HCL documentation URL references Domino 14.5.1, but the article presents all behaviour as version-agnostic. There is no statement about which minimum Domino version supports which parameter values, or whether behaviour changed across major releases.
      fix:     Add a brief note stating which Domino versions the guidance applies to, or at minimum note that the linked documentation targets version 14.5.1 and readers on earlier versions should consult their release-specific documentation.
-->

## Managing Server Access During Maintenance with Server_Restricted

When it's time for server maintenance, you don't want users stumbling into half-finished updates or getting booted mid-task. That's where the `Server_Restricted` setting in HCL Domino comes in handy. It lets you control who gets in and who stays out during those critical maintenance windows.

### What is Server_Restricted?

The `Server_Restricted` parameter in the `notes.ini` file dictates the server's accessibility:

- **0**: No restrictions. Everyone's welcome.
- **1**: Restricts access for the current session. Non-admins can't open databases, but admins can. Resets on server restart.
- **2**: Like `1`, but persists after a restart. Non-admins stay out until you change it.
- **3**: Tightens the screws further. Non-admins can't open databases or replicate. Resets on restart.
- **4**: Same as `3`, but sticks around after a restart.

For a deep dive, check out [this detailed explanation](https://www.madicon.de/notes-ini-parameters/en/server_restricted/).

### Implementing Server_Restricted

1. **Set the Restriction Level**: Open your Domino server console and enter:

   ```
   set config Server_Restricted=1
   ```

   This immediately restricts access for the current session. Remember, this setting resets on a server restart.

2. **Verify the Setting**: To confirm the change, use:

   ```
   show config Server_Restricted
   ```

   This displays the current value of `Server_Restricted`.

3. **Revert After Maintenance**: Once you're done, revert the setting:

   ```
   set config Server_Restricted=0
   ```

   This opens the doors for all users again.

### Important Considerations

- **Replication Continues**: Even with restrictions, replication between servers continues. So, your data stays in sync.

- **Admins Always Have Access**: Admins can still access databases, ensuring you can perform necessary tasks without hindrance.

- **HTTP, IMAP, and POP3**: The `Server_Restricted` setting primarily affects NRPC connections. HTTP, IMAP, and POP3 client requests aren't restricted by this setting. Plan accordingly if these services are in use.

For more details, refer to the [official HCL documentation](https://help.hcl-software.com/domino/14.5.1/admin/conf_server_restricted_r.html).

## To Review

Using `Server_Restricted` is a straightforward way to manage server access during maintenance. It ensures users don't interfere with critical tasks and helps maintain system integrity. Just remember to set it back to `0` when you're done, or you'll have some confused users knocking on your door.
