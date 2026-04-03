# Fremont Student Makers Website

This repository hosts the main Fremont Student Makers site and related pages under a shared student domain.

## Project Types

We publish two types of project pages:

- Program Teams: Official recurring teams (for example MakerSat, Maker Club, Untitled Rocketry, Take 3)
- Individual Projects: Student portfolio pages for personal builds and experiments

## Site Structure

- `index.html`: Main homepage, featuring Program Teams and Individual Projects carousels
- `pages/student-projects.html`: Full listing page for both categories
- `pages/portfolio-template.html`: Starter template for new student portfolio pages
- `pages/portfolio-example-solar-rover.html`: Example completed portfolio page
- `photos/`: Shared media assets

## Add a New Individual Portfolio

1. Copy `pages/portfolio-template.html`.
2. Rename it using this pattern:
	- `portfolio-firstname-lastname-project.html`
3. Replace all placeholders with your own content.
4. Use images from `photos/` (or add new images there with descriptive names).
5. Test all links and image paths.
6. Submit your publish request with the Google Form used by the site.

## Portfolio Content Checklist

Every individual portfolio should include:

- Project title and author name
- One paragraph summary
- Project snapshot (status, timeline, focus area)
- At least 2 project images
- Build process notes (challenge, approach, iterations, outcome)
- Tools and resources list
- Optional links (demo, code, build log)
- Contact information

## Publishing Guidelines

- Keep content school-safe and accurate.
- Use clear, concise language.
- Verify external links before submission.
- Use lowercase file names with hyphens.
- Prefer optimized images for faster page load.

## Maintaining Homepage Features

When adding or rotating featured cards:

1. Update Program Teams cards in `index.html` under the Program Teams lane.
2. Update Individual Projects cards in `index.html` under the Individual Projects lane.
3. Keep category badges accurate (`Program Team` vs `Individual Project`).
4. Add corresponding entries on `pages/student-projects.html`.
