# DuVay Component Tests

This folder owns framework-level component behavior tests. It follows Vuetify's package-level test structure: shared setup lives under `tests/setup`, and component-facing specs live under `tests/components`.

Run the suite from the repository root:

```bash
bun run test:components
```

The test runner is installed by the documentation workspace, but the specs and fixtures stay with the framework so component behavior is not hidden inside website-only tests.
