## Project Definition

```fileforge
target: "D:/WIP-Learn/file-forge-test"

# Root project folder
TestProject/
    app/
        testfolder/
        test-folder/
        [dynamic-route]/
            page.tsx
        (group)/
            page.tsx
        styles/
            main.css
    components/
        Button.tsx
    public/index.html
    infra/
        Dockerfile
        Dockerfile.backend
        Dockerfile.frontend
        compose.yaml
        compose.dev.yaml
    .gitignore
    .dockerignore
    README.md
    README.md

```

## To include one by one

```
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
