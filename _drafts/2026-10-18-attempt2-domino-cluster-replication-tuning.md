---
title: "Optimizing Domino Cluster Replication for High Availability"
description: "A hands-on guide to tuning HCL Domino cluster replication settings to enhance performance and ensure high availability."
pubDate: "2026-10-18T17:24:09+08:00"
slug: "domino-cluster-replication-tuning"
tags:
  - "Domino Server"
  - "Clustering"
  - "Performance"
  - "Tutorial"
sources:
  - title: "Cluster_Replicators – Parallel Replication (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/cluster_replicators/"
  - title: "Disable_Cluster_Replicator – Manage Replication (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/disable_cluster_replicator/"
  - title: "Server_Cluster_Default_Port – Cluster Port (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_cluster_default_port/"
relatedConsoleCommands:
  - "load clrepl"
  - "tell clrepl quit"
notesIniSettings:
  - "Cluster_Replicators"
  - "Disable_Cluster_Replicator"
  - "Server_Cluster_Default_Port"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - At least one source should come from a trusted Domino-related host. Got: https://www.madicon.de/notes-ini-parameters/en/cluster_replicators/, https://www.madicon.de/notes-ini-parameters/en/disable_cluster_replicator/, https://www.madicon.de/notes-ini-parameters/en/server_cluster_default_port/
attempt: 2
slug: domino-cluster-replication-tuning
-->

## Understanding Domino Cluster Replication

When you're managing an HCL Domino cluster, ensuring efficient replication between servers is crucial for maintaining high availability and performance. Domino's cluster replication mechanism keeps databases synchronized across servers, allowing for seamless failover and load balancing. However, out-of-the-box settings might not always align with your environment's specific needs. Let's dive into how you can fine-tune these settings.

## Adjusting the Number of Cluster Replicators

By default, Domino runs a single cluster replicator task. In environments with high replication demands, this can become a bottleneck. You can increase the number of parallel cluster replicator tasks by setting the `Cluster_Replicators` parameter in the `notes.ini` file.

**Steps to Configure:**

1. **Edit the `notes.ini` File:**
   - Locate and open the `notes.ini` file on your Domino server.

2. **Add the Parameter:**
   - Insert the line: `Cluster_Replicators=N`
     - Replace `N` with the desired number of replicator tasks. For instance, setting `Cluster_Replicators=3` starts three parallel replicator tasks.

3. **Restart the Server:**
   - For the changes to take effect, restart your Domino server.

**Considerations:**

- **Hardware Resources:** Ensure your server has adequate CPU and memory resources to handle multiple replicator tasks.
- **Monitoring:** After adjusting, monitor server performance and replication times to confirm improvements.

For more details, refer to the [Cluster_Replicators documentation](https://www.madicon.de/notes-ini-parameters/en/cluster_replicators/).

## Temporarily Disabling Cluster Replication

There might be scenarios where you need to disable cluster replication, such as during maintenance or troubleshooting. The `Disable_Cluster_Replicator` parameter allows you to do this without stopping other server functions.

**Steps to Disable:**

1. **Edit the `notes.ini` File:**
   - Open the `notes.ini` file on your Domino server.

2. **Add the Parameter:**
   - Insert the line: `Disable_Cluster_Replicator=1`

3. **Restart the Server:**
   - Restart your Domino server to apply the change.

**To Re-enable:**

- Change the value to `0` and restart the server.

**Note:** Disabling cluster replication halts the synchronization of databases across cluster servers. Ensure this is a temporary measure and re-enable replication as soon as possible.

More information is available in the [Disable_Cluster_Replicator documentation](https://www.madicon.de/notes-ini-parameters/en/disable_cluster_replicator/).

## Specifying the Cluster Communication Port

By default, Domino uses the first available port for cluster communication. To enhance security and performance, you might want to specify a dedicated port using the `Server_Cluster_Default_Port` parameter.

**Steps to Configure:**

1. **Edit the `notes.ini` File:**
   - Open the `notes.ini` file on your Domino server.

2. **Add the Parameter:**
   - Insert the line: `Server_Cluster_Default_Port=PortName`
     - Replace `PortName` with the name of the desired port (e.g., `TCPIP` or a custom port name).

3. **Restart the Server:**
   - Restart your Domino server to apply the change.

**Considerations:**

- **Consistency:** Ensure all servers in the cluster use the same port for cluster communication.
- **Network Configuration:** Verify that the specified port is open and not used by other services.

Detailed guidance can be found in the [Server_Cluster_Default_Port documentation](https://www.madicon.de/notes-ini-parameters/en/server_cluster_default_port/).

## Monitoring and Adjusting

After implementing these changes, it's essential to monitor your Domino servers to assess the impact. Use Domino's built-in monitoring tools to track replication times, server load, and overall performance. If you notice any adverse effects, consider adjusting the parameters accordingly.

## To Review

Fine-tuning your Domino cluster replication settings can lead to significant improvements in performance and reliability. By adjusting the number of replicator tasks, managing replication during maintenance, and specifying communication ports, you can tailor your cluster to meet your organization's specific needs. Always monitor the effects of these changes and adjust as necessary to maintain optimal performance.
