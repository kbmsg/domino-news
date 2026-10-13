---
title: "Configuring HCL Domino Clusters for High Availability"
description: "A hands-on guide for Domino administrators to set up and optimize server clusters, ensuring high availability and efficient workload balancing."
pubDate: "2026-10-13T20:33:19+08:00"
slug: "domino-cluster-configuration"
tags:
  - "Domino Server"
  - "Clustering"
  - "High Availability"
  - "Tutorial"
sources:
  - title: "Clustering basics"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/plan_clusteringbasics_c.html"
  - title: "Cluster benefits and requirements"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/plan_clusterbenefitsandrequirements_c.html"
  - title: "Server_Availability_Threshold – Load Balancing | HCL Domino"
    url: "https://www.madicon.de/notes-ini-parameters/en/server_availability_threshold/"
relatedConsoleCommands:
  - "load clust"
  - "show cluster"
  - "replicate"
notesIniSettings:
  - "Server_Availability_Threshold"
  - "Cluster_Replicators"
  - "Server_Cluster_Default_Port"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: domino-cluster-configuration
topicOverlap: false
issues:
  [critical] `replicate server1 server2`
      problem: The console command syntax is wrong. The Domino server console 'replicate' command takes a single target server name as its argument (e.g., 'replicate server2/domain'), not two server names side by side. The form 'replicate server1 server2' is not valid syntax and would produce an error or unpredictable behavior if typed on a production console.
      fix:     Correct the syntax to 'replicate <targetservername>' (e.g., 'replicate server2/Acme'). If the intent is to push a specific database, note the full syntax is 'replicate <servername> <dbpath>'. Clarify which server's console the command is being run from.
  [critical] Cluster_Replicators=2
      problem: The notes.ini parameter name is incorrect. The correct parameter for controlling the number of cluster replicator tasks is 'ClusterReplicators' (no underscore), not 'Cluster_Replicators'. Using the wrong parameter name means it will be silently ignored, leaving the administrator believing they have configured parallel replication when they have not.
      fix:     Change to 'ClusterReplicators=2'. Also note this parameter has a maximum supported value (typically 6) and that adding replicators only helps when replication is genuinely the bottleneck; the article should include that caveat.
  [major] Domino Enterprise Server: All servers in the cluster must run the Domino Enterprise edition.
      problem: This is outdated framing. HCL restructured Domino licensing; the current product is simply 'HCL Domino' with licensing tiers. The statement as written implies a hard technical enforcement that may not match current licensing models, and conflates a licensing requirement with a technical prerequisite. Additionally, the article does not mention the Cluster Manager task (CLDBDIR, CLREPL tasks) that must be running, which is a genuine technical prerequisite.
      fix:     Replace the Enterprise edition claim with current HCL licensing terminology and verify the specific license SKU requirement against current HCL documentation. Add a note that the Cluster Manager and Cluster Replicator server tasks must be loaded on each cluster member.
  [major] same Notes named network
      problem: Servers in a Domino cluster do NOT need to be on the same Notes Named Network (NNN). In fact, cluster replication uses a direct TCP/IP connection between cluster members regardless of NNN boundaries. Stating they must be on the same NNN is incorrect and could cause an administrator to misconfigure their network topology.
      fix:     Remove the same-NNN requirement. Clarify that cluster members communicate directly over TCP/IP and that NNN membership governs mail routing, not cluster replication eligibility.
  [major] Domino Administrator client, navigate to the 'Servers' tab. Select 'Create Cluster'
      problem: The navigation path is inaccurate. In HCL Domino Administrator, cluster creation is performed via the Configuration tab, then navigating to Server > Clusters, not from a generic 'Servers' tab with a 'Create Cluster' button. A reader following these steps literally will not find the described UI.
      fix:     Correct the path to: open HCL Domino Administrator, click the Configuration tab, expand 'Server' in the left panel, select 'Clusters', then use the 'Create Cluster' action button. Alternatively, note that clusters can also be created by directly editing Server documents in the Domino Directory.
  [major] This setting ensures that if a server's availability index drops below 70, new sessions are redirected to other cluster members.
      problem: The behavior description is partially misleading. 'Server_Availability_Threshold' defines the threshold below which a server is marked as BUSY and stops accepting new sessions from cluster failover, but the server continues to serve its existing connected users and direct connections. The article implies all new sessions are universally redirected, omitting that users already connected remain connected and that the Server_Availability_Threshold interacts with Server_Restricted and other availability settings. Also, the cited source (madicon.de) is a third-party site, not official HCL documentation, and is used as if it were authoritative.
      fix:     Clarify that the threshold governs cluster-initiated failover of new sessions only; existing sessions are unaffected. Add a reference to the official HCL documentation for this parameter. Retain the third-party link only as a supplementary reference, not the primary one.
  [major] show cluster
      problem: The correct console command is 'show cluster' only as a standalone command on some versions, but the more standard and universally documented command for cluster status is 'show cluster *' or 'show cluster <servername>'. Using bare 'show cluster' without arguments may return limited or no output depending on the Domino version, potentially leading an administrator to believe the cluster is unconfigured.
      fix:     Use 'show cluster *' to display the status of all cluster members, and document the expected output fields so administrators know what healthy output looks like.
  [minor] ## To Review
      problem: The section heading 'To Review' is an unusual label; it appears to be a summary/conclusion section but the heading is ambiguous and non-standard for technical documentation.
      fix:     Rename to '## Summary' or '## Conclusion' for clarity.
  [minor] https://help.hcl-software.com/domino/14.5.0/admin/plan_clusteringbasics_c.html and https://help.hcl-software.com/domino/14.5.1/admin/plan_clusterbenefitsandrequirements_c.html
      problem: The two HCL Help citations reference different Domino versions (14.5.0 and 14.5.1) within the same article. This is inconsistent and could confuse readers about which version the guidance applies to.
      fix:     Standardize all HCL documentation links to the same Domino version, preferably the latest stable release, and state explicitly which version the article targets.
-->

## Setting Up HCL Domino Clusters for High Availability

Ensuring your HCL Domino environment remains available and responsive is crucial. Clustering is a key strategy to achieve this, providing redundancy and load balancing. Here's how to set up and optimize Domino clusters effectively.

### Understanding Domino Clusters

A Domino cluster is a group of servers that work together to provide continuous access to data. By replicating databases across multiple servers, clusters offer:

- **High Availability**: If one server goes down, another can take over seamlessly.
- **Load Balancing**: Distributes user requests across servers to prevent overload.

For a deeper dive into clustering basics, refer to [Clustering basics](https://help.hcl-software.com/domino/14.5.0/admin/plan_clusteringbasics_c.html).

### Prerequisites for Clustering

Before diving in, ensure your environment meets these requirements:

- **Domino Enterprise Server**: All servers in the cluster must run the Domino Enterprise edition.
- **Network Configuration**: Servers should be connected via a high-speed LAN or WAN and be on the same Notes named network.
- **Domino Domain**: All servers must reside in the same Domino domain and share a common Domino Directory.

Detailed requirements are outlined in [Cluster benefits and requirements](https://help.hcl-software.com/domino/14.5.1/admin/plan_clusterbenefitsandrequirements_c.html).

### Step-by-Step Cluster Configuration

1. **Prepare the Servers**:
   - Install and configure the Domino Enterprise Server on each machine.
   - Ensure consistent network settings across all servers.

2. **Create the Cluster**:
   - On the Domino Administrator client, navigate to the 'Servers' tab.
   - Select 'Create Cluster' and add the servers you want to include.

3. **Configure Cluster Replication**:
   - Ensure databases that require high availability have replicas on multiple servers.
   - Use the `replicate` command to synchronize databases:
     ```
     replicate server1 server2
     ```

4. **Set Availability Thresholds**:
   - Adjust the `Server_Availability_Threshold` in the `notes.ini` file to control workload distribution. For example:
     ```
     Server_Availability_Threshold=70
     ```
     This setting ensures that if a server's availability index drops below 70, new sessions are redirected to other cluster members. More details can be found at [Server_Availability_Threshold – Load Balancing | HCL Domino](https://www.madicon.de/notes-ini-parameters/en/server_availability_threshold/).

5. **Optimize Cluster Replication**:
   - For servers with high write loads, consider running multiple cluster replicator tasks by setting:
     ```
     Cluster_Replicators=2
     ```
     This allows parallel replication processes, enhancing performance.

6. **Monitor Cluster Status**:
   - Use the following console commands to check cluster health:
     ```
     show cluster
     ```
     ```
     show stat cluster
     ```

### Best Practices

- **Even Distribution**: Distribute databases evenly across servers to balance the load.
- **Regular Monitoring**: Keep an eye on server performance and adjust settings as needed.
- **Test Failover**: Periodically test failover scenarios to ensure seamless transitions during actual outages.

## To Review

Setting up a Domino cluster enhances your environment's resilience and performance. By following these steps and best practices, you can ensure continuous availability and efficient resource utilization. Always refer to official documentation and community resources for the latest insights and updates.
