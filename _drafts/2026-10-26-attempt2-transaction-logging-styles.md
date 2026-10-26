---
title: "Understanding and Configuring Transaction Logging Styles in HCL Domino"
description: "A practical guide to configuring transaction logging styles in HCL Domino, focusing on circular, linear, and archived logging methods to enhance server performance and data recovery."
pubDate: "2026-10-26T18:51:56+08:00"
slug: "transaction-logging-styles"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Setting up a Domino server for transaction logging"
    url: "https://help.hcl-software.com/domino/9.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html"
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html"
  - title: "TRANSLOG_Style – Transaction Log Style (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_style/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Style"
  - "TRANSLOG_Path"
  - "TRANSLOG_Status"
draft: true
---
<!--
REJECTED DRAFT - 3 critical fact issue(s)
attempt: 2
slug: transaction-logging-styles
topicOverlap: false
issues:
  [critical] Linear Logging – 'Once the allocated space is filled, Domino stops until space is freed.'
      problem: This description of Linear logging behavior is incorrect and could cause an administrator to leave a production server in a state they don't understand. In Linear (also called 'Archive' on older releases vs. the true Archive style) logging, once the log space is exhausted Domino does NOT simply pause waiting for space to be freed. The server will halt database writes and effectively hang or crash transactions rather than gracefully waiting for manual intervention. More fundamentally, the article's three-way taxonomy is muddled: HCL Domino actually exposes two primary styles in the Server document UI—Circular and Archive (with Archive enabling point-in-time recovery via a backup agent). 'Linear' is the TRANSLOG_Style=1 INI value, which is effectively the non-overwriting mode, but its failure behavior and the distinction from Archive (TRANSLOG_Style=2) is misrepresented here. Presenting 'Linear' as simply 'circular but bigger' is dangerously misleading.
      fix:     Rewrite the logging styles section to accurately describe the three TRANSLOG_Style values (0=Circular, 1=Linear/Archive-without-agent, 2=Archive-with-agent). Clearly state that with Linear logging the server will abort or stall transactions when log space is exhausted—not simply pause cleanly—and that administrators must proactively manage log space. Cite current HCL documentation rather than the 9.0.1 doc.
  [critical] Circular Logging – 'up to 4GB' / 'Maximum log space: up to 4GB for Circular and Linear logging'
      problem: The 4 GB maximum log space figure is outdated and incorrect for current Domino releases. Since Domino 9.x and continuing through Domino 12.x, the maximum transaction log size is 64 GB (configurable via TRANSLOG_MaxSize). Stating '4GB' as the cap will cause administrators to under-provision log space on modern servers, which can lead to log wrapping more frequently than expected under Circular logging or premature space exhaustion under Linear logging.
      fix:     Replace '4GB' with the correct current maximum of 64 GB and note the valid range (minimum 192 MB, maximum 64 GB). Reference current Domino 12.x/14.x documentation.
  [critical] Cited source: https://help.hcl-software.com/domino/9.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html
      problem: The article links readers directly to the Domino 9.0.1 documentation for a step-by-step configuration guide. Domino 9.0.1 is end-of-life. Telling production administrators to follow a 9.0.1 setup guide for a current Domino 12 or 14 deployment is actively harmful: UI field names, available options, and supported INI parameters have changed across major releases. A reader following those steps on a Domino 14 server may configure the feature incorrectly.
      fix:     Replace all links with equivalent pages from the current HCL Domino documentation (Domino 12.0.x or 14.x). The second cited URL (domino/12.0.0) is more appropriate but is only used for backup/restore requirements, not for the primary configuration walkthrough.
  [major] Circular Logging – 'No need for external backup solutions'
      problem: This is dangerously misleading. Circular logging does NOT eliminate the need for backups—it only means the transaction logs cannot be used for point-in-time recovery. Full database backups are still absolutely required. A reader could interpret this as meaning Circular logging provides adequate protection on its own.
      fix:     Remove the statement 'no need for external backup solutions' entirely and replace it with a clear caveat that Circular logging still requires regular full database backups; it simply cannot be combined with incremental/transaction-log-based restore.
  [major] Archived Logging – 'Domino continuously creates new log files without overwriting old ones. These logs are archived using a backup utility'
      problem: The description omits a critical operational detail: with Archive-style logging, Domino will stall if archived log extents are not claimed by a registered backup agent. If no compliant backup utility is actively archiving the extents, the server can halt. This is a well-known operational risk that must be stated explicitly.
      fix:     Add a warning that Archive logging requires a Domino-aware backup agent (e.g., HCL Domino Backup, Tivoli Storage Manager plug-in, or another certified solution) that registers with the server and actively claims log extents. Without this, the log directory will fill and the server will stop processing transactions.
  [major] Configure Additional Settings – 'Automatic fixup of corrupt databases'
      problem: The article presents enabling automatic Fixup as a simple on/off preference without noting the significant operational caveat: running Fixup on a large database can take a long time and will take the affected database offline during the process. On a busy production server with large databases, auto-Fixup can cause unexpected extended outages. Administrators should understand this trade-off.
      fix:     Add a note that automatic Fixup will take databases offline during repair, which can be disruptive on large or heavily-used databases. Recommend that administrators test this behavior in a non-production environment and consider whether manual Fixup with prior notification is preferable.
  [major] Save and Restart – 'Restart the Domino server for changes to take effect.'
      problem: While a restart is required to activate transaction logging initially, the article does not warn that enabling transaction logging for the first time triggers an initialization pass over all NSF databases on the server (marking them as logging-enabled), which can take considerable time on servers with many or large databases. Starting the server after enabling logging for the first time is not the same as a routine restart.
      fix:     Add a warning that initial activation of transaction logging causes Domino to update the header of every NSF on the server. This process can take minutes to hours depending on database count and size, and the server should not be interrupted during this phase. Plan the initial enablement during a maintenance window.
  [major] Why Transaction Logging Matters – 'boosts performance by reducing disk I/O'
      problem: This is an oversimplification. Transaction logging introduces sequential write I/O for the log itself. The performance benefit comes from converting random write I/O on database files into sequential writes to the log (write-ahead logging pattern), which is faster on spinning disk. On all-NVMe or SAN storage, the benefit profile is different and the overhead of logging may be more noticeable. Presenting it as a universal 'reduces disk I/O' claim is inaccurate.
      fix:     Restate as: transaction logging converts random database writes into sequential log writes, which improves throughput on most storage configurations, particularly with rotational disk. Note that the performance impact should be evaluated for the specific storage topology in use.
  [minor] Article title and throughout – 'HCL Domino'
      problem: The branding is correct (no 'Lotus' references), which is good. However, the article does not specify which Domino versions the guidance applies to. Given the 9.0.1 doc link, there is ambiguity about whether the content is current.
      fix:     Add a brief statement at the top indicating the Domino release versions this article was tested against (e.g., Domino 12.x and 14.x) so readers know the context.
  [minor] Dedicated Disk – 'Always use a separate, dedicated disk for transaction logs'
      problem: While this is a valid best practice for spinning disk environments, it is less universally applicable on modern SAN, NVMe, or cloud-based storage where I/O isolation is achieved differently. Stating 'always' is too absolute.
      fix:     Soften to 'Where possible, use a dedicated volume or LUN for transaction logs to isolate log I/O from database I/O. On modern SAN or NVMe storage, consult your storage vendor's guidance.'
-->

## Understanding and Configuring Transaction Logging Styles in HCL Domino

If you've been managing HCL Domino servers for a while, you know that transaction logging isn't just a checkbox to tick—it's a critical component for ensuring data integrity and optimizing server performance. Let's break down the different logging styles and how to configure them effectively.

### Why Transaction Logging Matters

At its core, transaction logging captures all changes made to your databases, writing them sequentially to log files. This process not only boosts performance by reducing disk I/O but also ensures rapid recovery in case of server crashes. Without it, you're looking at longer downtimes and potential data loss.

### The Three Logging Styles

Domino offers three distinct transaction logging styles:

1. **Circular Logging**
   - **How It Works**: Domino uses a fixed amount of disk space (up to 4GB) for transaction logs. Once this space is filled, it starts overwriting the oldest transactions.
   - **Pros**: Simple setup, no need for external backup solutions.
   - **Cons**: No point-in-time recovery. If a database is lost between full backups, you can only restore up to the last backup.

2. **Linear Logging**
   - **How It Works**: Similar to circular logging but allows for more than 4GB of log space. Once the allocated space is filled, Domino stops until space is freed.
   - **Pros**: Supports larger log sizes.
   - **Cons**: Requires manual intervention to free up space, which can be cumbersome.

3. **Archived Logging**
   - **How It Works**: Domino continuously creates new log files without overwriting old ones. These logs are archived using a backup utility, allowing for point-in-time recovery.
   - **Pros**: Enables incremental backups and precise recovery points.
   - **Cons**: More complex setup and requires integration with backup solutions.

For a deeper dive into these styles, check out this [detailed explanation](https://www.madicon.de/notes-ini-parameters/en/translog_style/).

### Configuring Transaction Logging

Here's how to set up transaction logging on your Domino server:

1. **Access the Server Document**:
   - Open the Domino Administrator.
   - Navigate to the **Configuration** tab.
   - Expand the **Server** section and select **All Server Documents**.
   - Choose the server you want to configure and click **Edit Server**.

2. **Enable Transaction Logging**:
   - Go to the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.

3. **Specify Log Path**:
   - In the **Log path** field, enter the directory where you want to store the transaction logs. It's recommended to use a dedicated, mirrored disk for optimal performance.

4. **Choose Logging Style**:
   - Set the **Logging style** to your preferred option: Circular, Linear, or Archived.

5. **Configure Additional Settings**:
   - **Use all available space on log device**: Choose **Yes** if you're dedicating a device solely for logs.
   - **Maximum log space**: Define the maximum size for the transaction log (up to 4GB for Circular and Linear logging).
   - **Automatic fixup of corrupt databases**: Decide whether Domino should automatically run Fixup on corrupted databases.
   - **Runtime/Restart performance**: Select between Standard, Favor runtime, or Favor restart recovery time based on your performance needs.

6. **Save and Restart**:
   - Save the Server document.
   - Restart the Domino server for changes to take effect.

For a step-by-step guide, refer to the official [Domino documentation](https://help.hcl-software.com/domino/9.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html).

### Best Practices

- **Dedicated Disk**: Always use a separate, dedicated disk for transaction logs to prevent performance degradation.
- **Regular Backups**: Especially with Circular and Linear logging, ensure you have a robust backup strategy to avoid data loss.
- **Monitor Log Space**: Keep an eye on log file sizes and available disk space to prevent unexpected server halts.

By understanding and properly configuring transaction logging, you can significantly enhance your Domino server's reliability and performance. Don't wait for a crash to realize its importance—set it up right the first time.
