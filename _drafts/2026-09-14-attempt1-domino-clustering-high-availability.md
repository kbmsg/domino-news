---
title: "Implementing High Availability with HCL Domino Clustering"
description: "A comprehensive guide on setting up and managing HCL Domino clusters to achieve high availability, including failover mechanisms, workload balancing, and essential configuration settings."
pubDate: "2026-09-14T20:52:15+08:00"
slug: "domino-clustering-high-availability"
tags:
  - "Domino Server"
  - "Clustering"
  - "High Availability"
  - "Tutorial"
sources:
  - title: "How Domino clustering works"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/plan_howdominoclusteringworks_r.html"
  - title: "Cluster benefits and requirements"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/plan_clusterbenefitsandrequirements_c.html"
  - title: "How failover works"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/plan_howfailoverworks_c.html"
  - title: "Server_Availability_Threshold – Load Balancing | HCL Domino"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_availability_threshold/"
relatedConsoleCommands:
  - "load clust"
  - "show cluster"
  - "show stat cluster"
notesIniSettings:
  - "Server_Availability_Threshold"
  - "Server_Cluster_Default_Port"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: domino-clustering-high-availability
topicOverlap: false
issues:
  [critical] Configure Cluster Replication — `Cluster_Replicator=1`
      problem: The Cluster Replicator (CLREPL) is a server task loaded via the ServerTasks or ServerTasksAt notes.ini lines, or started with 'load clrepl' at the console. There is no supported notes.ini boolean parameter called 'Cluster_Replicator=1' that enables it. Publishing this will cause administrators to add a fabricated, non-functional parameter to production notes.ini files while believing they have enabled cluster replication.
      fix:     Remove the fabricated parameter. Explain that CLREPL is enabled by adding 'ClRepl' to the ServerTasks= line in notes.ini (e.g., ServerTasks=Replica,Router,Update,Amgr,AdminP,ClRepl,ClAdmin) or by issuing 'load clrepl' at the server console. Also note that ClAdmin (Cluster Administration Process) is a companion task that should run alongside CLREPL.
  [critical] Configure Cluster Replication — 'Restart the servers to apply the changes.'
      problem: Instructing an administrator to restart production servers as a routine configuration step, without any warning to quiesce users, drain sessions, or ensure a backup exists, is dangerous guidance. A full server restart in a cluster during initial setup—especially before replicas are confirmed healthy—can cause access disruptions or split-brain conditions if done carelessly.
      fix:     Replace the blanket 'restart the servers' instruction with the safer alternative: use 'load clrepl' at the console to start the task without a restart. If a restart is truly required in a specific scenario, add a clear prerequisite warning to back up the server, notify users, and verify the partner cluster server is healthy before taking a server offline.
  [major] Prerequisites — 'All servers must run the Domino Enterprise edition.'
      problem: This is stated as an absolute requirement without qualification. While the Enterprise edition is required for servers that actively serve cluster traffic, the precise licensing and edition requirements have evolved across releases. More importantly, the article presents no caveat that mixing editions within a cluster is unsupported, nor does it clarify what happens with Domino Express or Utility Server licenses in a cluster context. A reader with a mixed-edition estate could be misled.
      fix:     Retain the Enterprise edition requirement but add a note that all servers participating in the cluster must be Enterprise edition, that mixing editions is not supported for cluster membership, and direct readers to verify current edition/licensing requirements in the HCL Domino documentation for their specific release.
  [major] Prerequisites — 'Servers should be connected via a high-speed LAN or WAN and be on the same Notes named network.'
      problem: The claim that cluster servers must be on the same Notes Named Network (NNN) is incorrect. Servers in different Notes Named Networks CAN be in the same cluster, but the Cluster Replicator will use direct server-to-server connections. Being on the same NNN is a convenience that simplifies routing but is not a hard requirement for cluster membership. Stating it as a requirement is factually wrong and could cause administrators to reject valid topologies.
      fix:     Correct to: cluster servers do not need to be on the same Notes Named Network. Explain that cross-NNN clusters are supported but that intra-cluster replication and failover routing must be verifiable between all member servers. Recommend low-latency connectivity for performance reasons.
  [major] Configuring Failover and Load Balancing — 'A lower value means the server will redirect requests sooner.'
      problem: The direction of the threshold effect is described ambiguously and could be read backwards. Server_Availability_Threshold works against the Server Availability Index (SAI), which is a value from 0–100 where 0 means fully busy and 100 means fully available. When the SAI drops BELOW the threshold, the server begins redirecting new requests. A lower threshold value therefore means the server tolerates more load before redirecting, not less. The article implies the opposite, which could cause an administrator to set an unexpectedly low threshold thinking they are being conservative, when they are actually being more permissive.
      fix:     Correct the explanation: the SAI runs from 0 (unavailable/overloaded) to 100 (fully available). When the SAI falls below Server_Availability_Threshold, the server marks itself as busy and redirects new requests to cluster partners. A higher threshold value causes redirection to happen sooner (more aggressively); a lower value tolerates more load before redirecting. Recommend a starting value in the 25–40 range based on HCL guidance rather than the 75 shown, which is aggressive and may cause excessive failover on moderately loaded servers.
  [major] Create the Cluster — 'navigate to the Servers tab, Select Create Cluster'
      problem: The Domino Administrator UI steps are vague and may not match the actual menu path in current versions. The canonical method for creating a cluster involves the Configuration tab in Domino Administrator, not just a generic 'Servers' tab, and also requires proper ACL configuration, ClAdmin task, and Domino Directory entries. The abbreviated UI path could send an administrator hunting for a non-existent menu option.
      fix:     Provide the accurate Administrator client path (Configuration > Servers > Clusters or the equivalent for the target release) and reference the official HCL documentation for the step-by-step wizard. Note that ClAdmin must be running on member servers and that the Domino Directory must be updated with cluster membership records.
  [major] Monitoring — 'show cluster'
      problem: The correct Domino server console command to display cluster status is 'show cluster' — this is technically accurate — however the article omits the more commonly needed and more informative companion commands: 'show cluster members', which lists all cluster members and their availability states, and 'show tasks' to confirm CLREPL and CLADMIN are running. Presenting only 'show cluster' as the status check is an important omission for a production monitoring workflow.
      fix:     Add 'show cluster members' as the primary command for checking individual member status, and note 'show tasks' to verify cluster tasks are active. Briefly describe the output fields so administrators know what a healthy vs. degraded state looks like.
  [minor] Introduction — 'This guide outlines the steps to set up and manage a Domino cluster effectively.'
      problem: The article does not cover several important management topics it implicitly promises: handling cluster database ACLs, what happens during a network partition, or how to gracefully remove a server from a cluster. The scope should be narrowed in the introduction to match the actual content.
      fix:     Scope the introduction to: basic cluster setup, failover configuration, and console-based monitoring. Add a note that topics such as cluster ACL management, disaster recovery, and cluster removal are outside the scope of this article.
  [minor] Cited source — https://help.hcl-software.com/domino/14.5.1/admin/plan_howdominoclusteringworks_r.html
      problem: The article mixes citations from Domino 14.5.0 and 14.5.1 documentation without acknowledging the version difference. While the clustering fundamentals are likely stable between these point releases, readers on other versions (e.g., 12.x or 14.0) may be using documentation that does not match their environment.
      fix:     Add a version notice at the top of the article stating which Domino release(s) the guidance applies to, and encourage readers on other versions to consult the documentation for their specific release.
-->

## Introduction

Ensuring high availability in your HCL Domino environment is critical for maintaining uninterrupted access to applications and data. Implementing Domino clustering allows you to distribute workloads, provide failover capabilities, and enhance overall system resilience. This guide outlines the steps to set up and manage a Domino cluster effectively.

## Understanding Domino Clustering

A Domino cluster consists of two or more servers that work together to provide continuous access to data. Each server in the cluster contains replicas of databases, ensuring that if one server becomes unavailable, users can access the same data from another server. Domino continuously synchronizes these replicas to maintain data consistency. [Learn more about Domino clustering](https://help.hcl-software.com/domino/14.5.1/admin/plan_howdominoclusteringworks_r.html).

## Benefits of Clustering

- **High Availability**: If a server fails, users are automatically redirected to another server with a replica of the required database.
- **Load Balancing**: Distributes user requests across servers, preventing any single server from becoming a bottleneck.
- **Scalability**: Easily add servers to the cluster to accommodate growing workloads.

## Prerequisites for Clustering

Before setting up a cluster, ensure the following:

- **Domino Enterprise Server**: All servers must run the Domino Enterprise edition.
- **Network Configuration**: Servers should be connected via a high-speed LAN or WAN and be on the same Notes named network.
- **Common Domino Directory**: All servers must share a common Domino Directory.
- **Hierarchical Server IDs**: Each server must have a hierarchical server ID.

Detailed requirements are available in the [Cluster benefits and requirements](https://help.hcl-software.com/domino/14.5.0/admin/plan_clusterbenefitsandrequirements_c.html) documentation.

## Setting Up a Domino Cluster

1. **Prepare the Servers**:
   - Ensure all servers meet the hardware and software requirements.
   - Configure network settings to allow seamless communication between servers.

2. **Create the Cluster**:
   - On the Domino Administrator client, navigate to the 'Servers' tab.
   - Select 'Create Cluster' and add the servers you want to include.

3. **Configure Cluster Replication**:
   - Enable the Cluster Replicator task on each server by adding `Cluster_Replicator=1` to the `notes.ini` file.
   - Restart the servers to apply the changes.

4. **Set Up Database Replicas**:
   - Create replicas of critical databases on each server in the cluster to ensure availability.

## Configuring Failover and Load Balancing

Domino's failover mechanism redirects user requests to available servers when one becomes unavailable. The Cluster Manager monitors server availability and manages this process. [Understand how failover works](https://help.hcl-software.com/domino/14.5.1/admin/plan_howfailoverworks_c.html).

To optimize load balancing:

- **Set the Server Availability Threshold**:
  - This setting determines when a server is considered too busy to accept new requests.
  - Add the following line to the `notes.ini` file:
    ```
    Server_Availability_Threshold=75
    ```
    Adjust the value based on your environment's performance metrics. A lower value means the server will redirect requests sooner. [More on Server_Availability_Threshold](https://www.madicon.de/notes-ini-parameters/en/server_availability_threshold/).

- **Specify the Cluster Port**:
  - Define the port used for intra-cluster communication by adding:
    ```
    Server_Cluster_Default_Port=TCPIP
    ```
    Replace `TCPIP` with the appropriate port name if different. [Details on Server_Cluster_Default_Port](https://www.madicon.de/notes-ini-parameters/en/server_cluster_default_port/).

## Monitoring and Maintenance

Regular monitoring ensures the cluster operates efficiently:

- **Check Cluster Status**:
  - Use the server console command:
    ```
    show cluster
    ```
    This displays the status of all servers in the cluster.

- **Monitor Cluster Statistics**:
  - View cluster-related statistics with:
    ```
    show stat cluster
    ```

- **Review Logs**:
  - Regularly check server logs for any anomalies or errors related to clustering.

## Conclusion

Implementing HCL Domino clustering enhances the availability and reliability of your Domino environment. By following the steps outlined above, you can set up a robust cluster that ensures continuous access to critical applications and data. Regular monitoring and maintenance will help sustain optimal performance and quickly address any issues that arise.

For further reading and detailed configurations, refer to the [official Domino clustering documentation](https://help.hcl-software.com/domino/14.5.1/admin/plan_howdominoclusteringworks_r.html).
