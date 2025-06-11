# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Shrink My Link - Project Documentation

## Overview
This project is a URL shortener built with SvelteKit and Cloudflare Workers. It allows users to generate short links for long URLs, track usage, and manage links via an admin interface.

---

## File-by-File Documentation

### 1. `src/routes/+page.svelte`
**Purpose:**  
Main frontend page for the URL shortener.

**How it works:**
- Displays a form for users to enter a long URL.
- On submission, sends the URL to the server (via a POST request).
- If a short URL is returned, displays it with a copy button and a link to view statistics.
- Shows error messages if the input is invalid or if the server returns an error.

---

### 2. `src/routes/+page.server.js`
**Purpose:**  
Handles the backend logic for shortening URLs.

**How it works:**
- Receives the form submission from the frontend.
- Validates the URL.
- Generates a unique short code (slug) and stores the mapping in Cloudflare KV.
- Returns the short URL to the frontend.
- Handles and reports errors gracefully.

---

### 3. `src/lib/utils.ts`
**Purpose:**  
Contains utility functions used by the backend.

**How it works:**
- `isValidUrl(url)`: Checks if a URL is valid and uses http/https.
- `generateUniqueSlug(env)`: Generates a unique 6-character slug, ensuring no duplicates in KV.

---

### 4. `src/routes/admin/+page.server.js`
**Purpose:**  
Backend logic for the admin page.

**How it works:**
- Lists all shortened links stored in Cloudflare KV.
- Returns an array of objects with the code, original URL, and click count for each link.

---

### 5. `src/routes/admin/+page.svelte`
**Purpose:**  
Frontend for the admin page.

**How it works:**
- Displays a table or list of all shortened links, their original URLs, and usage statistics.

---

### 6. `wrangler.toml`
**Purpose:**  
Configuration for deploying to Cloudflare Workers.

**How it works:**
- Specifies the name, KV namespaces, and build settings for your project.

---

### 7. `package.json`
**Purpose:**  
Manages project dependencies and scripts.

**How it works:**
- Lists all npm packages required for development and production.
- Contains scripts for building, developing, and deploying the project.

---

### 8. `svelte.config.js` & `vite.config.ts`
**Purpose:**  
Configuration files for SvelteKit and Vite.

**How it works:**
- Set up adapters, preprocessors, and build options for your SvelteKit app.

---

### 9. `static/`
**Purpose:**  
Holds static assets (images, favicon, etc.) served directly by your app.

---

## Usage
- Visit the main page to shorten URLs.
- Use the admin page to view and manage all shortened links.
- All data is stored in Cloudflare KV for scalability and speed.

---

For further details, see the code comments or ask for more specific documentation!
