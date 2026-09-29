---
title: "Configuring ServerTasks in HCL Domino for Optimal Performance"
description: "A hands-on guide to configuring the ServerTasks parameter in HCL Domino's notes.ini file to manage server tasks effectively and enhance performance."
pubDate: "2026-09-29T19:13:46+08:00"
slug: "servertasks-configuration"
tags:
  - "Domino Server"
  - "Notes.ini"
  - "Performance"
  - "Tutorial"
sources:
  - title: "Domino server tasks"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/admn_dominoservertasks_r.html"
  - title: "ServerTasks – Define Auto-Start Server Tasks (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/servertasks/"
relatedConsoleCommands:
  - "load taskname"
  - "tell taskname quit"
notesIniSettings:
  - "ServerTasks"
  - "ServerTasksAt1"
  - "ServerTasksAt2"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: servertasks-configuration
topicOverlap: false
issues:
  [critical] notes.ini file in your Domino server's data directory
      problem: The notes.ini file is located in the Domino program directory (e.g., /opt/hcl/domino/notes/latest/linux or C:\Program Files\HCL\Domino), NOT the data directory. The data directory contains databases and configuration files like names.nsf. Directing an administrator to look in the data directory will cause confusion and could lead to editing the wrong file or not finding it at all. On some platforms and configurations the notes.ini CAN be in the data directory, but presenting the data directory as the canonical location is misleading and wrong for the majority of installations.
      fix:     State that notes.ini is typically found in the Domino program directory, and note that some configurations (e.g., partitioned servers or certain Linux installs) may place it elsewhere. Advise administrators to confirm the actual path on their system before editing.
  [critical] Never remove the `Update` task from the `ServerTasks` list. Doing so will prevent the Domino Directory from updating
      problem: The claim is technically true but the stated reason is incomplete and misleading in a way that could cause harm. The Update task (Indexer) updates full-text indexes and view indexes for ALL databases, not only the Domino Directory. More importantly, an administrator reading this might infer that removing Update only breaks directory lookups, underestimating the full impact (all view indexes across all databases stop being incrementally maintained). Additionally, the article does not mention that 'load updall' can be used ad-hoc or that ServerTasksAtN=Updall is a valid alternative scheduling approach, so the blanket 'never remove' statement without nuance could mislead readers about legitimate tuning options.
      fix:     Correct the explanation: removing Update stops incremental view index maintenance for ALL databases on the server, not just the Domino Directory. Note that while scheduled Updall runs can supplement index maintenance, the real-time Update task is generally required for production servers. Retain the warning but with accurate scope.
  [major] ServerTasksAt parameters, where `N` represents the hour (0–23)
      problem: The valid range for ServerTasksAtN is 1–24 (1 = 1 AM, 24 = midnight), NOT 0–23 as stated. There is no ServerTasksAt0; midnight is represented as ServerTasksAt24. Stating 0–23 is incorrect and an administrator following this literally would write ServerTasksAt0=Compact, which is not a recognized parameter, silently failing to schedule the task.
      fix:     Correct the range to 1–24, clarify that ServerTasksAt24 represents midnight, and update the example accordingly (2 AM = ServerTasksAt2 is correct, but the range description must be fixed).
  [major] Restart the Domino server for the changes to take effect
      problem: The article presents a server restart as the only way to apply ServerTasks changes, omitting the 'load <taskname>' and 'tell <taskname> quit' console commands that allow starting and stopping individual tasks without a restart. For production environments this omission is significant; administrators should not restart a server unnecessarily when a task can be started or stopped live.
      fix:     Add a note that individual tasks can be started immediately with 'load <taskname>' at the Domino console and stopped with 'tell <taskname> quit', avoiding a full server restart for task-level changes.
  [major] ServerTasksAt2=Compact
      problem: Scheduling 'Compact' via ServerTasksAtN without specifying any database path or switch will compact ALL databases on the server with default options, which may be far more aggressive than intended and can cause extended unavailability of databases during peak usage. The article presents this as a straightforward best practice without any caveats about scope, compaction style (-c for copy-style vs in-place), or the fact that copy-style compaction requires sufficient disk space. This could cause a production outage if followed literally on a large server.
      fix:     Add caveats: clarify that a bare 'Compact' in ServerTasksAtN targets all databases; recommend specifying paths and switches (e.g., Compact -s -D for in-place space recovery, or limiting to specific directories). Note that copy-style compaction requires free disk space roughly equal to the largest database being compacted, and that maintenance windows should account for compaction duration.
  [minor] AMgr`: Runs agents
      problem: AMgr (Agent Manager) does more than simply 'run agents'; it schedules, queues, and manages agent execution including enforcing agent restrictions and resource limits. The description is technically accurate but oversimplified.
      fix:     Expand to: 'Schedules and manages the execution of agents, enforcing server-level agent restrictions and resource limits.'
  [minor] https://help.hcl-software.com/domino/14.5.1/admin/admn_dominoservertasks_r.html
      problem: As of the time of writing, HCL Domino 14.5.1 has not been publicly released (current GA release is 14.5). The URL version number '14.5.1' is suspicious and may be a fabricated or speculative path that does not resolve to a real page, which would undermine reader trust and produce 404 errors.
      fix:     Verify the URL resolves correctly. If 14.5.1 is not yet released, update the URL to reference the current GA documentation version (e.g., 14.0 or 14.5).
-->

## Understanding ServerTasks in HCL Domino

Managing server tasks in HCL Domino is crucial for maintaining optimal performance and ensuring that necessary processes run as intended. The `ServerTasks` parameter in the `notes.ini` file dictates which tasks the server initiates automatically upon startup and keeps active during its operation.

### What is the ServerTasks Parameter?

The `ServerTasks` parameter is a comma-separated list of server tasks that Domino loads automatically when the server starts. These tasks remain active until the server is shut down. Proper configuration of this parameter ensures that only essential tasks run, thereby optimizing server resources.

**Example Configuration:**

```ini
ServerTasks=Replica,Router,Update,AMgr,AdminP,HTTP,LDAP
```

In this setup:

- `Replica`: Handles database replication.
- `Router`: Manages mail routing.
- `Update`: Updates view indexes.
- `AMgr`: Runs agents.
- `AdminP`: Processes administrative requests.
- `HTTP`: Enables the server to function as a web server.
- `LDAP`: Provides LDAP directory services.

**Important Note:** Never remove the `Update` task from the `ServerTasks` list. Doing so will prevent the Domino Directory from updating, which can lead to significant issues. [Source](https://help.hcl-software.com/domino/14.5.1/admin/admn_dominoservertasks_r.html)

### Configuring ServerTasks

To modify the `ServerTasks` parameter:

1. **Access the notes.ini File:**
   - Locate the `notes.ini` file in your Domino server's data directory.

2. **Edit the File:**
   - Open the `notes.ini` file with a text editor.
   - Find the `ServerTasks` line.
   - Add or remove tasks as needed, ensuring they are separated by commas.

3. **Save and Restart:**
   - Save the changes.
   - Restart the Domino server for the changes to take effect.

**Caution:** Changes to the `ServerTasks` parameter only take effect after a server restart. Ensure you plan accordingly to minimize downtime. [Source](https://www.madicon.de/notes-ini-parameters/en/servertasks/)

### Scheduling Tasks with ServerTasksAt

Domino allows scheduling tasks to run at specific times using the `ServerTasksAt` parameters, where `N` represents the hour (0–23) when the task should run.

**Example:** To run the `Compact` task daily at 2 AM:

```ini
ServerTasksAt2=Compact
```

This configuration ensures that the `Compact` task runs automatically at 2:00 AM every day. [Source](https://www.madicon.de/notes-ini-parameters/en/servertasksat1/)

### Best Practices

- **Limit Unnecessary Tasks:** Only include tasks in the `ServerTasks` list that are essential for your server's operation. Unnecessary tasks consume resources and can degrade performance.

- **Use ServerTasksAt for Maintenance:** Schedule maintenance tasks like `Compact`, `Updall`, and `Fixup` during off-peak hours using the `ServerTasksAt` parameters to minimize impact on users.

- **Monitor Task Performance:** Regularly monitor the performance of server tasks to identify and address any issues promptly.

## To Review

Proper configuration of the `ServerTasks` and `ServerTasksAt` parameters in the `notes.ini` file is vital for efficient Domino server operation. By carefully selecting which tasks run automatically and scheduling maintenance tasks appropriately, you can optimize server performance and ensure reliable service for your users.
