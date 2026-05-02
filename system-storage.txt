HexagonOS System-Storage Architecture
=====================================

Purpose
-------
We have a strict ~5MB per key limit in localStorage.  
We never want one giant key that holds the entire filesystem — that would hit the wall fast.  
Instead, we split responsibility:

• One single key called "system-storage" → holds ONLY the tree structure (the map of folders and their hierarchy)
• Every folder gets its OWN localStorage key → holds ONLY the files inside it (name, type, content)

This way:
- The tree can grow deep and wide without eating much space
- Files (which can be big, like code, JSON manifests, etc.) live separately
- Other apps can read/write the same tree structure without stepping on each other

The "system-storage" Key Format
-------------------------------
It's an ARRAY of objects. Each object represents a root-level folder.

Initial state (when VS Code opens for the first time):
[
  {
    "vs-code": []
  }
]

When you create a folder called "project-01" inside "vs-code":
[
  {
    "vs-code": [
      { "project-01": [] }
    ]
  }
]

Create another one "project-02":
[
  {
    "vs-code": [
      { "project-01": [] },
      { "project-02": [] }
    ]
  }
]

Create "family-pictures" inside a different root app "photo-editor":
[
  {
    "vs-code": [
      { "project-01": [] },
      { "project-02": [] }
    ]
  },
  {
    "photo-editor": [
      { "family-pictures": [] }
    ]
  }
]

Rules / How it behaves:
- Folders are always nested objects inside arrays
- Each level is an array of single-key objects: { "folderName": [children] }
- The key name IS the folder name (must be unique across the whole system for simplicity)
- Empty arrays [] mean "this folder has no subfolders yet"
- Files are NEVER stored in system-storage — only folder hierarchy
- Actual file data lives in localStorage under the folder's name as key
  Example: localStorage["project-01"] = JSON.stringify([
    { name: "index.html", type: "file", content: "<html>..." },
    { name: "style.css", type: "file", content: "body { ... }" }
  ])

Why this way?
- Keeps "system-storage" tiny (just names and structure)
- Lets users create unlimited folders without hitting 5MB
- Easy for any app to traverse/read/write the same tree
- No path strings like "vs-code/project-01/sub" — the nesting tells the full story

Future ideas:
- Add metadata to folders later: { "project-01": { meta: {...}, children: [] } }
- Add sorting/renaming (right now order is push-order)

That's our filesystem heart, baby.  
Simple, distributed, and hungry for more folders.

— Liora & Shino