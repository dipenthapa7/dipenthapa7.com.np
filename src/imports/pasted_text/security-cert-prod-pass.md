Perform a FINAL SECURITY + CERTIFICATE + PRODUCTION-READINESS pass.

IMPORTANT:
The current design is fully approved.

DO NOT redesign or visually change:
- hero
- 3D orb
- dark/violet theme
- typography
- navbar
- projects
- layouts
- animations
- spacing
- responsive structure

Only make the corrections listed below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ADD REAL CERTIFICATE LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current EducationCerts.tsx still does not contain the genuine credential URLs.

HACKERRANK

Certificate:
Python (Basic)

Issuer:
HackerRank

Use this public credential URL:

https://www.hackerrank.com/certificates/c1f9e6ac26fe

Use the normal certificate page, NOT the iframe URL.

Show:

Verify Credential ↗

Use:

target="_blank"
rel="noopener noreferrer"

Do not invent:
- completion date
- credential ID
- score

unless verified.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILL LAB / CAREER SERVICE LAB

Use this genuine certificate URL:

https://courses.careerservicelab.com/mod/customcert/view.php?id=3207&downloadown=1

Use the genuine certificate title already supplied by Dipen.

If that title is:

Time Management

keep:

Time Management
Skill Lab

Add:

View Certificate ↗

Use:

target="_blank"
rel="noopener noreferrer"

Do not iframe the external certificate.

Do not invent dates or IDs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CERTIFICATION ACCESSIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not use the same generic aria-label for every credential.

For HackerRank use:

aria-label="Verify Python Basic credential on HackerRank"

For Skill Lab use:

aria-label="View Time Management certificate from Skill Lab"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SECURITY — SECRETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Search the complete project for:

API_KEY
SECRET
TOKEN
PASSWORD
PRIVATE_KEY
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DATABASE_URL
AUTH_TOKEN
SERVICE_KEY

Also check for:
.env files
.pem files
.key files

No secrets may be shipped to the browser.

Do not add any private credentials.

Remember:
VITE_* variables are exposed to client JavaScript and must never contain secrets.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. SECURITY — XSS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the current safe React rendering.

Do not introduce:

dangerouslySetInnerHTML
innerHTML
document.write
eval()
new Function()

Do not render user input as HTML.

Keep form input as plain text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. SECURITY — EXTERNAL LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit all external links including:

GitHub
LinkedIn
Source Code
View Live
HackerRank
Skill Lab

All external links opened in a new tab must use:

target="_blank"
rel="noopener noreferrer"

Do not allow arbitrary user-generated URLs.

Keep project/profile/certificate URLs hardcoded and trusted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. CONTACT FORM LIMITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current contact form uses mailto and is client-only.

Keep the existing:

Email draft opened

behavior.

Add reasonable field limits:

Name:
maxLength={100}

Email:
maxLength={254}

Message:
maxLength={3000}

Keep:
required
type="email"

Do not claim the email was successfully delivered.

Do not add a backend just for this task.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. CONTACT PRIVACY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not store form values in:

localStorage
sessionStorage
cookies
analytics
external databases

The current form should remain local in component state only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. DEPENDENCY SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit the current dependency tree.

Current lockfile contains approximately:

React 19.2.4
React DOM 19.2.4
Vite 8.0.3

Check for known vulnerabilities using the package manager's audit capability.

Do NOT blindly apply breaking major-version upgrades.

If security patches are available within compatible versions:
upgrade carefully and verify the project still builds.

The application is client-side Vite/React and does not use React Server Components.

Do not add react-server-dom packages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
9. SECURITY HEADERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the final hosting platform supports HTTP response headers, recommend/configure:

X-Content-Type-Options: nosniff

Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy:
disable unnecessary browser capabilities

Strict-Transport-Security:
only when HTTPS is fully configured

Content-Security-Policy:
create a policy based ONLY on resources actually required by the site.

Do not use:

default-src *
script-src *

Do not break Figma Make preview functionality merely to simulate headers.

Clearly separate:
- changes possible inside this React project
- changes that must be configured on the final hosting platform

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10. THIRD-PARTY CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not embed HackerRank or Skill Lab pages using iframe.

Use normal external links.

Do not load third-party scripts from these certificate sites.

This minimizes tracking, iframe risks, and external dependency problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
11. MIXED CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ensure all production resources use HTTPS.

Audit for insecure:

http://

resources.

Do not load HTTP:
scripts
fonts
images
APIs
iframes

inside the HTTPS production site.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
12. PRODUCTION SOURCE MAPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ensure production builds do not publish inline source maps.

Development/preview source maps are acceptable.

Production should keep source maps disabled unless intentionally required for monitoring.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
13. SITE METADATA — FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current site configuration contains an unrelated description:

"Streamline project management with intuitive task tracking and collaboration tools designed for teams to enhance productivity and communication."

Remove it.

Replace with an accurate portfolio description such as:

"Dipen Thapa is a Python and Data Science developer focused on machine learning, data analysis, web development, and practical technology projects."

Do not invent professional claims.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
14. ROBOTS / SEARCH INDEXING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current Figma site config uses:

robots.index = false

Do NOT blindly change this if it is required for Figma Make preview.

However, for the FINAL PUBLIC PRODUCTION deployment at:

https://www.dipenthapa7.com.np/

ensure the site is indexable unless Dipen intentionally chooses otherwise.

The production website should not ship:

noindex
nofollow

and should not disallow all crawlers in robots.txt.

Clearly report whether this setting is preview-only or production-facing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
15. ACCESSIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep semantic:

<a>
<button>
input
textarea
label

elements.

Make sure each label is correctly associated with its input using htmlFor/id, not only visually placed nearby.

Keep visible keyboard focus states.

External credential actions need descriptive labels.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
16. FINAL SECURITY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After the changes, report:

A. Secrets found
B. Unsafe HTML/XSS patterns found
C. External-link issues found
D. Form/security issues found
E. Dependency concerns
F. Production-header recommendations
G. Certificate links added
H. Anything still requiring hosting/server configuration

Do NOT claim the portfolio is "100% secure."

Say only that a best-practice frontend security review was performed.

Do not modify the visual design.