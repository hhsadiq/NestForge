# NestForge

NestForge is a complete automated boilerplate built with NestJS, TypeORM, and PostgreSQL, following Hexagonal Architecture.  
It provides out-of-the-box integrations for configuration, testing, CI/CD, and other essential backend features to help you kickstart projects quickly and efficiently.

## Documentation <!-- omit in toc -->

[Full documentation here](/docs/readme.md)

## Features

- [x] TypeORM with [PostgreSQL](https://www.postgresql.org/).
- [x] Seeding.
- [x] Example Database Views:
  - Includes a sample structure of DB views for better query abstraction and reporting.
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer)).
- [x] Internationalization/Translations (I18N) ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [x] File uploads with support for local and Amazon S3 drivers.
- [x] Swagger API documentation.
- [x] E2E and unit tests support.
- [x] Load Testing with Artillery for performance benchmarking.
- [x] Docker support.
- [x] CI/CD with GitHub Actions.
- [x] Absolute Path in Imports for cleaner project structure.
- [x] Hygen Scripting for Resource Management:
  - Template Automation: Automate repetitive code generation tasks.
  - Resource Generation: Generate resource files including test structures.
  - Versioning of Resources: Ensure backward compatibility and smooth upgrades.
  - Property Management: Add or modify properties for specific versions of a resource.
  - Raw Query Management: Handle complex database queries effectively.
- [x] Biometric Authentication Structure:
  - Challenge-Based Authentication with secure, time-bound challenge validation.
  - Server-Side Validation with cryptographic signing and verification.
