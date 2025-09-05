# qodo-todo-app
Simple todo app testing Qodo AI agent


# Qodo To-Do App – Testing Notes
* Installed Qodo Gen extension in VS Code successfully
* Signed in successfully
* AI agent created the app successfully  
* Everything was created in one file (`index.html` with HTML, CSS, and JS)  
* Added screenshots in the `Screenshots` folder  

---

### Issues Found:
1. **Editing task error in console**  
   - 🔍 Message: A form field element has neither an id nor a name attribute. 
     This might prevent the browser from correctly autofilling the form.`
   - 📸 Screenshot provided  

2. **UI: Context placeholder overflow**  
   - 🔍 Current: Context placeholder is still visible after selecting/typing context  
   - ✅ Expected: Placeholder should disappear after selection/input  
   - 📸 Screenshot provided  

3. **UI: Poor visibility of `/Workflows` and `@Contexts` text in VS Code**  
   - 🔍 Current: Text barely visible against bright theme  
   - ✅ Expected: Clear, readable text  
   - 📸 Screenshot provided  

---

### [Workflows Tested]

#### /fix workflow issues found:
_All issues below were automatically detected by the `/fix` workflow._

1. Misuse of role="application"  
- 🔍 Root container uses `role="application"`, which interferes with screen readers  
- 🐛 Accessibility issue, not a runtime bug  
- ❓ Suggestion: Remove role and use semantic HTML  

2. Redundant double render on submit  
- 🔍 `addItem()` calls `render()`, and submit handler also calls `render()`  
- 🐛 Causes two renders for a single action  
- ❓ Suggestion: Call render once (either in `addItem()` or in handler)  

3. Unused variable in beginEdit  
- 🔍 `const prevActions = actions.cloneNode(true)` never used  
- 🐛 Dead code, potential lint warning  
- ❓ Suggestion: Remove unused variable  

4. Buttons missing type="button"  
- 🔍 Non-submit buttons default to type="submit"  
- 🐛 Risk of unintended form submissions  
- ❓ Suggestion: Add `type="button"` to all non-submit buttons  

5. Potential focus loss on re-renders  
- 🔍 Re-render clears focus state  
- 🐛 Degrades keyboard/screen reader usability  
- ❓ Suggestion: Preserve focus or re-focus after render  

6. Non-contextual checkbox label  
- 🔍 Checkbox label is generic (“Mark completed”)  
- 🐛 Ambiguous for screen readers  
- ❓ Suggestion: Associate label with task text dynamically  

7. Filter controls semantics and keyboard interactions  
- 🔍 Filters use buttons with `role="toolbar"`  
- 🐛 Lacks proper keyboard navigation  
- ❓ Suggestion: Use `radiogroup` with radio buttons or improve keyboard support  

8. innerHTML used for static button content  
- 🔍 Buttons created with `innerHTML`  
- 🐛 Potential XSS / CSP issue  
- ❓ Suggestion: Use `createElement` + `textContent`  

9. localStorage.setItem not guarded  
- 🔍 No error handling for quota/private mode  
- 🐛 Can throw exceptions  
- ❓ Suggestion: Wrap in try/catch  

10. CSS overflow: clip may reduce compatibility  
- 🔍 Uses `overflow: clip`  
- 🐛 Limited browser support  
- ❓ Suggestion: Add fallback (e.g., `overflow: hidden`)  

11. Pluralization of “items left”  
- 🔍 Always shows “items left”  
- 🐛 Wrong grammar when count is 1  
- ❓ Suggestion: Add singular/plural logic  

12. ID generation not robust  
- 🔍 Uses `Date.now + Math.random`  
- 🐛 Risk of collisions  
- ❓ Suggestion: Use `crypto.randomUUID()`  

13. Inline style on Delete button  
- 🔍 Style applied with `delBtn.style.color`  
- 🐛 Breaks maintainability/theming  
- ❓ Suggestion: Move to CSS class  

14. Content Security Policy (CSP) missing  
- 🔍 No CSP defined  
- 🐛 Higher XSS risk if app is served  
- ❓ Suggestion: Add restrictive CSP meta tag  

15. Overly broad aria-live region  
- 🔍 `aria-live="polite"` applied to container  
- 🐛 Excessive screen reader announcements  
- ❓ Suggestion: Limit aria-live to item count or status region  

16. Inlined CSS/JS reduces cacheability and maintainability  
- 🔍 All styles/scripts inline in `index.html`  
- 🐛 Poor caching and CSP compatibility  
- ❓ Suggestion: Extract into separate files  

17. Minor: dataset id on li not used elsewhere  
- 🔍 `li.dataset.id` unused  
- 🐛 Redundant code  
- ❓ Suggestion: Remove or leverage for event delegation  




#### /fix workflow issues found:
_All issues below were automatically detected by the `/fix` workflow._

1. Misuse of role="application"  
- 🔍 Root container uses `role="application"`, which interferes with screen readers  
- 🐛 Accessibility issue, not a runtime bug  
- ❓ Suggestion: Remove role and use semantic HTML  

2. Redundant double render on submit  
- 🔍 `addItem()` calls `render()`, and submit handler also calls `render()`  
- 🐛 Causes two renders for a single action  
- ❓ Suggestion: Call render once (either in `addItem()` or in handler)  

3. Unused “actions” element created in render()  
- 🔍 `actions` div created but never appended, while `actionsWrap` is used instead  
- 🐛 Dead code and confusing  
- ❓ Suggestion: Remove unused `actions` variable  

4. Redundant title and aria-label on action buttons  
- 🔍 Buttons like Edit/Delete have both `title` and `aria-label`  
- 🐛 Redundant and noisy for screen readers  
- ❓ Suggestion: Remove `title` and keep `aria-label` or visible text  

5. Over-specified role="group" on input wrapper  
- 🔍 Input wrapper groups a single field with `role="group"`  
- 🐛 Adds unnecessary verbosity to accessibility tree  
- ❓ Suggestion: Remove `role="group"` and use a proper visible or hidden label  

6. Filters container lacks grouping semantics  
- 🔍 Filters visually grouped but not announced as such  
- 🐛 Screen readers miss context  
- ❓ Suggestion: Add `role="group"` and a label to filters container  

7. “Items left” region not announced to screen readers  
- 🔍 Count changes not reliably announced  
- 🐛 aria-live applied to list instead of count  
- ❓ Suggestion: Add `role="status"` or `aria-live` to the count element  

8. aria-relevant may miss text updates  
- 🔍 UL uses `aria-relevant="additions removals"` only  
- 🐛 Text updates (e.g., edits) may not be announced  
- ❓ Suggestion: Include `text` in `aria-relevant`  

9. Full re-render of list on each update  
- 🔍 Entire list rebuilt on every change  
- 🐛 Inefficient and reduces screen reader announcements  
- ❓ Suggestion: Perform targeted DOM updates or restore focus more comprehensively  

10. Limited focus restoration  
- 🔍 Focus restored only for input and checkboxes  
- 🐛 Action buttons lose focus, disrupting workflows  
- ❓ Suggestion: Expand logic to restore focus for active action buttons  

11. Form autocomplete disabled  
- 🔍 `autocomplete="off"` on form#todo-form  
- 🐛 Prevents autofill, harms usability  
- ❓ Suggestion: Remove `autocomplete="off"` or use proper attributes  

12. New-todo input uses aria-label instead of label  
- 🔍 Input named only with `aria-label`  
- 🐛 Less standard, weaker semantics  
- ❓ Suggestion: Use `<label>` with `for/id` and remove `aria-label`  

13. Missing explicit focus-visible styles  
- 🔍 Default outlines only  
- 🐛 Inconsistent and low-contrast focus states  
- ❓ Suggestion: Add explicit `:focus-visible` styles for buttons/inputs  

14. CSP allows 'unsafe-inline'  
- 🔍 CSP permits inline scripts and styles  
- 🐛 Weakens protections  
- ❓ Suggestion: Externalize CSS/JS and use nonces/hashes in production  

15. Color literals not centralized  
- 🔍 Hard-coded colors (#0b1222, #0a1323, #0f1627) in CSS  
- 🐛 Reduces maintainability and theming flexibility  
- ❓ Suggestion: Replace with CSS variables  

16. Variable naming clarity (“active” shadowing)  
- 🔍 `active` used for both `document.activeElement` and loop variable  
- 🐛 Confusing and error-prone  
- ❓ Suggestion: Rename loop variable to `isActive`  




#### /cleanup workflow
- ✂️ Edited `index.html` file  
- 📉 Reduced total lines of code  
- ✅ App tested, all functionalities worked correctly  
- 🖼️ Screenshots added  



#### /docs workflow
- ✂️ Edited index.html file
- 📝 Added concise JSDoc documentation for JavaScript functions
-💡 Included brief inline comments for complex logic / focus preservation / edit flow / rendering / event binding
- ✅ Preserved existing style and behavior



#### /generate-best-practices workflow
- 📝 Generated `Project Best Practices` in separate file named best_practices.md



#### /unit-test workflow
- 📝 Generated Unit Test Plan and Implementation for index.html
- Tested `Step 3 — Behaviors to Test` - everything worked, manually checked
- Tested `Step 3 — Behaviors to Test` - everything worked, manually checked
- Created automatic test

 PASS  tests/app.test.js
  Todo App
    ✓ adds a todo on submit (trim), clears input, updates count (27 ms)
    ✓ ignores empty/whitespace-only submissions (7 ms)
    ✓ toggles completion via checkbox and updates count/class (9 ms)
    ✓ clears completed items (8 ms)
    ✓ filters items and updates aria-pressed (9 ms)
    ✓ edit -> save updates item text (7 ms)
    ✓ edit -> cancel reverts without changes (4 ms)
    ✓ logs warning when localStorage persist fails (4 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.543 s, estimated 1 s

#### FAQ
1. How to run automatic test?
Install and run tests:
> open terminal
> npm install
> npm test


2. Qodo Merge Integration - Setup & Command Testing



#### Qodo Merge Integration 
1.  Qodo Merge Installation process:
github marketplave > Qodo Merge > Add

2. Install verification - screenshot added to `Screenshots/Qodo Merge Pro/` folder, filename is `verification.png`

3. PR link:
https://github.com/JSninjawizard/qodo-todo-app/pull/1

4. Results of /review, /describe and /improve commands have been added as screenshots to `Screenshots/Qodo Merge Pro` folder each screenshot is named respectively.




