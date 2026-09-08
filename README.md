# Mercado_StudentProfile

A multi-page responsive student profile web application packaged with Apache Cordova for ITCC 41.

## 1. Project Description
This application serves as a comprehensive multi-page Student Profile showcasing personal information, detailed background, technical competencies, previous projects, and contact details.

## 2. Application Pages
* **Profile (`index.html`):** Homepage serving as the primary entry point with profile summary and main branding.
* **About (`about.html`):** Personal background, interests, educational experience, and future career goals.
* **Skills (`skills.html`):** Technical competencies broken down into key skill categories.
* **Projects (`projects.html`):** Showcase of 3 featured projects including descriptions, developer roles, and tech stacks.
* **Contact (`contact.html`):** Direct contact channels and interactive form mockup.

## 3. Navigation
Navigation is handled using standard HTML hyperlink tags (`<a href="...">`) embedded across a uniform navigation bar on all 5 pages. No JavaScript is used for routing or rendering.

## 4. Responsive Design
All five application screens are fully responsive across target viewports:
* **Mobile (<600px):** Single-column stacked layouts and touch-friendly navigation elements.
* **Tablet (600px - 899px):** Balanced multi-column arrangements.
* **Desktop (≥900px):** Constrained layout width (1000px max) with expanded multi-column grids.

## 5. UI/UX Principles Applied
* **Visual Consistency:** Shared CSS styling (`css/index.css`), color hierarchy, and typography across all pages.
* **Clear Usability:** Persistent top navigation bar allows users to switch pages or return home at any time.
* **Accessibility:** High-contrast text elements, form labeling, and semantic HTML markup.

## 6. How to Run
```bash
cordova platform add android
cordova run android
```

### 7. Application Screenshots

### Profile Page
![Profile Page](./Screenshots/profile.png?v=2)

### About Page
![About Page](./Screenshots/about.png?v=2)

### Skills Page
![Skills Page](./Screenshots/skills.png?v=2)

### Projects Page
![Projects Page](./Screenshots/projects.png?v=2)

### Contact Page
![Contact Page](./Screenshots/contact.png?v=2)

