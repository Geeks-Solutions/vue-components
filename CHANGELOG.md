# Releases

---

### v2.0.0 (09/04/2025)

---

- [x] Migration from Vue 2/Nuxt 2 to Vue 3/Nuxt 3
  - Migrated components:
    - Buttons
    - Inputs
    - wysiwyg
    - MediaComponent
    - Media
    - IconsClose
  - Updated testing framework from Jest to Vitest
  - Updated build and development tools
  - Added TypeScript support
  - Replaced Vuex with Pinia for state management

**Breaking Changes**
- Vue 3 Composition API is now used instead of Options API
- Component props and emits are now defined using the new Vue 3 syntax
- Host projects must use Vue 3/Nuxt 3


### v1.0.15 (03/04/2025)

---

- Fix duplicate ordered and bullet styles for ol list inside wysiwyg editor and view: Wysiwig bullet list bug #91


### v1.0.14 (28/03/2025)

---

- Adding retro compatibility for WysiwygContent view component to have support for quill 1 styles 


### v1.0.13 (17/03/2025)

---

- Global css import for quill editor is moved to new `WysiwygContent` component to only load the css when the component is used.
- Introduced a new component `WysiwygContent` for displaying wyiswyg contents

**Breaking Change**
- Using `v-html` to display the wysiwyg content will still work, but it will no more have the wysiwyg styles `headings, aligments etc...`
- Use the new introduced component to display the wysiwyg content
  `<gWysiwygContent :html-content="html" />`


- Updated quill js to version 2.0.3

### v1.0.12 (31/01/2025)

---

- [x] Fixed Mobile responsiveness support for some components: Mobile responsiveness landscape and as well tablet eweev/geeks/sections-bo#239

- [x] Fixed Blogs components for when a user has multiple roles: When a user has both roles Author and Publisher, or Admin and Publisher, it should have access for the 2 roles eweev/geeks/bo-blogs#22

- [x] Draft management improvement: Remove duplicate articles and show only the draft with a link to access the original article eweev/geeks/bo-blogs#36

- [x] When editing or adding an article for the suggested article, have in the listing the picture of it near the title and as well when selecting one eweev/geeks/bo-blogs#20

- [x] Fixed undefined in media popup content: In the media meta component, when a media is linked to a blogs article and you open the content details, instead of the article title showing there is undefined #67


### v1.0.11 (07/01/2025)

---

- [x] Update Wysiwyg editor used by Blogs Meta component to use the recent version of the editor



### v1.0.10 (20/12/2024)

---

- [x] Update for Blogs meta component when creating/editing an article to have body and description required


### v1.0.9 (24/10/2024)

---

- [x] Bug fix for Blogs meta component when editing a published article

- [x] Added Blogs meta component translation support for articles


### v1.0.8 (16/10/2024)

---

- [x] Bug fixes for Blogs meta component add/edit/publish/delete



### v1.0.7 (3/09/2024)

---

- [x] Introduced Blogs meta component to add/edit/publish/delete and show articles



### v1.0.6 (11/07/2024)

---

- [x] Add support for sub filters placeholders and descriptions in FilterSelect component


### v1.0.5 (16/11/2023)

---

- [x] Add Mobile responsiveness support for the components

- [x] Fix for Media component filter to preserve filters


### v1.0.4 (24/8/2023)

---

- [x] Bug fix for total medias in folders in media meta components



### v1.0.3 (30/6/2023)

---

- [x] Bug fixes for media meta components

- [x] Add support for documents upload/document folders



### v1.0.2 (30/6/2023)

---

- [x] Performance and style updates on the media meta component


### v1.0.1 (29/6/2023)

---

- [x] Bug fix for broken components style


### v1.0.0 (26/6/2023)

---

- [x] Launch of vue-components library

- [x] Required updates for issue Library update to support media #92