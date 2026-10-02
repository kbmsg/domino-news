---
title: "Configuring Directory Assistance for LDAP Integration in HCL Domino"
description: "A practical guide to setting up Directory Assistance in HCL Domino for integrating with external LDAP directories, enhancing authentication and directory lookups."
pubDate: "2026-10-02T18:59:43+08:00"
slug: "directory-assistance-ldap-setup"
tags:
  - "Domino Server"
  - "Directory Assistance"
  - "Tutorial"
sources:
  - title: "Planning directory assistance"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/plan_planningdirectoryassistance_t.html"
  - title: "Setting up directory assistance"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/conf_settingupdirectoryassistance_c.html?scLang=en"
  - title: "Authenticating Internet name-and-password clients in secondary Domino and LDAP directories"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/conf_authenticatinginternetnameandpasswordclientsinseco_c.html"
  - title: "How to troubleshoot Directory Assistance LDAP against Active Directory?"
    url: "https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089"
relatedConsoleCommands:
  - "tell da reload"
  - "tell ldap reloadschema"
notesIniSettings:
  - "DAOS_CATALOG=1"
  - "LDAP_ENABLE=1"
draft: true
---
<!--
REJECTED DRAFT - 1 critical fact issue(s)
attempt: 2
slug: directory-assistance-ldap-setup
topicOverlap: false
issues:
  [critical] Configure Servers to Use the Directory Assistance Database — 'Basics' tab
      problem: The Directory Assistance database name field is NOT on the 'Basics' tab of the Server document. It is on the 'Directory Assistance' tab (sometimes labeled 'Directories' depending on Domino version). Telling an administrator to look on the 'Basics' tab will send them to the wrong place, and if they give up and type the value somewhere else they could misconfigure the server.
      fix:     Correct the tab name to 'Directory Assistance' (or 'Directories'). Verify against the current Domino 14 admin UI before publishing.
  [major] Create the Directory Assistance Database — 'Replicate this database to all servers'
      problem: The article states to replicate da.nsf to all servers that will use directory assistance, but this is incomplete. The server that owns a replica must also have its Server document updated to point to the correct local replica name. If the replica is named differently on different servers, each Server document must reflect the local name. Additionally, replication alone is not sufficient — the administrator must ensure the replica is actually created (push or pull) before pointing the Server document at it, otherwise the server will log errors. The article presents replication as a simple afterthought with no caveats.
      fix:     Add a note that each server's Server document must reference the local replica name, and that the replica should be confirmed to exist on the target server before saving the Server document change. Also note that a server restart or 'tell adminp process all' / dynamic config update may be needed for the change to take effect.
  [major] LDAP Tab — 'Channel Encryption': Choose 'Yes' if using LDAPS
      problem: The Channel Encryption field in the Directory Assistance document is not a simple Yes/No toggle. In current Domino versions it offers options such as 'None', 'TLS', and 'StartTLS' (or equivalent wording). Describing it as 'Yes' is inaccurate and will confuse administrators who open the document and don't see a Yes/No choice. StartTLS (port 389 with negotiated encryption) and LDAPS (port 636 with SSL/TLS from the start) are distinct and must be selected correctly; conflating them could result in an unencrypted connection the administrator believes is encrypted.
      fix:     Replace 'Choose Yes if using LDAPS' with accurate option names. Explain that 'SSL' or 'TLS' corresponds to LDAPS on port 636, and that 'StartTLS' is a separate option for negotiated TLS on port 389. Administrators should choose the option that matches their LDAP server's configuration.
  [major] LDAP Tab — 'Type of Search Filter to Use': Select 'Active Directory' if integrating with AD
      problem: The field name and option label are not accurately described. In Domino's Directory Assistance document the relevant field controls the LDAP search filter format. The article implies this is labeled 'Type of Search Filter to Use' with an 'Active Directory' option, which does not match the actual field naming in the product UI. Misidentifying UI field names in a how-to article targeting production administrators is a meaningful accuracy problem.
      fix:     Verify the exact field label and option values from the Domino 14 admin client before publishing. If the article cannot be verified against the actual UI, remove or generalize this step to avoid directing administrators to a field they cannot find.
  [major] Authenticating Internet Clients Using LDAP — 'Name Mapping'
      problem: The article mentions 'Name Mapping' only briefly and says 'if necessary, map LDAP attributes to Domino names,' but name mapping is frequently required and non-trivial when integrating with Active Directory (where the user's login name in AD may not match any form Domino recognizes). Presenting it as an optional afterthought may cause administrators to skip it, resulting in authentication failures they cannot easily diagnose.
      fix:     Expand the Name Mapping section to explain when it is required (e.g., when AD sAMAccountName or UPN format differs from the Domino name format) and where in the Directory Assistance document the mapping is configured.
  [major] Troubleshooting Common Issues
      problem: The troubleshooting section omits the most commonly used Domino diagnostic tool for directory assistance problems: the 'show xdir' console command, which displays the loaded directory assistance configuration and is the first thing most experienced admins run. It also omits enabling LDAP debug logging via notes.ini (e.g., LDAPDebug=1 or the DEBUG_LDAP_* parameters) which are standard first steps. Omitting these in a production-focused article leaves administrators without the tools they need.
      fix:     Add a subsection covering: (1) 'show xdir' console command to verify the DA configuration is loaded, (2) relevant notes.ini debug parameters for LDAP tracing, and (3) checking the Domino console/log.nsf for LDAP bind error codes (e.g., error 49 = invalid credentials, error 32 = no such object).
  [major] Naming Contexts (Rules) Tab — 'Define the naming contexts that the Domino server should recognize'
      problem: The Naming Contexts / Rules tab configuration is critical and the article gives it only a single vague sentence. The rules determine which user name formats are routed to this LDAP directory versus the primary Domino Directory. An incorrect or missing rule means lookups silently fall through to the wrong directory. This is one of the most common misconfiguration points.
      fix:     Expand this section to explain that at least one rule must be defined, that the rule typically matches the LDAP domain's base DN or a user name suffix, and that rule ordering and the 'Failover' vs. 'Route' distinction affect behavior. Even a brief example rule would significantly improve the article.
  [minor] URL: https://help.hcl-software.com/domino/14.5.0/admin/conf_settingupdirectoryassistance_c.html
      problem: All other cited HCL help URLs reference version 14.5.1 but this one references 14.5.0. This is inconsistent and may point to older documentation that differs from the version described elsewhere in the article.
      fix:     Update the URL to the 14.5.1 equivalent for consistency: replace '14.5.0' with '14.5.1' in the path, and verify the page exists at that URL before publishing.
  [minor] Make this domain available to: 'Notes Clients & Internet Authentication'
      problem: The exact option label may not match the Domino 14 UI wording precisely. In some versions this field is labeled differently (e.g., separate checkboxes for 'Notes client', 'Internet clients', etc.). Minor UI label inaccuracies erode trust in a step-by-step guide.
      fix:     Verify exact field label and option wording against the Domino 14 admin client before publishing.
  [minor] ## To Review
      problem: The section heading 'To Review' is an unusual and ambiguous label for what is clearly a conclusion/summary section.
      fix:     Rename to '## Summary' or '## Conclusion' to match standard article conventions and set reader expectations correctly.
-->

## Understanding Directory Assistance in HCL Domino

Directory Assistance in HCL Domino allows your server to reference external directories, such as LDAP directories, for authentication and directory lookups. This is particularly useful when integrating Domino with other directory services within your organization.

## Planning Your Directory Assistance Configuration

Before diving into the setup, consider the following:

- **Services to Enable**: Determine which services (e.g., client authentication, group lookups) you want to enable for each secondary directory.
- **Directory Types**: Decide whether you'll be integrating with a secondary Domino Directory, an extended directory catalog, or a remote LDAP directory.
- **Authentication Requirements**: If using a secondary directory for client authentication, specify which user names are trusted for authentication.

For a comprehensive planning guide, refer to HCL's documentation on [Planning Directory Assistance](https://help.hcl-software.com/domino/14.5.1/admin/plan_planningdirectoryassistance_t.html).

## Setting Up Directory Assistance

1. **Create the Directory Assistance Database**:
   - Use the `da.ntf` template to create a new database named `da.nsf`.
   - Replicate this database to all servers that will utilize directory assistance.

2. **Configure Servers to Use the Directory Assistance Database**:
   - Open the Server document in the Domino Directory.
   - Navigate to the 'Basics' tab.
   - In the 'Directory Assistance Database Name' field, enter `da.nsf`.
   - Save and close the document.

3. **Create a Directory Assistance Document for the LDAP Directory**:
   - Open `da.nsf` and create a new Directory Assistance document.
   - **Basics Tab**:
     - **Domain Type**: Select 'LDAP'.
     - **Domain Name**: Enter a descriptive name for the LDAP domain.
     - **Company Name**: Enter the company associated with the LDAP directory.
     - **Make this domain available to**: Choose the appropriate services (e.g., 'Notes Clients & Internet Authentication').
     - **Group Authorization**: Set to 'Yes' if you want to use groups from the LDAP directory for authorization.
     - **Enabled**: Set to 'Yes'.
   - **LDAP Tab**:
     - **Host Name**: Enter the LDAP server's hostname or IP address.
     - **Port**: Typically 389 for standard LDAP or 636 for LDAPS.
     - **Optional Authentication Credential for Search**: Provide credentials if the LDAP server requires authentication for searches.
     - **Base DN for Search**: Specify the base distinguished name for LDAP searches.
     - **Channel Encryption**: Choose 'Yes' if using LDAPS.
     - **Type of Search Filter to Use**: Select 'Active Directory' if integrating with AD.
   - **Naming Contexts (Rules) Tab**:
     - Define the naming contexts that the Domino server should recognize.

For detailed steps, consult the [Setting Up Directory Assistance](https://help.hcl-software.com/domino/14.5.0/admin/conf_settingupdirectoryassistance_c.html?scLang=en) guide.

## Authenticating Internet Clients Using LDAP

To authenticate internet clients using credentials stored in an LDAP directory:

- **Trusted Domains**: Mark the LDAP domain as trusted in the Directory Assistance document.
- **Search Order**: Specify the order in which Domino searches directories for authentication.
- **Name Mapping**: If necessary, map LDAP attributes to Domino names.

More information is available in the [Authenticating Internet Name-and-Password Clients in Secondary Domino and LDAP Directories](https://help.hcl-software.com/domino/14.5.1/admin/conf_authenticatinginternetnameandpasswordclientsinseco_c.html) documentation.

## Troubleshooting Common Issues

If you encounter issues during setup:

- **LDAP Server Unavailable**: Ensure the LDAP server is reachable and that the hostname and port are correct.
- **Authentication Failures**: Verify that the credentials provided in the Directory Assistance document are accurate.
- **Search Base Issues**: Confirm that the Base DN for Search is correctly specified.

For community-driven troubleshooting tips, refer to the [How to Troubleshoot Directory Assistance LDAP Against Active Directory](https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089) discussion.

## To Review

Integrating HCL Domino with external LDAP directories via Directory Assistance enhances your server's authentication capabilities and directory lookups. By carefully planning and configuring the Directory Assistance database and documents, you can achieve a seamless integration that leverages the strengths of both Domino and your existing directory services.
