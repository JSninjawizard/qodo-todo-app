# qodo-todo-app
Simple todo app testing Qodo AI agent


# Qodo To-Do App – Testing Notes
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


### fix workflow
### 1. Misuse of role="application"
- ✅ Detected by /fix workflow
- 🔍 Root container uses `role="application"`, which interferes with screen readers
- 🐛 Accessibility issue, not a runtime bug
- ❓ Suggestion: Remove role and use semantic HTML

### 2. Redundant double render on submit
- ✅ Detected by /fix workflow
- 🔍 `addItem()` calls `render()`, and submit handler also calls `render()`
- 🐛 Causes two renders for a single action
- ❓ Suggestion: Call render once (either in `addItem()` or in handler)

### 3. Unused variable in beginEdit
- ✅ Detected by /fix workflow
- 🔍 `const prevActions = actions.cloneNode(true)` never used
- 🐛 Dead code, potential lint warning
- ❓ Suggestion: Remove unused variable

### 4. Buttons missing type="button"
- ✅ Detected by /fix workflow
- 🔍 Non-submit buttons default to type="submit"
- 🐛 Risk of unintended form submissions
- ❓ Suggestion: Add `type="button"` to all non-submit buttons

### 5. Potential focus loss on re-renders
- ✅ Detected by /fix workflow
- 🔍 Full list re-renders clear focus state
- 🐛 Degrades keyboard/screen reader usability
- ❓ Suggestion: Preserve focus or re-focus after render

### 6. Non-contextual checkbox label
- ✅ Detected by /fix workflow
- 🔍 Checkbox label is generic (“Mark completed”)
- 🐛 Ambiguous for screen readers
- ❓ Suggestion: Associate label with task text dynamically

### 7. Filter controls semantics and keyboard interactions
- ✅ Detected by /fix workflow
- 🔍 Filters use buttons with `role="toolbar"`
- 🐛 Lacks proper keyboard navigation
- ❓ Suggestion: Use `radiogroup` with radio buttons or improve keyboard support

### 8. innerHTML used for static button content
- ✅ Detected by /fix workflow
- 🔍 Buttons created with `innerHTML`
- 🐛 Potential XSS / CSP issue
- ❓ Suggestion: Use `createElement` + `textContent`

### 9. localStorage.setItem not guarded
- ✅ Detected by /fix workflow
- 🔍 No error handling for quota/private mode
- 🐛 May throw exceptions
- ❓ Suggestion: Wrap in try/catch

### 10. CSS overflow: clip may reduce compatibility
- ✅ Detected by /fix workflow
- 🔍 Uses `overflow: clip`
- 🐛 Limited browser support
- ❓ Suggestion: Add fallback (e.g., `overflow: hidden`)

### 11. Pluralization of “items left”
- ✅ Detected by /fix workflow
- 🔍 Always shows “items left”
- 🐛 Wrong grammar when count is 1
- ❓ Suggestion: Add singular/plural logic

### 12. ID generation not robust
- ✅ Detected by /fix workflow
- 🔍 Uses `Date.now + Math.random`
- 🐛 Risk of collisions
- ❓ Suggestion: Use `crypto.randomUUID()`

### 13. Inline style on Delete button
- ✅ Detected by /fix workflow
- 🔍 Style applied with `delBtn.style.color`
- 🐛 Breaks maintainability/theming
- ❓ Suggestion: Move to CSS class

### 14. Content Security Policy (CSP) missing
- ✅ Detected by /fix workflow
- 🔍 No CSP defined
- 🐛 Higher XSS risk if app is served
- ❓ Suggestion: Add restrictive CSP meta tag

### 15. Overly broad aria-live region
- ✅ Detected by /fix workflow
- 🔍 `aria-live="polite"` applied to container
- 🐛 Excessive screen reader announcements
- ❓ Suggestion: Limit aria-live to item count or status region

### 16. Inlined CSS/JS reduces cacheability and maintainability
- ✅ Detected by /fix workflow
- 🔍 All styles/scripts inline in `index.html`
- 🐛 Poor caching and CSP compatibility
- ❓ Suggestion: Extract into separate files

### 17. Minor: dataset id on li not used elsewhere
- ✅ Detected by /fix workflow
- 🔍 `li.dataset.id` unused
- 🐛 Redundant code
- ❓ Suggestion: Remove or leverage for event delegation