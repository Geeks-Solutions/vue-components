# Releases

### V3.0.8 (13/12/2025)

---

- Bump Quill to v2.0.3
- Stop silencing errors in the wysiwyg editor

### V3.0.7 (10/12/2025)

---

- Fix for UniversalViewer component to support dynamic src on Lottie animations
- Watch lottie animation src to correctly animate when MediaUrlTransformer is used
- Add support for Lottie animations as base64 strings

### V3.0.6 (09/12/2025)

---

- Update the Media api calls to be forwarded to a function prop `forwardRequest`
- Add a new transformer function prop to be able to transform the URL of a media before it is displayed
- Use the `lazyGUniversalViewer` component to display medias inside the media folder component

---

### v3.0.5 (01/09/2025)

---

- Update Media metacomponent to support customizing media file types through a prop "acceptedFileTypes"
- Fixed Wysiwyg Media Links bug
- Add support for routing the media api calls into an optional function prop "forwardRequest"


### v3.0.4 (27/08/2025)

---

- Offline Mode management
- Mobile friendly adjustment #226
- Lottie animation support for Media MetaComponent and wyisywg

### v3.0.3 (27/06/2025)

---

- html editor bugs in the wysiwyg #155

### v3.0.2 (05/06/2025)

---

- Wysiwyg editor bugs to fix #145

### v3.0.1 (26/05/2025)

---

- Display fixes #155


### v3.0.0 (23/05/2025)

---

- BREAKING CHANGE: Library migrated to nuxt 3


### v1.0.21 (07/05/2025)

---

- Sanitize Blogs and media API responses
- Fix edit blog component automatic scrolling 


### v1.0.20 (24/04/2025)

---

- Blogs bug fixes: Bugs with a user that has roles Author or Author and Publisher eweev/geeks/bo-blogs#43


### v1.0.19 (18/04/2025)

---

- Fix quill word wrap default styling to `word-wrap: normal;`


### v1.0.18 (15/04/2025)

---

- Fix quill font size bugs: Quill editor 2 font size bugs #114 


### v1.0.17 (15/04/2025)

---

- Fix svg bug with width style in quill toolbar options


### v1.0.16 (08/04/2025)

---

- Extend wysiwyg to have a button injection from the toolbar options: Integrate buttons and table to the Quill 2 editor #90

- Extend quill colors fonts/background with 2 new colors '#51AEC3', '#fce085': Add colors to the color picker of the wisywyg #100

- Fixed quill html insertion by adding a custom html raw module blot: When you add in the html the code of a form, it is not reflected as is as some codes seems filtered #92

- Extended quill editor font size list: Add a way to select custom font sizes in the quill editor component #103

- Update quill direct links behavior to remove target blank for non-external links: When from a wysiwyg you have a direct link to a page of your site or a section's anchor, if you click on it a new tab open #98

- Extended quill editor with a table support: Integrate buttons and table to the Quill 2 editor #90

- Update quill anchor tags to behavior similar to the nuxt-links behavior

- Update quill toolbar options order: Review of the wysiwyg component #108 

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