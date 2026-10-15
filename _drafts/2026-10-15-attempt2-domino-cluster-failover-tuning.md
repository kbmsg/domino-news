---
title: "Fine-Tuning Domino Cluster Failover for Optimal Performance"
description: "A hands-on guide for Domino administrators to configure and optimize cluster failover settings, ensuring high availability and seamless user experience."
pubDate: "2026-10-15T17:41:40+08:00"
slug: "domino-cluster-failover-tuning"
tags:
  - "Domino Server"
  - "Clustering"
  - "High Availability"
  - "Tutorial"
sources:
  - title: "Tuning the repair service"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/sym_cluster_tune.html"
  - title: "FailoverSilent – Lautloses Cluster-Failover am Notes-Client | HCL Notes/Domino"
    url: "https://www.madicon.de/notes-ini-parameter/de/failoversilent/"
  - title: "MailClusterFailover – Mail-Router-Cluster-Failover | HCL Domino"
    url: "https://www.madicon.de/notes-ini-parameter/de/mailclusterfailover/"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
notesIniSettings:
  - "FailoverSilent=1"
  - "MailClusterFailover=1"
  - "Server_Restricted=1"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Slug collision: "domino-cluster-failover-tuning" already exists. The model ignored the FORBIDDEN SLUGS list, refusing to overwrite an existing post.
attempt: 2
slug: domino-cluster-failover-tuning
-->

## Understanding Domino Cluster Failover

Setting up a Domino cluster is just the beginning. To ensure high availability and a seamless user experience, fine-tuning failover settings is crucial. Let's dive into some key configurations that can make a significant difference.

## Tuning the Repair Service

In symmetrical clusters, the repair service plays a vital role in maintaining database consistency. Adjusting its parameters can enhance performance:

1. **Access the Cluster Configuration:**
   - Navigate to the Domino Directory on a cluster server.
   - Go to `Configuration` > `Clusters` > `Configuration`.
   - Click on `Edit Cluster Configuration`.

2. **Adjust Tuning Parameters:**
   - **Number of Repair Threads:** Set between 1 and 20. Default is 4.
   - **Check Donor Availability:** Frequency (in minutes) to check donor servers. Range: 1-15 minutes. Default is 5.
   - **Retry Failed Repairs After:** Time (in minutes) before retrying a failed repair. Range: 1-15 minutes. Default is 5.
   - **Maximum Number of Retries:** Attempts before marking a repair as unrepairable. Range: 0-5. Default is 3.
   - **Repair Performance:** Level of CPU and Disk I/O dedicated to repairs. Range: 1 (slowest) to 5 (fastest). Default is 3.
   - **Repair Logging Level:** Logging detail level. Range: 0 (none) to 4 (diagnostic). Default is 2.

Fine-tuning these settings can significantly impact the efficiency of your cluster's repair operations. [Source](https://help.hcl-software.com/domino/14.5.1/admin/sym_cluster_tune.html)

## Enabling Silent Failover on Notes Clients

By default, when a Notes client switches to a cluster mate due to server unavailability, users receive a prompt. This can be disruptive. To suppress these prompts:

1. **Set the `FailoverSilent` Parameter:**
   - Add `FailoverSilent=1` to the client's `notes.ini` file.

2. **Deploy via Desktop Policy:**
   - In the Domino Administrator, navigate to `People & Groups` > `Policies`.
   - Edit or create a Desktop Settings document.
   - Under the `Mail` tab, in `Client Settings`, enable `Enable silent failover when a server goes down`.

This ensures users experience seamless failover without unnecessary prompts. [Source](https://www.madicon.de/notes-ini-parameter/de/failoversilent/)

## Configuring Mail Router Cluster Failover

To ensure mail delivery isn't disrupted during server outages:

1. **Enable `MailClusterFailover`:**
   - Add `MailClusterFailover=1` to the server's `notes.ini` file.

2. **Configure via Server Configuration Document:**
   - In the Domino Administrator, go to `Configuration` > `Server` > `Configurations`.
   - Edit the relevant Configuration document.
   - Navigate to the `Router/SMTP` > `Advanced` > `Controls` tab.
   - Enable `Cluster failover`.

With this setting, if a user's home mail server is down, the router forwards incoming mail to a replica on another cluster member. [Source](https://www.madicon.de/notes-ini-parameter/de/mailclusterfailover/)

## Restricting Server Access During Maintenance

During maintenance, it's essential to prevent new database requests without disrupting existing sessions:

1. **Set the `Server_Restricted` Parameter:**
   - Use the console command: `set config Server_Restricted=1`

   This restricts new database open requests from non-administrators until the next server restart. Existing sessions remain unaffected. [Source](https://www.madicon.de/notes-ini-parameter/de/server_restricted/)

## To Review

Fine-tuning your Domino cluster's failover settings ensures high availability and a seamless user experience. Regularly review and adjust these configurations to align with your organization's needs and infrastructure changes.
