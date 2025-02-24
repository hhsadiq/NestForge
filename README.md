# Medium backend clone

Implementing the [Realworld Medium Clone Specifications](https://realworld-docs.netlify.app/docs/implementation-creation/features) using TypeORM/Postgres and Hexagonal Architecture.

## Documentation <!-- omit in toc -->

[Full documentation here](/docs/readme.md)

## Roadmap

1. **Add Clap Feature for Articles**

   - **Database**: Add a `clap` table with the following columns: `id`, `article_id` (foreign key), `user_id` (foreign key), and `counter`, with a composite primary key on `article_id` and `user_id`.
   - **API to Clap an Article**: Create an API endpoint that allows users to clap for an article. Each clap will increment the counter associated with the user and article.
   - **Get Articles API Update**: Modify the existing "get articles" API to include the total clap count for each article, aggregating claps from all users.

## Features

- [x] This project is using [TypeORM](https://www.npmjs.com/package/typeorm) along with [PostgreSQL](https://www.postgresql.org/).
- [x] Seeding.
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer)).
- [x] Internationalization/Translations (I18N) ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [x] File uploads. Support local and Amazon S3 drivers.
- [x] Swagger.
- [x] Support E2E and unit tests.
- [x] Load Testing with Artillery:
  - Performance Benchmarking: Added load testing base structure and scenarios for critical endpoints (articles, user).
- [x] Docker.
- [x] CI (Github Actions).
- [x] Absolute Path in Imports: Enable absolute paths for module imports, improving project structure and readability by avoiding deep relative paths.
- [x] Hygen Scripting for Resource Management:
  - Template Automation: Use Hygen templates to automate repetitive code generation tasks, improving developer productivity and ensuring consistency across the project.
  - Resource Generation: Quickly generate a resource, including unit test case structure and files, to maintain a consistent codebase.
  - Versioning of Resources: Implement version control for resources, ensuring backward compatibility and smooth upgrades.
  - Property Management: Add or modify properties for specific versions of a resource, making updates seamless and non-disruptive.
  - Raw Query Management: Integrate raw queries into the specific version of a resource to handle complex database queries effectively.
- [x] Biometric Structure:
  - Challenge-Based Authentication: Implements a secure, time-bound challenge system to validate biometric data, preventing replay attacks.
  - Server-Side Validation: Cryptographic signing and verification of biometric challenges to ensure data integrity.
- [x] Article Module: Full CRUD functionality for article creation, with support for:
  - Commenting: Users can comment on articles.
  - Favorite/Unfavorite: Users can mark articles as favorites or remove them.
  - Feed Functionality: Display articles on the feed that are favorited by the logged-in user.
  - GenAI Integration: Integrated GenAI for automatic article title creation.
- [x] User Module: Complete CRUD functionality including:
  - Follow/Unfollow APIs: Allow users to follow and unfollow other users.
  - Social Logins: Integration with Apple, Facebook, Google, and Twitter for user authentication.
