---
title: "Setting Up Directory Assistance for LDAP in HCL Domino"
description: "A hands-on guide for Domino administrators to configure directory assistance for integrating remote LDAP directories."
pubDate: "2026-10-04T19:03:24+08:00"
slug: "directory-assistance-ldap-setup"
tags:
  - "Domino Server"
  - "Directory Assistance"
  - "Tutorial"
sources:
  - title: "Creating a Directory Assistance document for a remote LDAP directory"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/conf_creatingadirectoryassistancedocumentforaremotelda_t.html"
  - title: "Authenticating Internet name-and-password clients in secondary Domino and LDAP directories"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/conf_authenticatinginternetnameandpasswordclientsinseco_c.html"
  - title: "How directory assistance works"
    url: "https://www.ibm.com/docs/en/domino/10.0.0?topic=assistance-how-directory-works"
  - title: "Directory Assistance - LDAP - and active Directory"
    url: "https://developer.ds.hcl-software.com/t/directory-assistance-ldap-and-active-directory/56682"
cover: "/covers/directory-assistance-ldap-setup.webp"
coverStyle: "oil-chiaroscuro"
relatedConsoleCommands: []
notesIniSettings: []
---
## Setting Up Directory Assistance for LDAP in HCL Domino

Integrating remote LDAP directories into your HCL Domino environment can streamline authentication and directory lookups. Here's a step-by-step guide to setting up directory assistance for an LDAP directory.

### Prerequisites

Before diving in, ensure you have:

- **Network Connectivity**: Verify that your Domino servers can reach the remote LDAP server. A simple `ping` test can confirm this.

- **Directory Assistance Database**: Create a directory assistance database (`da.nsf`) from the `da.ntf` template and replicate it across servers that will utilize it. Each server must have a local replica to use directory assistance. ([ibm.com](https://www.ibm.com/docs/en/domino/10.0.0?topic=assistance-how-directory-works&utm_source=openai))

### Creating a Directory Assistance Document

1. **Access the Domino Administrator**:
   - Open Domino Administrator.
   - Navigate to the server that will use the directory assistance database.

2. **Open the Directory Assistance Database**:
   - Go to the **Configuration** tab.
   - Expand **Directory** > **Directory Assistance**.
   - If prompted with `Server Error: File does not exist`, ensure the server is set up to use the directory assistance database.

3. **Add a New Directory Assistance Document**:
   - Click **Add Directory Assistance**.

4. **Configure the Basics Tab**:
   - **Domain Type**: Select **LDAP**.
   - **Domain Name**: Assign a unique name different from other Directory Assistance documents.
   - **Company Name**: Enter the associated company's name.
   - **Search Order**: Define the order in which servers search this directory relative to others.
   - **Make this domain available to**:
     - **Notes clients and Internet Authentication/Authorization**: For mail addressing and client authentication.
     - **LDAP Clients**: To enable LDAP service referrals.
   - **Group Authorization**: Choose **Yes** if you want to search group memberships in this LDAP directory for database access control.
   - **Enabled**: Set to **Yes**.

5. **Configure the LDAP Tab**:
   - **Host Name**: Enter the LDAP server's hostname or IP address.
   - **Port**: Default is **389** for standard LDAP or **636** for LDAPS.
   - **Optional Authentication Credential for Search**: Provide credentials if the LDAP server requires authentication for searches.
   - **Base DN for Search**: Specify the base distinguished name (e.g., `dc=example,dc=com`).
   - **Channel Encryption**: Choose **Yes** if using SSL/TLS.
   - **LDAP Vendor**: Select the appropriate vendor (e.g., **Active Directory**).

6. **Save and Close** the document.

### Testing the Configuration

After setting up, it's crucial to test the configuration:

- **Verify Connectivity**: Use the **Verify** button in the LDAP configuration section to test the connection. If you encounter errors like `LDAP Server is NOT available`, ensure the LDAP server is accessible and that network configurations are correct. ([developer.ds.hcl-software.com](https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089?utm_source=openai))

- **Monitor the Domino Console**: Restart the Domino server or the LDAP task and monitor the console for any error messages related to directory assistance.

### Troubleshooting Tips

- **SSL/TLS Issues**: If connecting over LDAPS (port 636), ensure that the Domino server trusts the LDAP server's SSL certificate. This might involve importing the certificate into Domino's key ring.

- **Authentication Failures**: Double-check the credentials provided in the **Optional Authentication Credential for Search** field. Ensure they have the necessary permissions to search the LDAP directory.

- **Group Authorization**: If group lookups aren't functioning, verify that the **Group Authorization** setting is enabled and that the LDAP directory contains the expected group structures.

### The Outcome

By integrating a remote LDAP directory through directory assistance, your Domino environment can authenticate users and perform directory lookups seamlessly across multiple directories. This setup enhances flexibility and centralizes user management, especially in environments with diverse directory services.
