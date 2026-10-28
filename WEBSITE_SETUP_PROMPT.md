# Minimal Claude Code prompt for reviewing the website

After copying this website add-on into the root of the existing `ClayBreeze` repository, use this prompt in Claude Code:

> Review the new ClayBreeze static website files: `index.html`, `assets/css/site.css`, `assets/js/project-data.js`, `assets/js/gallery-data.js`, and `assets/js/site.js`, plus `WEBSITE_GUIDE.md`. Do not recreate the site or rewrite the project documentation. Check internal file links, image path logic, accessible controls, mobile responsiveness, and JavaScript errors. Make only necessary fixes and show me a list of changed files. Do not commit, configure a remote, or publish to GitHub.
