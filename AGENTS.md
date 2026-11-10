# TaskPulse Workspace Rules

Follow the Ponytail lean-code discipline on every change inside this repository:

1. Check if the code needs to exist, then reuse `shared/` models/helpers, standard library APIs, or existing components before creating new abstractions.
2. Eliminate pass-through wrappers and duplicate conditional blocks; unify variants with data tables (`shared/plans.ts`, etc.).
3. Never strip security, Firebase Auth verification, Firestore org isolation, RBAC, or plan quota checks for brevity.
4. Preserve existing UI aesthetics (warm paper Light Mode `#F4F2ED`/`#FAF8F4`/`#DDD8CE`/`#1E222D` + Dark Mode `#0B0F19`/`#151C2C`) and zero-emoji output.
