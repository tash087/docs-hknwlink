# Hakoniwa Link (hknw.link) Privacy Policy
This is the English version of the terms of use.
Please refer to the Japanese version if possible.
Versions in other languages may not be up to date.
[日本語はこちら](/privacy)

## Operator
HAKONIWA Studio

---

## Article 1: Basic Policy

HAKONIWA Studio (hereinafter referred to as "we," "us," or "our") respects the privacy of users who generate shortened URLs (hereinafter referred to as "Users") and third parties who click on shortened URLs (hereinafter referred to as "End Users") of our URL shortening service "hknw.link" (hereinafter referred to as "the Service"). Our fundamental policy is to **keep personally identifiable information to the absolute minimum necessary**.

Based on the concept of **"Privacy by Design,"** the Service collects information only to the extent necessary for the provision of the Service.

---

## Article 2: Information Collected

### 2.1 Information Collected (Non-Personal Information)

The Service collects the following information when a shortened URL is accessed:

| Item | Description | Purpose of Collection |
|------|-------------|------------------------|
| Access Timestamp | Date and time the shortened URL was clicked (UTC) | Traffic analysis, fraud detection |
| Country/Region | Visitor's country code provided by Cloudflare (e.g., JP, US) | Understanding geographic trends |
| Referrer | Website URL of the access source (obtained from Referer header) | Analysis of traffic sources |
| Click Count | Total number of accesses to each shortened URL (aggregated value) | Understanding popular links |

### 2.2 Information Collected (System Data)

| Item | Description | Notes |
|------|-------------|-------|
| Short ID | 6-character random identifier created by the User | Required for link management |
| Destination URL | Original URL registered by the User | Required for redirect functionality |
| Email Address | Email address registered by Registered Users for authentication | Required for login and data synchronization |

---

## Article 3: Information NOT Collected (Explicit Non-Collection)

The Service **does not collect any of the following information**:

| Category | Specific Examples |
|----------|-------------------|
| IP Addresses | IPv4 addresses, IPv6 addresses |
| Device Identifiers | Device ID, MAC address, IMEI |
| Browser-related | Browser fingerprint, detailed user agent※ |
| Location Data | GPS coordinates, precise geolocation information |
| Personally Identifiable Information (except email) | Name, phone number, physical address |
| Tracking Technologies | Cookies (including session cookies - none used at all) |
| Cross-site Tracking | Tracking of behavior across different websites |

> ※ Standard Cloudflare Worker logs may contain user agent information; however, we **do not save, record, or view** this information. It is automatically discarded at Cloudflare's system level.

---

## Article 4: Data Retention Periods

| Data Type | Retention Period | Notes |
|-----------|------------------|-------|
| Individual Click Logs | **90 days** | Automatically deleted from D1 database after this period |
| Aggregated Statistics (Total Clicks) | Indefinite | Retained as long as the link is active |
| Link Information (Short ID + Destination URL) | Indefinite | Users cannot delete this themselves※ |
| Email Address | Duration of account validity | Users can request deletion at any time (separate process required) |

> ※ Link deletion functionality may be implemented in the future. Currently, we do not accept deletion requests.

---

## Article 5: Purpose of Data Use

Collected information is used only for the following purposes:

1. **Service Provision**
   - Correct redirect processing from shortened URLs
   - Display of the landing page (with masking tape animation)
   - Login functionality via email authentication
   - Data synchronization across multiple devices for the same account

2. **Service Improvement and Optimization**
   - Analysis of access trends (e.g., access patterns by time of day)
   - Identification of performance bottlenecks

3. **Detection of Unauthorized or Prohibited Activities**
   - Identifying abnormal access patterns caused by spam or bots
   - Discovering URLs that violate prohibited activities (Article 4 of Terms of Service)

4. **Advertising Effectiveness Measurement** (planned for future implementation)
   - Calculation of click-through rates for ads displayed on the landing page
   - Creation of reports for monetization (aggregated values only, without personal identification)

---

## Article 6: Third-Party Data Sharing

### 6.1 When We Do NOT Share

We do not share collected information with third parties except in the following cases:

- When we obtain User consent
- When responding to legitimate legal disclosure requests based on applicable laws (court orders, formal requests from law enforcement agencies)

### 6.2 When We Share (Sub-processors)

The Service uses the following cloud platforms, which involve sending information to these platforms:

| Company | Service | Information Sent | Data Center Location(s) |
|---------|---------|------------------|--------------------------|
| Cloudflare, Inc. | Workers, D1, Pages | Click logs, country information, referrer data | Worldwide (primarily Japan, USA) |
| Via Internet | Destination URL | Directly from End User's browser | Depends on User's destination |

These companies process data according to our instructions and are prohibited from using it for their own purposes.

---

## Article 7: End User Rights

### 7.1 Data Deletion Requests

If an End User wishes to have their own access logs deleted, we will respond as follows:

- **Feasibility**: In principle, since **individuals cannot be identified**, we cannot identify and delete specific accesses.
- **Alternative Measure**: If you wish to reset statistics for a specific shortened URL entirely, please contact us at abuse@hknw.link. However, we may decline such requests at our discretion.

### 7.2 Registered User Data Deletion

If a Registered User wishes to delete their account and associated data, please contact us at abuse@hknw.link. We will delete data associated with that email address within a reasonable period.

### 7.3 Opt-Out (Refusal of Collection)

If End Users do not wish to have statistical information collected:

- **Method**: Even if you enable your browser's "Do Not Track" setting, the Service **does not recognize** this signal (technically not supported).
- **Alternative Method**: Do not click on shortened URLs, or use an ad blocker (though this may result in incomplete statistics).

---

## Article 8: Security Measures

We implement the following measures to protect collected information:

| Measure | Description |
|---------|-------------|
| Encryption | Communication between Cloudflare Workers is encrypted with TLS 1.2 or higher |
| Access Control | D1 database access is permitted only from Workers (no direct access) |
| Principle of Least Privilege | Operators do not have access to more data than necessary |
| Regular Audits | Inventory of collected data is reviewed quarterly |
| Passwordless Authentication | Verification code method eliminates the risk of password list attacks |

---

## Article 9: Children's Privacy

The Service **does not intentionally collect information from individuals under the age of 13**.

- If Users under 13 use the Service, they shall do so **with parental consent**.
- If a parent believes their child's information has been collected, please contact us at abuse@hknw.link.

---

## Article 10: Changes to This Privacy Policy

1. We may change this policy without prior notice due to changes in laws or service content.
2. If there are material changes, we will notify you by posting on the Service or our website.
3. The revised policy will take effect at the time it is posted on the Service.

---

## Article 11: Response to Data Breaches

In the unlikely event of a data breach involving collected information:

1. **Investigation of Impact**: Identify the breached information and analyze the cause
2. **Notification to Users**: Contact potentially affected Users (by email if a registered email address exists; otherwise, via posting on the Service only)
3. **Preventive Measures**: Implement technical and operational countermeasures
4. **Report to Authorities**: Report to Japan's Personal Information Protection Commission or other relevant authorities as required by law

---

## Article 12: Contact Information

For inquiries regarding this Privacy Policy or questions about data processing, please contact us at:

| Purpose | Contact |
|---------|---------|
| General privacy inquiries | privacy@hknw.link |
| Data deletion requests | abuse@hknw.link |
| Legal inquiries | legal@hknw.link |

**Estimated Response Time**: Approximately 4 days after inquiry (excluding weekends and holidays)
**Languages**: Japanese, English (consultation available)

---

## Article 13: Governing Law and Jurisdiction

1. The interpretation and application of this Privacy Policy shall be governed by **the laws of Japan**.
2. If any dispute arises between a User and us regarding this Privacy Policy or the use of the Service, the exclusive governing court for first-instance jurisdiction shall be the district court that has jurisdiction over our place of residence.