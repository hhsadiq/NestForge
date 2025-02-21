# Artillery Load Testing

## Table of Contents <!-- omit in toc -->

- [Artillery Load Testing](#artillery-load-testing)
  - [Installation](#installation)
  - [Setup](#setup)
  - [Module Specific Files](#module-specific-files)
  - [How to Run the File](#how-to-run-the-files)
  - [How to Increase the Load](#how-to-increase-the-load)

---

### Installation

To get started with Artillery, you need to install it using npm:

```bash
npm install -g artillery@latest
```

To verify the installation you need to run:

```bash
npx artillery dino
```

### Setup

Each module has its own load testing setup in the `load-test` directory. Inside each module folder, you will find:

- A `.yml` file containing the load test scenarios.
- An `.md` file containing the test report and performance metrics.

Example structure:

```plaintext
└── 📁load-test
    └── 📁articles
        └── articles-load-test.yml
        └── articles-load-test-report.md
    └── 📁users
        └── users-load-test.yml
        └── users-load-test-report.md
```

---

### Module Specific Files

#### Articles Module

- **Load Test File**: `load-test/articles/articles-load-test.yml`
- **Report**: `load-test/articles/articles-load-test-report.md`

#### Users Module

- **Load Test File**: `load-test/users/users-load-test.yml`
- **Report**: `load-test/users/users-load-test-report.md`

---

### How to Run the Files

Navigate to the directory of the module you want to test and run the corresponding `.yml` file.

For example:

1. Navigate to the **Users Module** folder:

   ```bash
   cd load-test/users
   ```

   Run the load test:

   ```bash
   artillery run users-load-test.yml
   ```

2. Navigate to the **Articles Module** folder:
   ```bash
   cd load-test/articles
   ```
   Run the load test:
   ```bash
   artillery run articles-load-test.yml
   ```

---

### How to Increase the Load

To scale the load, modify the `phases` section in the respective `.yml` files.

Key attributes to adjust:

- **duration**: Specifies how long the load test should run (in seconds).
- **arrivalCount**: Defines the total number of virtual users during the test.

Example:

```yaml
phases:
  - duration: 60
    arrivalCount: 150
    name: 'Load Test for Articles Module'
```

Increasing the `arrivalCount` and/or `duration` will amplify the load on the APIs. Ensure your system can handle the increased load before making large changes.

---

Previous: [Tests](tests.md)

Next: [Benchmarking](benchmarking.md)

```

```
