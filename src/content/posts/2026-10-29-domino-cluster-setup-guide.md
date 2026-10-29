---
title: "Setting Up an HCL Domino Cluster: A Practical Guide"
description: "A step-by-step guide for administrators on configuring an HCL Domino cluster to enhance server availability and performance."
pubDate: "2026-10-29T19:24:20+08:00"
slug: "domino-cluster-setup-guide"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Clustering"
sources:
  - title: "Creating a cluster"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/conf_creatingacluster_t.html"
  - title: "Cluster benefits and requirements"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/plan_clusterbenefitsandrequirements_c.html"
  - title: "Cluster_Replicators – Parallel Replication (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/cluster_replicators/"
relatedConsoleCommands:
  - "show cluster"
notesIniSettings:
  - "Cluster_Replicators"
  - "Server_Cluster_Default_Port"
minDominoVersion: "11.0.1"
---
## Understanding HCL Domino Clusters

Setting up an HCL Domino cluster can significantly improve your server's availability and performance. A cluster is a group of servers that work together to provide users with constant access to data, balance workloads, and maintain performance as your enterprise grows. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.1/admin/plan_whatisadominocluster_c.html?utm_source=openai))

## Prerequisites

Before diving into the setup, ensure the following:

- **Domino Enterprise Server**: All servers in the cluster must run the Domino Enterprise server.
- **Network Configuration**: Servers should be connected via a high-speed LAN or WAN and be on the same Notes named network.
- **Domino Domain**: All servers must be in the same Domino domain and share a common Domino Directory.
- **Hierarchical Server IDs**: Each server must have a hierarchical server ID. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.0/admin/plan_clusterbenefitsandrequirements_c.html?utm_source=openai))

## Step-by-Step Cluster Creation

1. **Access the Domino Administrator**:
   - Open the Domino Administrator client.
   - Navigate to the **Configuration** tab.

2. **Select Servers**:
   - In the **Tasks** pane, expand **Server** and click on **All Server Documents**.
   - Select the servers you want to include in the cluster.

3. **Add to Cluster**:
   - Click on **Add to Cluster**.
   - In the dialog box, choose **Create New Cluster** and click **OK**.
   - Enter a name for the new cluster and confirm.

4. **Immediate or Deferred Addition**:
   - Choose **Yes** to add the servers to the cluster immediately.
   - Alternatively, choose **No** to submit a request to the Administration Process for later addition. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.1/admin/conf_creatingacluster_t.html?utm_source=openai))

## Verifying Cluster Creation

After setting up the cluster, it's crucial to verify its proper configuration:

- **Domino Administrator Check**:
  - Expand **Clusters** in the Server pane; you should see the cluster name followed by the names of the cluster servers.

- **Server Console Command**:
  - Run the command:
    ```
    show cluster
    ```
    This should display the cluster name, statistics for the current server, and the names of all cluster servers. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.1/admin/conf_verifyingthattheclusterwascreatedcorrectly_t.html?utm_source=openai))

## Optimizing Cluster Performance

To enhance cluster performance, consider the following:

- **Parallel Cluster Replicators**:
  - By default, Domino starts a single cluster replicator. For servers with high write loads or numerous replicas, running multiple cluster replicators can be beneficial.
  - Add the following to your `notes.ini`:
    ```
    Cluster_Replicators=3
    ```
    This starts three cluster replicator tasks in parallel. Adjust the number based on your server's capacity and workload. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/cluster_replicators/?utm_source=openai))

- **Dedicated Cluster Port**:
  - Specify a default port for intracluster network traffic by adding to your `notes.ini`:
    ```
    Server_Cluster_Default_Port=TCPIP
    ```
    Replace `TCPIP` with your designated port name. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/server_cluster_default_port/?utm_source=openai))

## To Review

Setting up an HCL Domino cluster involves careful planning and execution. By following the steps outlined above and optimizing your configuration, you can achieve a robust and efficient clustered environment. Regular monitoring and adjustments will ensure continued high availability and performance for your users.
