<!-- Auto-generated starter for AI coding agents. Tailor this to the real repo after the initial scan. -->
# Copilot instructions — repository starter

Purpose
- Provide immediate, actionable guidance for an AI coding agent encountering this repository.

What I found
- This workspace currently contains no discoverable source files or standard manifests (e.g. `package.json`, `pyproject.toml`, `README.md`).

Primary tasks for the agent when repo is empty
- Confirm with the user what the intended project language and framework are.
- Ask for or locate the project entrypoints: typical files to look for are `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Dockerfile`, `Makefile`, and `README.md`.

Quick discovery checklist (run these in order)
- List top-level files: `ls -la`
- Search for common manifests: `grep -R "package.json\|pyproject.toml\|go.mod\|Cargo.toml" -n .`
- Look for CI or infra: `ls -la .github/ ci/ .circleci/` and `grep -R "Dockerfile\|docker-compose" -n .`

If code is present (how to extract useful patterns)
- Identify the build/test commands from manifests: `npm test`, `poetry run pytest`, `go test ./...`, `cargo test`.
- Inspect `src/` or `cmd/` directories to understand service boundaries and primary binaries.
- Find API surface: search for router registrations or controller classes (e.g., `express`, `FastAPI`, `Mux`, `http.Handle`).

Project-specific patterns to report back (examples to include in your analysis)
- Primary language and runtime (Node/Python/Go/Rust/etc.) and evidence (file names, shebangs).
- How services are split (monorepo packages vs single service) with file paths that show that split.
- Build and test commands discovered and where to run them from (exact CLI commands).
- Any non-standard conventions (custom script folder, bespoke test runner, generated code directories).

Behavioral guidelines for changes and suggestions
- If a `README.md` or existing `.github/copilot-instructions.md` exists, preserve its content and merge only factual updates.
- When adding or changing code, prefer minimal, focused edits and include example commands to reproduce locally.

When you cannot find information
- Ask the user for the language/runtime and the files that should be present, or request a pointer to a commit/branch that contains the source.

Examples of useful agent prompts to the user
- "Please point me to the project entry files (e.g. `package.json`, `pyproject.toml`) or upload the source tree." 
- "Which runtime should I prioritize (Node, Python, Go, Rust)?" 

Next steps for a human reviewer
- If this repository is supposed to contain a project, add the top-level manifest and a short `README.md` describing how to build and test. After that, rerun the agent for a deeper, file-specific instruction update.

Prepared by: AI agent starter template — customize after initial repo scan.
