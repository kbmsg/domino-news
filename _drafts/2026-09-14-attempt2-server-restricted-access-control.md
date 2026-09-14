---
title: "Managing Server Access with the Server_Restricted Parameter in HCL Domino"
description: "A detailed guide on using the Server_Restricted notes.ini parameter to control server access in HCL Domino environments."
pubDate: "2026-09-14T20:52:59+08:00"
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
  - title: "The Domino security model"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/othr_thedominosecuritymodel_c.html"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
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
  [critical] Value `1`: The server rejects new database open requests from non-administrators but allows existing connections to continue.
      problem: The description of value 1 is partially inaccurate in a way that could mislead an administrator during an incident. Server_Restricted=1 restricts NEW connections/sessions from non-administrators; it does not simply 'allow existing connections to continue' in the sense that already-open database handles are unaffected. More importantly, the article never mentions that the restriction applies at the point of NEW SERVER ACCESS (authentication/session initiation), not just at the database-open request level. The framing 'rejects new database open requests' is a simplification that omits the session-level behavior and could lead an administrator to underestimate how aggressively the setting cuts off users.
      fix:     Clarify that Server_Restricted=1 prevents non-administrators from establishing new server sessions (not merely new database opens within an existing session), and note that already-authenticated sessions may persist. Verify against current HCL documentation and amend the description accordingly.
  [critical] Clustered Environments: apply the Server_Restricted parameter consistently across all servers
      problem: This is dangerously oversimplified advice with no caveat. In a clustered environment, if Server_Restricted=2 is applied to all cluster members simultaneously (e.g., during a security incident as suggested earlier in the article), the cluster becomes completely inaccessible to everyone including administrators reaching the cluster via a failover replica. There is no warning that setting Server_Restricted=2 across all cluster nodes at once is an extreme action that should be done deliberately and sequentially, and that administrators must ensure out-of-band console access before doing so.
      fix:     Add an explicit warning: applying Server_Restricted=2 to all cluster members simultaneously blocks all access cluster-wide, including administrator access. Recommend retaining at least one node accessible or confirming out-of-band (physical/remote console) access before doing so. For value=1, note that cluster failover may route users to an unrestricted peer, which may or may not be the desired behavior.
  [major] Value `2`: The server rejects all new database open requests, including those from administrators.
      problem: The article does not clarify that Server_Restricted=2 still permits the Domino console itself and server tasks to function — the restriction is on Notes client and HTTP connections, not on the server process or administrator console commands. An administrator reading this might fear they will lose console access when setting value=2, or conversely might not understand the scope of what is still running.
      fix:     Add a clarification that Server_Restricted=2 blocks client connections but the Domino server process, server tasks, and the administrator console remain operational, allowing the administrator to reverse the setting via 'set config Server_Restricted=0'.
  [major] Verify the Configuration: monitor the server logs to ensure the changes have been applied correctly.
      problem: The article gives no concrete guidance on what to look for in logs, and more importantly omits the most direct verification method: the 'show config Server_Restricted' console command, which immediately confirms the active in-memory value. Telling administrators to 'monitor server logs' is vague and unhelpful for a parameter change.
      fix:     Replace or supplement the verification step with the specific console command: 'show config Server_Restricted' to confirm the value is active. Also note that 'set config' updates the in-memory value and writes to notes.ini, so a server restart is not required.
  [major] Administration tools citation: https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html
      problem: This citation points to Domino 11.0.1 documentation. The article is otherwise brand-agnostic and references Domino 14.5.0 in another link. Citing an older version's documentation as a primary reference for a current best-practices article is misleading, and behavior or UI described in 11.0.1 docs may differ from current releases.
      fix:     Update the Administration tools link to point to the current Domino release documentation (14.x series) for consistency with the other citation.
  [major] Use the following console command to set the desired restriction level: set config Server_Restricted=1
      problem: The article presents 'set config' as the only method. It omits two well-known alternatives: (1) editing notes.ini directly while the server is stopped, and (2) configuring the equivalent setting through the Server document in the Domino Directory (if exposed there). Additionally, 'set config' takes effect immediately in memory but the article does not explicitly state this, leaving readers uncertain whether a restart is needed.
      fix:     Note that 'set config' takes effect immediately without a restart and also persists to notes.ini. Mention that direct notes.ini editing is an alternative when the server is offline, and remind readers to take a backup of notes.ini before manual edits.
  [minor] Inform users in advance about access restrictions to minimize disruptions.
      problem: The article does not mention the Domino 'broadcast' console command, which is the standard mechanism to notify connected users of an impending restriction or shutdown.
      fix:     Add a reference to the 'broadcast' console command (e.g., 'broadcast "Server entering maintenance mode in 10 minutes"') as the practical tool for communicating with currently connected users before applying a restriction.
-->

## Managing Server Access with the Server_Restricted Parameter in HCL Domino

Controlling access to your HCL Domino server is crucial for maintenance, security, and compliance. One effective method is utilizing the `Server_Restricted` parameter in the `notes.ini` file. This guide provides a hands-on approach to implementing and managing this parameter.

### Understanding the Server_Restricted Parameter

The `Server_Restricted` parameter allows administrators to control the level of access to the Domino server. By configuring this setting, you can restrict or allow server access based on operational requirements.

**Available Values:**

- `0`: No restrictions; the server accepts all connection requests.
- `1`: The server rejects new database open requests from non-administrators but allows existing connections to continue.
- `2`: The server rejects all new database open requests, including those from administrators.

*Note:* Even when access is restricted, administrators can still open databases unless the parameter is set to `2`. [Source](https://www.madicon.de/notes-ini-parameters/en/server_restricted/)

### Implementing the Server_Restricted Parameter

To configure the `Server_Restricted` parameter:

1. **Access the Domino Server Console:**
   - Open the Domino Administrator client.
   - Navigate to the **Server** tab and select the server you wish to configure.

2. **Modify the notes.ini File:**
   - Use the following console command to set the desired restriction level:
     
     ```
     set config Server_Restricted=1
     ```
     
     Replace `1` with the appropriate value (`0`, `1`, or `2`) based on your access requirements.

3. **Verify the Configuration:**
   - After setting the parameter, monitor the server logs to ensure the changes have been applied correctly.

### Practical Use Cases

- **Scheduled Maintenance:**
  - Set `Server_Restricted=1` to prevent new user connections while allowing administrators to perform maintenance tasks.

- **Security Incidents:**
  - In the event of a security breach, setting `Server_Restricted=2` can immediately halt all new connections, mitigating potential threats.

### Best Practices

- **Communication:**
  - Inform users in advance about access restrictions to minimize disruptions.

- **Monitoring:**
  - Regularly review server logs to ensure that the `Server_Restricted` settings are functioning as intended.

- **Documentation:**
  - Maintain records of when and why access restrictions were applied for compliance and auditing purposes.

### Additional Considerations

- **Administrator Access:**
  - Even with restrictions, administrators retain access unless the parameter is set to `2`. Ensure that administrative credentials are secure.

- **Clustered Environments:**
  - In a clustered setup, apply the `Server_Restricted` parameter consistently across all servers to maintain uniform access control.

For more detailed information on Domino administration tools and security models, refer to the official HCL documentation:

- [Administration tools](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html)
- [The Domino security model](https://help.hcl-software.com/domino/14.5.0/admin/othr_thedominosecuritymodel_c.html)

By effectively managing the `Server_Restricted` parameter, administrators can ensure controlled access to the Domino server, enhancing both security and operational efficiency.
