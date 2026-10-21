# Beyond Anger — Yumi Sera

A minimal, responsive, English-language website. Designed to run at **zero monthly cost** within the applicable free tiers of Cloudflare Pages, GitHub and Pages CMS. The public address will be a free `*.pages.dev` subdomain.

## What is included

- Home — artwork image, inquiry, automatically ordered **Latest Conversations**
- Profile — supplied English introduction, year-by-year biography, publications
- Portfolio — editable project cards
- Beyond Anger — statement and an editable list of embedded YouTube films
- Conversations — YouTube and Substack interviews
- Mobile navigation and responsive layout

The supplied **Beyond Anger** main illustration is now included as the homepage hero and installation image.

The first sample Conversation is unpublished. It is an example for editors and does not appear in the live list until deliberately published.

## Local preview

Requires Node.js 18+:

```bash
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. (Opening `index.html` directly with a `file://` URL will not load `content.json`.)

## Publish for free

1. Create a free GitHub account and a repository such as `beyond-anger`.
2. Upload **the contents of this folder** to the repository's `main` branch, including the hidden `.pages.yml` file and the `scripts` folder. Do not upload the built `dist` folder instead of the source files.
3. In [Cloudflare](https://dash.cloudflare.com/), create a Pages project, **Import existing Git repository**, and select that repository.
4. Use **Build command** `npm run build` and **Build output directory** `dist`. Deploy. Cloudflare will allocate a free `*.pages.dev` address.
5. Go to [Pages CMS](https://app.pagescms.org), sign in using GitHub, install/authorise its GitHub app for this repository, and open this project. The root `.pages.yml` defines your editor.

Cloudflare will redeploy when Pages CMS commits saved changes to GitHub. If it doesn't, check that the repository and production branch are correctly connected to Cloudflare Pages.

## Everyday edits

- **Main photo, texts, biography and films:** `Site Text & Profile` in Pages CMS.
- **Interview:** `Conversations / Interviews` → Add → Title, Date, Description, Thumbnail, YouTube URL, Substack URL → set `Show on Website` to true → Save.
- **Artworks:** `Portfolio / Works` → Add → upload thumbnail and write the project description.
- `Latest Conversations` automatically shows the newest *published* entries by date.

**Important:** YouTube/Substack publishing does not automatically create a Conversation entry. Add a link in the CMS each time; this avoids paid automation services and gives you editorial control.

## Notes

- This is an initial working website and has not been deployed to the user's accounts. There is no externally hosted live URL yet.
- It uses a Google Fonts connection when online, with system-font fallbacks.
- GitHub source must be public or within your plan's compatible access policy; do not upload private unpublished sensitive content.
- If you want a custom domain rather than the free `*.pages.dev` address, domain registration may cost money.
- Portfolio works have been populated using documentary page images rendered from the supplied 12-page PDF. The PDF page images include Picasso reproductions; review third-party artwork reproduction rights before public deployment. Add separate original high-resolution photographs later for a more polished portfolio.
Substack integration update.
