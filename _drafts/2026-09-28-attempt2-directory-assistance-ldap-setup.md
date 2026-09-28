---
title: "Configuring Directory Assistance for LDAP in HCL Domino"
description: "A practical guide to setting up Directory Assistance in HCL Domino to integrate with external LDAP directories for authentication and user management."
pubDate: "2026-09-28T19:34:49+08:00"
slug: "directory-assistance-ldap-setup"
tags:
  - "Domino Server"
  - "Directory Assistance"
  - "Tutorial"
sources:
  - title: "Setting up directory assistance"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/conf_settingupdirectoryassistance_c.html?scLang=en"
  - title: "Directory assistance - LDAP - and active Directory"
    url: "https://developer.ds.hcl-software.com/t/directory-assistance-ldap-and-active-directory/56682"
relatedConsoleCommands:
  - "tell da reload"
  - "tell ldap reloadschema"
notesIniSettings:
  - "NTS_TRAVELER_AS_LOOKUP_SERVER=True"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: directory-assistance-ldap-setup
topicOverlap: false
issues:
  [critical] Step 4: Restart the LDAP Service — `tell ldap reloadschema`
      problem: `tell ldap reloadschema` reloads the LDAP schema served BY Domino's own LDAP service to external clients. It has no effect on the Domino server's outbound connection to an external LDAP directory via Directory Assistance. To pick up a new trusted certificate or LDAPS channel-encryption change in a Directory Assistance document the correct action is `tell da reload` (which reloads Directory Assistance) and, if the certificate was added to the server's key-ring or trusted-roots store, a restart of the HTTP/LDAP task or the server may be needed. Issuing `tell ldap reloadschema` misleads the administrator into thinking the change has taken effect when it has not, potentially leaving an insecure or broken connection in production.
      fix:     Replace `tell ldap reloadschema` with `tell da reload`. Add a note that if the LDAP server certificate was imported into a key-ring file, the relevant task (or the server) may need to be restarted for the new trust anchor to be loaded.
  [critical] Step 4: Import the Certificate into Domino — 'Use the Domino Certificate Authority to import and trust the LDAP server's certificate.'
      problem: The Domino Certificate Authority (CA) is used to issue and sign certificates, not to import third-party SSL certificates for outbound trust. To trust an external LDAP server's certificate for outbound LDAPS connections, the administrator must import the CA certificate (or the server certificate) into the Domino server's trusted-certificate store — typically by adding it as a trusted root in the server's Internet key-ring file (kyrtool or Domino Certificate Manager) or into the certstore.nsf (Domino 12+). Pointing administrators to the CA application for this task will cause them to look in the wrong place and may leave the LDAPS connection failing or the certificate untrusted.
      fix:     Replace this step with accurate guidance: import the external CA or server certificate into the server's key-ring file using kyrtool (or the Domino Certificate Manager / certstore.nsf on Domino 12+), then reference that key-ring in the server document's SSL settings. Mention that on Domino 12+ certstore.nsf is the preferred method.
  [major] Step 1: Create the Directory Assistance Database — 'Use the `da.ntf` template'
      problem: The article does not mention that the Directory Assistance database name is not fixed to `da.nsf`; it can be any name the administrator chooses, as long as that same name is entered in the server document. More importantly, it omits the requirement that the database must reside on the Domino data directory of each server that uses it (or be replicated there). Saying only 'replicated to all servers' without clarifying that it must be a local replica on each server could lead an administrator to reference a remote copy, which does not work — Directory Assistance only reads a local database.
      fix:     Clarify that Directory Assistance requires a local replica of the database on every server that uses it; a remote database reference is not supported. Also note the filename is configurable.
  [major] Step 2, Configure the LDAP Tab — 'Channel Encryption: Select "Yes" if using LDAPS'
      problem: The article conflates 'Channel Encryption' (SSL/TLS from the first byte, port 636) with StartTLS (port 389, upgraded in-band). Domino Directory Assistance supports both options separately in the LDAP tab. Presenting 'Channel Encryption = Yes' as the single SSL/TLS option omits StartTLS as an alternative and may confuse administrators whose LDAP server requires StartTLS on port 389.
      fix:     Distinguish between SSL/TLS (port 636, Channel Encryption = SSL) and StartTLS (port 389, Channel Encryption = StartTLS/TLS) and explain when each is appropriate.
  [major] Step 3: Reload Directory Assistance — `tell da reload`
      problem: The article presents `tell da reload` as if it is the standard/only reload command. The correct server console command documented by HCL is `tell da reload` which is valid, but the article should also note that changes to the Directory Assistance document take effect without a full server restart precisely because of this command — an important operational caveat. Additionally, the article suggests using a 'Verify' button in the Directory Assistance document; this button exists in some versions but its availability and behavior varies and the article presents it as universally available without any version caveat.
      fix:     Confirm the `tell da reload` command is correct (it is) but add a note that it is required after any change to a Directory Assistance document for changes to take effect. Qualify the 'Verify' button with a version note or recommend testing via an actual authentication or `ldapsearch` from the server as a more reliable alternative.
  [major] Cited source — `https://developer.ds.hcl-software.com/t/directory-assistance-ldap-and-active-directory/56682`
      problem: The URL listed in the 'Cited sources' section does not match the URL actually used inline in Step 3, which references `https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089`. The declared citation and the used citation are different resources. The declared URL may point to a different or non-existent document.
      fix:     Reconcile the cited sources list with the URLs actually embedded in the article. Verify both URLs are valid and point to the intended content before publishing.
  [major] Step 4 cited source — `https://doc.cwpcollaboration.com/appdevpack/docs/en/iam_ldap_config_guide.html`
      problem: This URL appears to reference third-party (CWP Collaboration) documentation, not official HCL Domino documentation. Using a third-party source to back a security-critical step (certificate trust) without identifying it as such is misleading. The URL path structure is also atypical for an authoritative HCL source and may be unreliable.
      fix:     Replace with the official HCL Domino documentation URL for configuring SSL/TLS for Directory Assistance (available at help.hcl-software.com). If the third-party source is retained, clearly label it as supplementary and non-authoritative.
  [minor] Step 2, Configure the Basics Tab — 'Make this domain available to: Notes Clients, Internet Authentication, LDAP Clients'
      problem: The article lists example services without explaining the implications of each choice. For instance, enabling 'LDAP Clients' allows Domino's own LDAP service to pass through queries to the external directory, which has security implications that should be flagged.
      fix:     Add a brief note explaining what each service option does and flag that enabling LDAP client pass-through has security implications that should be reviewed.
  [minor] Summary section title — 'To Review'
      problem: 'To Review' is an unusual and potentially confusing section header for a summary. It could imply the section is an editorial review rather than a conclusion.
      fix:     Rename to 'Summary' or 'Conclusion' for clarity.
-->

## Configuring Directory Assistance for LDAP in HCL Domino

Integrating HCL Domino with external LDAP directories can streamline authentication and user management across your organization. Here's a hands-on guide to setting up Directory Assistance for LDAP in Domino.

### Step 1: Create the Directory Assistance Database

First, you'll need to create a Directory Assistance database:

1. **Create the Database:**
   - Use the `da.ntf` template to create a new database named `da.nsf`.
   - Ensure this database is replicated to all servers that will utilize Directory Assistance.

2. **Configure Servers to Use the Database:**
   - In each server's Server document within the Domino Directory, specify `da.nsf` in the "Directory assistance database name" field.

This setup allows servers to reference external directories for authentication and lookups. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.0/admin/conf_settingupdirectoryassistance_c.html?scLang=en&utm_source=openai))

### Step 2: Create a Directory Assistance Document for the LDAP Directory

Next, configure a Directory Assistance document to connect to your LDAP directory:

1. **Open the Directory Assistance Database:**
   - Navigate to `da.nsf` and create a new Directory Assistance document.

2. **Configure the Basics Tab:**
   - **Domain Type:** Select "LDAP".
   - **Domain Name:** Enter a descriptive name for the LDAP domain.
   - **Company Name:** Provide the company or organization name.
   - **Make this domain available to:** Choose the services that will use this directory (e.g., Notes Clients, Internet Authentication, LDAP Clients).
   - **Group Authorization:** Set to "Yes" if you want to use groups from the LDAP directory for authorization.
   - **Enabled:** Ensure this is set to "Yes".

3. **Configure the LDAP Tab:**
   - **Host Name:** Enter the LDAP server's hostname or IP address.
   - **Port:** Specify the LDAP port (default is 389 for LDAP, 636 for LDAPS).
   - **Optional Authentication Credential for Search:** Provide credentials if anonymous binds are not allowed.
   - **Base DN for Search:** Enter the base distinguished name (DN) for searches (e.g., `DC=example,DC=com`).
   - **Channel Encryption:** Select "Yes" if using LDAPS; ensure the Domino server trusts the LDAP server's certificate.
   - **Type of Search Filter to Use:** Choose "Active Directory" if connecting to an AD server.

4. **Save and Close the Document:**
   - After completing the configuration, save and close the Directory Assistance document.

This configuration enables Domino to query the LDAP directory for authentication and user information. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.0/admin/conf_settingupdirectoryassistance_c.html?scLang=en&utm_source=openai))

### Step 3: Verify the Configuration

To ensure the setup is correct:

1. **Reload Directory Assistance:**
   - On the Domino server console, execute:
     ```
     tell da reload
     ```

2. **Test LDAP Connectivity:**
   - Use the "Verify" button in the Directory Assistance document to test the connection to the LDAP server.

3. **Monitor Server Logs:**
   - Check the server logs for any errors related to LDAP connectivity or authentication.

If issues arise, ensure that network connectivity, firewall settings, and LDAP server configurations are correct. ([developer.ds.hcl-software.com](https://developer.ds.hcl-software.com/t/how-to-troubleshoot-directory-assistance-ldap-against-active-directory/168089?utm_source=openai))

### Step 4: Configure SSL/TLS for Secure LDAP (LDAPS)

If your LDAP server requires secure connections:

1. **Obtain the LDAP Server's Certificate:**
   - Export the LDAP server's SSL certificate or the certificate of the Certificate Authority (CA) that issued it.

2. **Import the Certificate into Domino:**
   - Use the Domino Certificate Authority to import and trust the LDAP server's certificate.

3. **Update the Directory Assistance Document:**
   - **Channel Encryption:** Set to "Yes".
   - **Port:** Use 636 for LDAPS.

4. **Restart the LDAP Service:**
   - On the Domino server console, execute:
     ```
     tell ldap reloadschema
     ```

This ensures that the Domino server can securely communicate with the LDAP server over SSL/TLS. ([doc.cwpcollaboration.com](https://doc.cwpcollaboration.com/appdevpack/docs/en/iam_ldap_config_guide.html?utm_source=openai))

### Step 5: Test Authentication and Lookups

Finally, verify that authentication and user lookups function correctly:

1. **Test User Authentication:**
   - Attempt to authenticate a user whose credentials are stored in the LDAP directory.

2. **Perform Name Lookups:**
   - Use the Domino Directory to search for users from the LDAP directory.

If any issues occur, revisit the Directory Assistance configuration and ensure all settings align with your LDAP server's requirements.

## To Review

Setting up Directory Assistance for LDAP in HCL Domino involves creating and configuring a Directory Assistance database, establishing a connection to the LDAP directory, and verifying the setup. Proper configuration ensures seamless integration between Domino and external LDAP directories, enhancing authentication and user management capabilities.
