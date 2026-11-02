---
title: "Enhancing DAOS Repair in Domino 14.5"
description: "A hands-on guide to utilizing the new DAOS repair features introduced in HCL Domino 14.5 for efficient database recovery."
pubDate: "2026-11-02T21:16:58+08:00"
slug: "daos-repair-enhancements"
tags:
  - "Domino Server"
  - "DAOS"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Administration features in Domino 14.5"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/wn_145_admin_features.html"
  - title: "HCL Domino 14.5 Documentation"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/index.html"
relatedConsoleCommands:
  - "tell daosmgr repair"
  - "tell daosmgr repair -nlo <nlo_file>"
  - "tell daosmgr repair -db <database_path>"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: daos-repair-enhancements
topicOverlap: false
issues:
  [critical] tell daosmgr repair -nlo <nlo_file>
      problem: The console command syntax 'tell daosmgr repair -nlo <nlo_file>' cannot be verified against HCL Domino 14.5 documentation and appears to be fabricated or guessed. The DAOS manager task is typically addressed as 'tell daosmgr' but the specific flags '-nlo' and '-db' for targeted repair are not documented in any publicly verifiable HCL Domino release notes or admin help. If an administrator runs a malformed 'tell daosmgr' command on a production server, results are unpredictable. The exact syntax must be confirmed against the official 14.5 release documentation before publication.
      fix:     Verify the exact console command syntax directly from the HCL Domino 14.5 administration documentation or by testing on a lab server running 14.5. Do not publish assumed flag names. If the official syntax differs (e.g., uses positional arguments, different flag names, or a different task name), correct accordingly and quote the documentation explicitly.
  [critical] tell daosmgr repair -db <database_path>
      problem: Same issue as above. The '-db' flag for 'tell daosmgr repair' is unverified and likely fabricated. Publishing an incorrect command that an administrator might run against a production DAOS-enabled server risks unintended behavior, including potential corruption of DAOS catalog state or failure to actually repair NLOs while the administrator believes the repair succeeded.
      fix:     Confirm exact syntax from official HCL 14.5 documentation or a lab environment before publishing. Replace placeholder syntax with the verified, tested command.
  [major] Dynamic Repair of NLO Files — 'There's no need for manual commands; the server handles it in real-time'
      problem: This framing is overly broad and potentially misleading. Dynamic or on-the-fly repair typically depends on the NLO file being recoverable from a backup tier, DAOS replica, or another source configured in the environment. If no recovery source exists (e.g., no DAOS backup integration, no replica), dynamic repair will fail silently or with an error. Presenting it as fully automatic with 'no need for manual commands' could give administrators false confidence that missing NLOs will always be recovered without intervention.
      fix:     Clarify the prerequisites for dynamic repair to succeed, such as whether a backup integration or secondary DAOS tier must be configured. Note that if the NLO cannot be sourced from anywhere, the repair will fail and manual intervention is still required.
  [major] Repairing a Single NLO File — 'you've restored a database from backup and need to ensure its associated NLO files are intact'
      problem: The article does not mention that DAOS repair in a clustered environment may behave differently than on a standalone server. In a Domino cluster, NLO files may be sourced from a cluster partner, and repair operations need to account for cluster topology. Omitting this caveat could mislead administrators in clustered deployments.
      fix:     Add a note that behavior may differ in clustered environments and that administrators should consult cluster-specific DAOS documentation before running repair operations across clustered servers.
  [major] What's New in DAOS Repair
      problem: The article does not mention any version prerequisite beyond 'Domino 14.5,' but it also does not clarify whether these features require a specific fix pack level within 14.5, or whether they apply equally to all supported operating systems (Linux, Windows, AIX). DAOS behavior and tooling can vary by platform.
      fix:     State explicitly that these features are available in Domino 14.5 base release (or specify a fix pack if applicable) and note any known OS-specific limitations.
  [minor] ## To Review
      problem: The section header 'To Review' is non-standard and ambiguous. It reads like an editorial note rather than a conclusion visible to readers.
      fix:     Rename to 'Summary' or 'Conclusion' for clarity.
-->

## Enhancing DAOS Repair in Domino 14.5

If you've ever had to deal with missing or corrupted NLO files in your Domino environment, you know the headache it can cause. With the release of HCL Domino 14.5, there are some new tools in the DAOS repair arsenal that can make your life a bit easier. Let's dive into these enhancements and see how they can help streamline your database recovery processes.

### What's New in DAOS Repair

Domino 14.5 introduces several key improvements to the DAOS repair functionality:

- **Repairing a Single NLO File**: You can now target a specific NLO file for repair. This is particularly useful when you've restored a database from backup and need to ensure its associated NLO files are intact.

- **Repairing All NLO Files for a Database**: This option allows you to check and repair all NLO files linked to a particular database. It's a lifesaver when dealing with databases that have been restored and might have multiple missing NLOs.

- **Dynamic Repair of NLO Files**: If an attempt to read an NLO file fails because it's missing, Domino will now attempt a dynamic repair on the fly. This proactive approach helps maintain database integrity without manual intervention.

For more details on these features, refer to the [Administration features in Domino 14.5](https://help.hcl-software.com/domino/14.5.0/admin/wn_145_admin_features.html) documentation.

### Practical Application

Let's walk through how to use these new repair options.

#### Repairing a Single NLO File

If you suspect a specific NLO file is missing or corrupted, you can initiate a repair using the following console command:

```bash
tell daosmgr repair -nlo <nlo_file>
```

Replace `<nlo_file>` with the path to the NLO file in question. This command checks the specified NLO file and repairs it if necessary.

#### Repairing All NLO Files for a Database

To verify and repair all NLO files associated with a particular database, use:

```bash
tell daosmgr repair -db <database_path>
```

Replace `<database_path>` with the path to your database. This command ensures all linked NLO files are present and correct.

#### Dynamic Repair of NLO Files

With dynamic repair, Domino automatically attempts to repair missing NLO files when they're accessed. There's no need for manual commands; the server handles it in real-time, reducing downtime and administrative overhead.

### Considerations

While these enhancements are powerful, it's essential to:

- **Regularly Monitor DAOS**: Keep an eye on DAOS logs to catch issues early.

- **Maintain Backups**: Always have up-to-date backups of your databases and NLO files.

- **Test Repairs in a Safe Environment**: Before running repair commands on production servers, test them in a controlled setting to ensure they work as expected.

For comprehensive guidance on DAOS management and repair, consult the [HCL Domino 14.5 Documentation](https://help.hcl-software.com/domino/14.5.0/admin/index.html).

## To Review

The new DAOS repair features in Domino 14.5 provide targeted and dynamic solutions for maintaining database integrity. By familiarizing yourself with these tools and incorporating them into your maintenance routines, you can ensure a more resilient and efficient Domino environment.
