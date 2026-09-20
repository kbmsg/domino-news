---
title: "Setting Up Domino's Native Backup: A Hands-On Guide"
description: "A practical walkthrough for configuring HCL Domino's native backup and restore features, ensuring reliable data protection without third-party tools."
pubDate: "2026-09-20T22:25:00+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Domino Server"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html"
  - title: "Domino Backup Introduction"
    url: "https://opensource.hcltechsw.com/domino-backup/"
cover: "/covers/domino-native-backup-setup.webp"
coverStyle: "minimalist-mono"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
notesIniSettings: []
minDominoVersion: "12.0.0"
---
## Why Native Backup Matters

If you've been juggling third-party backup solutions for your Domino servers, you know the drill: compatibility issues, complex configurations, and sometimes, less-than-ideal integration. With Domino 12, HCL introduced a native backup and restore feature that simplifies the process, offering a seamless way to protect your data without external tools. Let's dive into setting it up.

## Prerequisites

Before we get our hands dirty, ensure:

- **Domino Version**: You're running Domino 12 or later. This feature isn't available in earlier versions.
- **Operating System**: Your server is on Windows or Linux. The native backup doesn't support other OSes.

## Step 1: Initialize the Backup Database

First things first, we need to create the `dominobackup.nsf` database, which will house our backup configurations and logs.

1. **Run the Backup Task**: Open your Domino console and execute:

   ```
   load backup
   ```

   This command initializes the backup database. If it's the first run, Domino will create `dominobackup.nsf` in the data directory.

2. **Verify Creation**: Navigate to your Domino data directory and confirm the presence of `dominobackup.nsf`.

## Step 2: Configure Backup Settings

With the backup database in place, let's set up the backup configurations.

1. **Open `dominobackup.nsf`**: Using the Domino Administrator client, access the backup database.

2. **Create a New Configuration**:

   - **Platform Selection**: Choose between 'Default' (applies to multiple servers) or 'Server' (specific to one server). For most setups, 'Default' suffices.

   - **Backup Paths**: Specify directories for storing backup files. Ensure these paths have adequate storage and permissions.

   - **Excluded Databases**: If there are databases you don't want to back up, list them here.

   - **Schedule**: Define when backups should run. Regular scheduling ensures consistent data protection.

   For a detailed breakdown of each configuration field, refer to the [official documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html).

3. **Save and Close**: Once configured, save your settings.

## Step 3: Schedule the Backup Task

To automate backups:

1. **Create a Program Document**:

   - **Program Name**: `backup`

   - **Command Line**: Leave this blank.

   - **Server to Run On**: Specify your server.

   - **Schedule**: Set the desired frequency and time for backups.

2. **Save the Document**: This schedules the backup task as per your configuration.

## Step 4: Test the Backup

Before relying on the setup:

1. **Manually Run the Backup**: In the Domino console, execute:

   ```
   load backup
   ```

2. **Monitor the Process**: Check the console for any errors. Also, verify that backup files are created in the specified directories.

## Step 5: Restore a Database

Testing the restore process ensures your backups are reliable.

1. **Open `dominobackup.nsf`**: Navigate to the 'Restore' view.

2. **Select a Database**: Choose a database to restore.

3. **Restore Options**: Decide whether to restore to the original location or an alternate one. You can also choose to restore deleted documents.

4. **Initiate Restore**: Click 'Restore' and monitor the process.

For more insights on the restore process, check out the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/).

## To Review

Setting up Domino's native backup isn't just about ticking boxes; it's about ensuring your data's safety without unnecessary complexity. By following these steps, you integrate a robust backup solution directly into your Domino environment. Remember, regular testing of both backup and restore processes is crucial. After all, a backup is only as good as its restore.

For a visual walkthrough, consider watching this [HCL Domino Backup/Restore Function video](https://www.youtube.com/watch?v=D0e0AmEkNCc).
