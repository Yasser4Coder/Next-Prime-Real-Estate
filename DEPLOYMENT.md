# Deploy Next Prime Real Estate to Hostinger (hPanel)

## 1. Build the project

```bash
npm run build
```

This creates a `dist` folder with your production files.

## 2. Fix for direct URLs (404 on /properties, etc.)

The `public/.htaccess` file is for Apache (Hostinger). It tells the server to serve `index.html` for all routes that are not real files, so React Router can handle `/properties`, `/properties/123`, etc.

- **If `dist/.htaccess` exists after build** – you're good. Upload the contents of `dist` to Hostinger.
- **If `dist/.htaccess` is missing** – copy `public/.htaccess` into the `dist` folder before uploading:
  ```bash
  cp public/.htaccess dist/
  ```

## 3. Upload to Hostinger

1. Log in to **hPanel** (Hostinger).
2. Open **File Manager** and go to **public_html** (or your domain’s root folder).
3. Delete or backup any old site files in that folder.
4. Upload **all contents** of your local `dist` folder into `public_html`:
   - `index.html` (at the root)
   - `assets/` (JS, CSS, images)
   - `.htaccess` (must be present for routing to work)

Do **not** upload the `dist` folder itself – only its contents. The structure in `public_html` should look like:

```
public_html/
  .htaccess
  index.html
  logo-icon.PNG
  assets/
    index-xxxxx.js
    index-xxxxx.css
    ...
```

## 4. Check that routing works

- Open: `https://yourdomain.com/`
- Then open: `https://yourdomain.com/properties`
- Then open: `https://yourdomain.com/properties/1`

If you see the correct pages (no 404), the `.htaccess` setup is working.

## 5. Optional: Subfolder deployment

If the site runs in a subfolder (e.g. `https://yourdomain.com/realestate/`):

1. In `vite.config.js` set `base: '/realestate/'`.
2. In `public/.htaccess` set `RewriteBase /realestate/`.
3. Rebuild and upload again.

## Dashboard (CMS)

- **URL:** `https://yourdomain.com/dashboard`
- **Login:** `admin` / `admin123` (change in `src/pages/dashboard/Login.jsx` for production)
- **Data:** Stored in the browser’s **localStorage** under the key `nextprime_cms`. Edits apply only in that browser until you add a real backend (e.g. Supabase/Firebase) and switch the store to use it.
- **Sections:** Properties, Testimonials, Locations / Areas, Featured Properties, Contact Info, Social Media, Users. The main site uses this data when present (e.g. contact widget, footer social links, properties list, testimonials, areas, featured list).

## Summary

| Item | Purpose |
|------|--------|
| `.htaccess` | Sends all non-file requests to `index.html` so React Router works and direct links don’t 404. |
| Upload `dist` contents | Your built app; must include `index.html`, `assets/`, and `.htaccess`. |
| `Options -Indexes` | Stops directory listing in `.htaccess` (already set). |
| Dashboard | Manage content via `/dashboard`; data in localStorage per device. |