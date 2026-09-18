---
title: "Setting Up Domino's Native Backup: A Hands-On Guide"
description: "A practical walkthrough for configuring and utilizing HCL Domino's native backup and restore features to safeguard your server data."
pubDate: "2026-09-18T22:42:53+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestore.html"
  - title: "HCL Domino Native Backup Concept | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: domino-native-backup-setup
topicOverlap: false
issues:
  [critical] Step 3: Initiating a Backup — `load backup`
      problem: The console command `load backup` is not the correct syntax for HCL Domino's native backup. The native backup solution is driven by the `backup` server task (loaded as `load backup` only if the task is configured), but more importantly the article presents this as a simple, universally valid command without noting that the backup task must first be properly installed and configured, including the backup script/provider integration. On many installations `load backup` alone will either fail or do nothing useful without the underlying provider (e.g., a backup script pointed to a storage target) being set up. Presenting this bare command as 'initiates the backup process' could mislead an administrator into believing a backup succeeded when nothing was actually written to a recoverable location.
      fix:     Clarify that the native backup framework requires a configured backup provider/script before any console command will produce a usable backup. Document the prerequisite setup of the backup script (e.g., the platform-specific script referenced in the open-source domino-backup project) and explain what output to verify to confirm a backup actually completed successfully. If covering the open-source HCL Domino Backup wrapper, distinguish it clearly from any built-in-only capability.
  [critical] Step 4: Restoring Data — `load restore`
      problem: `load restore` is not a documented or valid Domino console command for the native backup restore process. Restore operations in the HCL Domino native backup framework are performed through `dominobackup.nsf` UI actions or via the `backup` task with specific restore parameters, not via a separate `load restore` task. An administrator issuing `load restore` on a production server will get an error at best; at worst they may be confused into thinking a restore is running when it is not, delaying actual recovery during an incident.
      fix:     Remove `load restore` entirely. Describe the correct restore path: using the restore interface within `dominobackup.nsf` (selecting the backup set and target database) or the correct console/task invocation as documented in HCL's official documentation. Verify the exact supported syntax against the 12.0.x admin help before publishing.
  [major] Getting Started — 'ensure your Domino server is running version 12.0.0 or later'
      problem: The native backup feature was introduced in Domino 12.0.0, which is correct, but the article omits a significant caveat: transaction logging must be enabled on the server for the native backup feature to support point-in-time (granular) restores. Without transaction logging, only full NSF-level backups are possible and the recovery capabilities are substantially reduced. Omitting this prerequisite could lead administrators to deploy backup with false confidence in their recovery point objectives.
      fix:     Add a prerequisites section that explicitly states transaction logging must be enabled for full native backup/restore functionality, and briefly describe the impact on RPO if it is not enabled.
  [major] Step 1: Accessing the Domino Backup Database — 'Navigate to your Domino data directory and open dominobackup.nsf'
      problem: The article implies `dominobackup.nsf` is pre-existing and simply needs to be opened. In practice, `dominobackup.nsf` must be created/initialized as part of the native backup setup process (typically by running the backup configuration or copying the template). An administrator who looks in their data directory and does not find it will be confused.
      fix:     Add a step explaining how `dominobackup.nsf` is created (e.g., from the `dominobackup.ntf` template or via initial backup task setup) so administrators are not left searching for a database that may not yet exist.
  [major] Step 2: Configuring Backup Settings — 'Define Backup Paths: Specify where your backups will be stored. This can be a local directory or a network share.'
      problem: The native HCL Domino backup framework does not directly write to arbitrary local directories or network shares by itself. It relies on a backup provider or script integration (the backup script is called by the Domino backup task to hand off data to a storage target). Stating that you simply 'specify a local directory or network share' is an oversimplification that misrepresents the architecture and could lead to misconfigured deployments with no actual backup data being stored.
      fix:     Explain that backup storage targets are defined through the backup script/provider mechanism, and that the path configuration depends on the specific provider being used. Reference the domino-backup open-source project or third-party provider documentation as appropriate.
  [minor] Why Native Backup Matters — 'With Domino 12, HCL introduced a native backup and restore feature'
      problem: Slight imprecision: HCL also released and updated the open-source 'domino-backup' project on GitHub which extends and complements the native framework. The article conflates the two without distinguishing them, which could confuse readers about what is built into the product versus what requires additional open-source components.
      fix:     Add a brief note clarifying the distinction between the built-in backup API/task in Domino 12 and the open-source domino-backup project that provides ready-made scripts and extended functionality.
  [minor] Best Practices — no mention of backup of dominobackup.nsf itself or the Domino directory
      problem: The best practices section omits the recommendation to back up `dominobackup.nsf` and the Domino Directory (`names.nsf`), which are critical for a complete recovery scenario. It also does not mention backing up notes.ini or the server ID file.
      fix:     Add a best practice bullet covering backup of configuration artifacts: notes.ini, server ID, names.nsf, and dominobackup.nsf itself, since losing these alongside data databases would severely complicate a full server recovery.
-->

## Why Native Backup Matters

If you've been juggling third-party backup solutions for your Domino servers, you know the drill: compatibility issues, complex configurations, and sometimes, less-than-ideal restore times. With Domino 12, HCL introduced a native backup and restore feature that integrates directly into the server environment, simplifying the process and reducing potential headaches.

## Getting Started with Domino's Native Backup

First things first: ensure your Domino server is running version 12.0.0 or later. This native backup feature isn't available in earlier versions.

### Step 1: Accessing the Domino Backup Database

Domino's backup configuration is managed through the `dominobackup.nsf` database. This database provides an interface to set up and manage your backup and restore operations.

1. **Locate the Database**: Navigate to your Domino data directory and open `dominobackup.nsf`.
2. **Review the Configuration**: Familiarize yourself with the default settings. The database is designed to be intuitive, but it's worth taking a moment to understand the layout.

### Step 2: Configuring Backup Settings

Within `dominobackup.nsf`, you'll set parameters such as backup frequency, target directories, and retention policies.

1. **Define Backup Paths**: Specify where your backups will be stored. This can be a local directory or a network share.
2. **Set Schedules**: Determine how often backups should occur. Consider the criticality of your data and the acceptable recovery point objective (RPO) for your organization.
3. **Retention Policies**: Decide how long backups should be retained before being purged. Balancing storage constraints with recovery needs is key here.

For a detailed breakdown of these settings, refer to the official documentation on [Backup and restore](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestore.html).

### Step 3: Initiating a Backup

Once configured, you can start the backup process:

1. **Manual Backup**: From the Domino console, issue the command:
   
   ```
   load backup
   ```
   
   This initiates the backup process based on your predefined settings.

2. **Scheduled Backups**: If you've set up schedules in `dominobackup.nsf`, backups will run automatically at the specified times.

### Step 4: Restoring Data

In the event of data loss or corruption, restoring from a backup is straightforward:

1. **Access the Restore Interface**: Open `dominobackup.nsf` and navigate to the restore section.
2. **Select the Backup**: Choose the backup set corresponding to the point in time you wish to restore.
3. **Initiate Restore**: Click the restore option. Alternatively, from the Domino console, you can use:
   
   ```
   load restore
   ```
   
   Follow the prompts to specify the database and restore point.

## Best Practices

- **Test Your Backups**: Regularly verify that your backups are complete and that the restore process works as expected. There's nothing worse than discovering a backup is unusable when you need it most.

- **Monitor Storage**: Keep an eye on your backup storage to ensure you don't run out of space, which could cause backups to fail.

- **Document Your Configuration**: Maintain records of your backup settings and schedules. This documentation is invaluable during audits or when troubleshooting issues.

## To Review

Implementing Domino's native backup feature streamlines the backup and restore process, reducing reliance on external tools and ensuring tighter integration with your server environment. By following the steps outlined above and adhering to best practices, you can enhance your data protection strategy and ensure business continuity.

For a deeper dive into the backup architecture and advanced configurations, consider exploring the [HCL Domino Native Backup Concept](https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/).
