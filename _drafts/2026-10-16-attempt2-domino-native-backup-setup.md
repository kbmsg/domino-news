---
title: "Setting Up Domino's Native Backup and Restore"
description: "A hands-on guide for Domino administrators to configure and utilize Domino's native backup and restore features for effective data protection."
pubDate: "2026-10-16T17:35:08+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Domino Backup Introduction | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/"
  - title: "Backing up the Domino server"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/admn_backingupthedominoserver_t.html"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
notesIniSettings:
  - "TRANSLOG_ENABLED=1"
  - "TRANSLOG_STYLE=1"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Slug collision: "domino-native-backup-setup" already exists. The model ignored the FORBIDDEN SLUGS list, refusing to overwrite an existing post.
attempt: 2
slug: domino-native-backup-setup
-->

## Setting Up Domino's Native Backup and Restore

If you're still juggling third-party backup solutions for your Domino servers, it's time to simplify. Starting with Domino 12, HCL introduced a native backup and restore feature that's both robust and straightforward. Here's how to get it up and running.

### Why Go Native?

Integrating backup directly into Domino means fewer moving parts and a solution tailored specifically for Domino databases. Plus, it's designed to work seamlessly with existing third-party backup tools, offering flexibility without the complexity.

### Prerequisites

Before diving in, ensure:

- **Domino Version**: You're running Domino 12 or later.
- **Operating System**: This feature is available on both Windows and Linux platforms.
- **Transaction Logging**: Enabled and properly configured. This is crucial for point-in-time recovery.

### Step-by-Step Configuration

1. **Access the Domino Backup Database**

   Domino 12 introduces `dominobackup.nsf`, the central hub for backup configurations. Locate this database in your Domino data directory.

2. **Configure Backup Settings**

   Open `dominobackup.nsf` and navigate to the 'Configuration' section. Here, you'll set:

   - **Backup Paths**: Define where backups will be stored. This can be a local directory or a network share.
   - **Schedule**: Determine when backups should run. Regular scheduling ensures consistent data protection.
   - **Retention Policies**: Decide how long backups are kept before deletion.

3. **Set Up Restore Options**

   Within the same database, configure restore settings:

   - **Restore Paths**: Specify where restored databases should be placed.
   - **Point-in-Time Recovery**: Utilize transaction logs to restore databases to a specific moment, minimizing data loss.

4. **Integrate with Third-Party Solutions (Optional)**

   If you're using external backup tools, Domino's native feature can complement them. Configure integration scripts within `dominobackup.nsf` to coordinate between Domino and your third-party solution.

5. **Test Your Configuration**

   Always run a manual backup and restore to ensure everything functions as expected. This proactive step can save headaches down the line.

### Commands to Know

- **Initiate Backup**:

  ```
  load backup
  ```

  This command starts the backup process based on your configurations.

- **Initiate Restore**:

  ```
  load restore
  ```

  Use this to begin the restore process as per your settings.

### Best Practices

- **Regular Testing**: Periodically test both backup and restore processes to ensure data integrity.
- **Monitor Logs**: Keep an eye on backup logs for any anomalies or failures.
- **Stay Updated**: As with any software, ensure your Domino server is up-to-date to benefit from the latest features and security patches.

### To Review

Setting up Domino's native backup and restore isn't just about ticking boxes; it's about ensuring your data's safety with a solution built specifically for Domino. By following the steps above, you'll have a reliable, integrated backup system that simplifies your administrative tasks and fortifies your data protection strategy.

For more detailed information, refer to the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/) and the official documentation on [Backing up the Domino server](https://help.hcl-software.com/domino/14.5.0/admin/admn_backingupthedominoserver_t.html).
