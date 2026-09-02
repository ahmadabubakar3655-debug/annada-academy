# Annada Qur'an & Science Academy — Website

## How to run this on your computer

1. Extract this whole folder's contents into:
   `C:\Users\Yahaya.Garba\annada-academy`
   (overwrite/merge with what's already there)

2. Open that folder in VS Code (File → Open Folder).

3. Open a terminal in VS Code (Terminal → New Terminal) and run:

   ```
   npm install
   ```

   This downloads Eleventy (the tool that builds the site) into a `node_modules` folder. This can take a minute.

4. Then run:

   ```
   npm start
   ```

   This starts a local preview server. It will print an address like `http://localhost:8080` — open that in your browser to see the live site. It updates automatically whenever you save a file.

5. To stop the preview server, click into the terminal and press `Ctrl + C`.

## What's in this folder

- `_data/site.js` — every piece of school-specific info (name, contact, colors, mission). Change this file to update it everywhere on the site at once.
- `_includes/` — the header, footer, and page wrapper shared by every page.
- `css/style.css` — all visual styling.
- `js/main.js` — the mobile menu behavior.
- `assets/images/logo.png` — the school logo, cropped from the original photo.
- Each `.njk` file in the root (like `about.njk`, `contact.njk`) is one page of the site.
- `netlify.toml` — tells Netlify how to build and publish the site once we connect it.

## Next steps (we'll do these together)

- Connect this folder to GitHub
- Connect GitHub to Netlify to publish the live site
- Set up MongoDB for news/gallery/contact-message storage
- Build the admin login panel
