# FileForge Test Definition

A small test definition used to demonstrate and verify FileForge folder,
file, nesting, comments, special folder names, templates, and duplicate detection.

## Project Definition

```fileforge
# Root project folder
TestProject/
    # Nested folders
    app/
        testfolder/
        test-folder/

        # Special folder names
        [dynamic-route]/
            page.tsx

        (group)/
            page.tsx

        styles/
            main.css

    # Nested component
    components/
        Button.tsx

    # Single-line folder/file path
    public/index.html

    # Infrastructure files
    infra/
        Dockerfile
        Dockerfile.backend
        Dockerfile.frontend
        compose.yaml
        compose.dev.yaml

    # Root-level files inside TestProject
    .gitignore
    .dockerignore
    README.md

    # Intentional duplicate for validator testing
    README.md

# Root-level file
textfile.md

# Second root folder
TestOutputs/
    template-outputs/
        file-type.cs
        file-type.css
        file-type.env
        file-type.go
        file-type.html
        file-type.js
        file-type.json
        file-type.jsx
        file-type.md
        file-type.ps1
        file-type.py
        file-type.rs
        file-type.scss
        file-type.sh
        file-type.sql
        file-type.ts
        file-type.tsx
        file-type.vue
        file-type.yaml
        file-type.yml
```

## Result

```text
TestProject/
├── app/                    ← nested folder
│   ├── testfolder/         ← empty folder
│   ├── test-folder/        ← similar folder name
│   ├── [dynamic-route]/    ← special folder
│   │   └── page.tsx
│   ├── (group)/            ← special folder
│   │   └── page.tsx
│   └── styles/             ← nested file
│       └── main.css
├── components/             ← nested file
│   └── Button.tsx
├── public/index.html       ← single-line path
├── infra/                  ← multiple templates
│   ├── Dockerfile
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── compose.dev.yaml
│   └── compose.yaml
├── .gitignore              ← special filename
├── README.md               ← duplicate test
└── README.md               ← duplicate test

textfile.md                 ← root-level file

TestOutputs/                ← second root folder
└── template-outputs/       ← template coverage
    ├── file-type.cs
    ├── file-type.css
    ├── file-type.env
    ├── file-type.go
    ├── file-type.html
    ├── file-type.js
    ├── file-type.json
    ├── file-type.jsx
    ├── file-type.md
    ├── file-type.ps1
    ├── file-type.py
    ├── file-type.rs
    ├── file-type.scss
    ├── file-type.sh
    ├── file-type.sql
    ├── file-type.ts
    ├── file-type.tsx
    ├── file-type.vue
    ├── file-type.yaml
    └── file-type.yml
```
