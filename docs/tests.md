# Tests

## Table of Contents <!-- omit in toc -->

- [Unit Tests](#unit-tests)
- [E2E Tests](#e2e-tests)
- [Tests in Docker](#tests-in-docker)
  - [For relational database](#for-relational-database)
  - [For document database](#for-document-database)
- [Load Tests](#load-tests)
  - [File Location and Naming Convention](#file-location-and-naming-convention)
  - [Prerequisites and Setup](#prerequisites-and-setup)

## Unit Tests

Unit tests are located at the same level as the file of the function being tested (e.g., a service file).

**File Naming Convention**: `<name>.spec.ts`

```bash
npm run test
```

## E2E Tests

E2E (End-to-End) test files are located in a module-specific subdirectory within the `test/` directory.

**File Location**: `test/<module>/`
**File Naming Convention**: `<name>.e2e-spec.ts`

```bash
npm run test:e2e
```

## Tests in Docker

These commands execute the E2E tests within a Dockerized environment. Therefore, the test files follow the same structure and naming conventions as described in the [E2E Tests](#e2e-tests) section.

### For relational database

```bash
npm run test:e2e:relational:docker
```

### For document database

```bash
npm run test:e2e:document:docker
```

---

## Load Tests

Load tests are designed to evaluate the performance and stability of the application under various levels of traffic.

### File Location and Naming Convention

Each module has its own dedicated load testing files, organized within the `load-test` directory:

- **Load Test Scenarios**: `load-test/<module>/<module>-load-test.yml`
- **Load Test Reports**: `load-test/<module>/<module>-load-test-report.md`

For example, for the `users` module:

- `load-test/users/users-load-test.yml`
- `load-test/users/users-load-test-report.md`

### Prerequisites and Setup

To set up and run load tests, you need to install Artillery and configure your test scenarios. For detailed instructions on installation, setup, and how to run load tests, please refer to the [Artillery Load Testing](artillery.md) documentation.

---

Previous: [File uploading](file-uploading.md)

Next: [Load Testing](artillery.md)
