---
title: "Configuring Directory Assistance for LDAP Integration in HCL Domino"
description: "A practical guide for Domino administrators on setting up Directory Assistance to integrate with LDAP directories, enhancing authentication and directory lookups."
pubDate: "2026-09-26T17:47:35+08:00"
slug: "directory-assistance-ldap-setup"
tags:
  - "Tutorial"
  - "Directory Assistance"
  - "Domino Server"
sources:
  - title: "Directory assistance"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/conf_directoryassistance_c.html"
  - title: "Planning directory assistance"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/plan_planningdirectoryassistance_t.html"
  - title: "Directory assistance and client authentication"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/conf_directoryassistanceandclientauthentication_t.html"
  - title: "How directory assistance works"
    url: "https://www.ibm.com/docs/en/domino/10.0.0?topic=assistance-how-directory-works"
  - title: "Directory Assistance - LDAP - and active Directory - Domino Forum - HCLSoftware Digital Solutions Community"
    url: "https://developer.ds.hcl-software.com/t/directory-assistance-ldap-and-active-directory/56682"
  - title: "How to troubleshoot Directory Assistance LDAP against Active Directory? - Domino Forum - HCLSoftware Digital Solutions Community"
    url: "https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 1 critical fact issue(s)
attempt: 2
slug: directory-assistance-ldap-setup
topicOverlap: false
issues:
  [critical] Create the Directory Assistance Database – 'named `directory assistance.nsf`'
      problem: The conventional and documented default filename for the Directory Assistance database is 'da.nsf', not 'directory assistance.nsf'. While Domino does allow an administrator to choose any filename, instructing readers to use 'directory assistance.nsf' as if it were the standard name is factually misleading and will cause confusion when administrators follow other documentation or HCL support articles that reference the default 'da.nsf'. More critically, a reader who sets the Server document field to 'directory assistance.nsf' but creates the file under 'da.nsf' (following other docs) will silently break Directory Assistance on that server.
      fix:     State the default filename is 'da.nsf' (created from the DA.NTF template) and note that administrators may choose a different name, but must ensure the name entered in the Server document's 'Directory Assistance database name' field exactly matches the actual database filename.
  [major] Basics Tab – 'Make this domain available to': 'Notes clients and Internet Authentication/Authorization'
      problem: This field actually controls multiple independent checkboxes/options in the DA document (Notes clients, Internet Authentication/Authorization, LDAP clients, etc.). Presenting it as a single choice called 'Notes clients and Internet Authentication/Authorization' oversimplifies the UI and may cause readers to enable only one service when they need others (e.g., enabling LDAP client searches requires a separate checkbox). A reader integrating with Active Directory for web application authentication may leave the wrong boxes unchecked.
      fix:     List each available checkbox individually (Notes clients, Internet Authentication/Authorization, LDAP clients) and explain when each should be enabled, so the reader consciously selects the right combination for their use case.
  [major] Naming Contexts (Rules) Tab – 'Set "Trusted for Credentials" to Yes for authentication purposes'
      problem: Enabling 'Trusted for Credentials' has a significant security implication: it means Domino will pass user-supplied passwords to the external LDAP server for bind authentication. The article presents this as a straightforward step without any security caveat. Administrators should understand that this setting should only be enabled when the LDAP connection is secured (SSL/TLS), otherwise credentials traverse the network in the clear. This is especially dangerous if the reader follows the article without yet having enabled Channel Encryption.
      fix:     Add an explicit warning that 'Trusted for Credentials' should only be set to Yes when Channel Encryption is also enabled (i.e., LDAPS on port 636 or StartTLS), to avoid transmitting user passwords in plaintext.
  [major] LDAP Tab – 'Channel Encryption: Choose Yes if using a secure connection'
      problem: The article conflates two distinct encryption mechanisms. In Domino Directory Assistance, 'SSL' (port 636) and 'TLS/StartTLS' are separate options in newer releases; simply saying 'Yes' if using a secure connection omits the distinction. Additionally, when using LDAPS (port 636), the Domino server must have the LDAP server's CA certificate in its trusted certificate store (Domino's key ring or the JVM cacerts). This prerequisite is mentioned only briefly under Troubleshooting and not at configuration time, which is when it matters.
      fix:     Clarify the difference between SSL (port 636) and StartTLS options where applicable, and move the certificate trust prerequisite into the LDAP Tab configuration step rather than leaving it only as a troubleshooting note.
  [major] Add the Database to Server Documents
      problem: The article says to update 'each server's document' but omits that Directory Assistance databases must also be replicated to every server that references them, and that the replication must complete before the DA configuration takes effect. It also omits the important operational note that changes to DA documents take effect only after the server reloads the DA database, which can require either a server restart or issuing 'tell dirserv reload' (or equivalent) on some versions. A reader might update the Server document and wonder why changes are not reflected.
      fix:     Add a step noting that after updating Server documents, the DA database must have replicated to all servers, and that the administrator may need to reload the directory services task (e.g., 'load dirserv' or restart the server) for changes to take effect.
  [major] Cited source: 'https://www.ibm.com/docs/en/domino/10.0.0?topic=assistance-how-directory-works'
      problem: The article is presented as a guide for HCL Domino (current branding), yet one of its cited sources points to IBM documentation for Domino 10.0.0. IBM divested Domino to HCL in 2018-2019; IBM no longer maintains Domino documentation. Sending readers to ibm.com for Domino guidance is incorrect and potentially misleading, as that content may be outdated or removed. Current documentation lives on help.hcl-software.com.
      fix:     Replace the IBM docs link with the equivalent page on help.hcl-software.com (e.g., the Domino 12.x or 14.x admin documentation covering how Directory Assistance works).
  [major] Planning Your Integration – no mention of order of precedence
      problem: The article omits the critical concept of Directory Assistance rule order (priority/order number on each DA document). When multiple DA documents exist, Domino evaluates them in order number sequence. Misconfiguring order numbers can cause the wrong directory to be searched first, leading to authentication failures or incorrect group resolutions in production. This is a well-known operational gotcha.
      fix:     Add a planning note explaining that each Directory Assistance document has an order number and that Domino searches directories in ascending order. Advise readers to plan their order numbers before creating documents, especially if mixing a secondary Domino Directory with an LDAP directory.
  [minor] Understanding Directory Assistance – 'beyond its primary Domino Directory (NAMES.NSF)'
      problem: While NAMES.NSF is technically the default filename for the primary Domino Directory, referring to it by filename alone could confuse newer administrators. The product name 'Domino Directory' is more precise terminology.
      fix:     Rephrase to 'the primary Domino Directory (names.nsf)' and briefly note that names.nsf is the default filename for the primary directory, to help new admins connect the concept to the actual file.
  [minor] For a comprehensive overview, refer to the HCL Domino 11.0.1 documentation
      problem: The article links to 11.0.1 documentation for foundational concepts but also links to 14.5.1 for planning. Using mixed documentation versions in the same article is inconsistent and may confuse readers, particularly since some DA behaviours and UI fields differ between releases. Readers may be running versions between or beyond these.
      fix:     Standardize citations to the latest available HCL Domino documentation version (currently 14.x) throughout the article, or explicitly note which Domino version each referenced behaviour applies to.
-->

## Setting Up Directory Assistance for LDAP Integration in HCL Domino

Integrating HCL Domino with external LDAP directories can streamline authentication processes and centralize user management. Here's a hands-on guide to configuring Directory Assistance for LDAP integration.

### Understanding Directory Assistance

Directory Assistance allows a Domino server to reference directories beyond its primary Domino Directory (NAMES.NSF). This is particularly useful for:

- **Client Authentication**: Verifying user credentials against an external LDAP directory.
- **Group Lookups**: Resolving group memberships for database authorization.
- **Mail Addressing**: Utilizing external directories for email address resolution.
- **LDAP Service Searches**: Extending LDAP client searches to additional directories.

For a comprehensive overview, refer to the [HCL Domino 11.0.1 documentation](https://help.hcl-software.com/domino/11.0.1/admin/conf_directoryassistance_c.html).

### Planning Your Integration

Before diving into the configuration, consider the following:

- **Services to Enable**: Determine which services (authentication, group lookups, etc.) you'll utilize with the external LDAP directory.
- **Directory Type**: Identify whether you're integrating with a secondary Domino Directory or a remote LDAP directory.
- **Security Requirements**: Assess the need for secure connections (e.g., TLS) and ensure the external directory supports them.

Detailed planning steps are available in the [HCL Domino 14.5.1 documentation](https://help.hcl-software.com/domino/14.5.1/admin/plan_planningdirectoryassistance_t.html).

### Configuring Directory Assistance

1. **Create the Directory Assistance Database**:
   - Use the `DA.NTF` template to create a new database named `directory assistance.nsf`.
   - Replicate this database to all servers that will utilize it.

2. **Add the Database to Server Documents**:
   - In each server's document, specify the `directory assistance.nsf` in the "Directory Assistance database name" field.

3. **Create a Directory Assistance Document**:
   - Open the `directory assistance.nsf` database.
   - Create a new Directory Assistance document with the following settings:
     - **Basics Tab**:
       - *Domain Type*: Select `LDAP`.
       - *Domain Name*: Enter a descriptive name for the LDAP domain.
       - *Company Name*: Provide the company or organization name.
       - *Make this domain available to*: Choose the appropriate services (e.g., `Notes clients and Internet Authentication/Authorization`).
     - **Naming Contexts (Rules) Tab**:
       - Define rules that match the distinguished names (DNs) of users in the LDAP directory.
       - Set "Trusted for Credentials" to `Yes` for authentication purposes.
     - **LDAP Tab**:
       - *Host Name*: Enter the LDAP server's hostname or IP address.
       - *Port*: Specify the LDAP port (default is `389` for LDAP and `636` for LDAPS).
       - *Base DN for Search*: Provide the base DN to start searches.
       - *Optional Authentication Credential for Search*: If required, enter the bind DN and password.
       - *Channel Encryption*: Choose `Yes` if using a secure connection.
       - *Type of search filter to use*: Select the appropriate filter, especially if integrating with Active Directory.

For detailed instructions, see the [HCL Domino 11.0.1 documentation](https://help.hcl-software.com/domino/11.0.1/admin/conf_directoryassistanceandclientauthentication_t.html).

### Testing and Troubleshooting

After configuration:

- **Verify Connectivity**: Use the "Verify" button in the Directory Assistance document to test the connection to the LDAP server.
- **Monitor Logs**: Check the Domino server logs for any errors related to LDAP connectivity.
- **Common Issues**:
  - **LDAP Server Unavailable**: Ensure the LDAP server is reachable and that firewall rules allow traffic on the specified port.
  - **Authentication Failures**: Double-check bind credentials and ensure the LDAP server accepts them.
  - **Certificate Issues**: If using LDAPS, verify that the Domino server trusts the LDAP server's certificate.

For community insights and troubleshooting tips, refer to the [HCLSoftware Digital Solutions Community](https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089).

## To Review

Integrating HCL Domino with an external LDAP directory via Directory Assistance enhances authentication and directory lookups. Proper planning and meticulous configuration are crucial. Always test configurations thoroughly and monitor server logs to ensure seamless integration.
