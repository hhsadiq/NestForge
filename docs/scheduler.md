# Scheduler Module

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
  - [Key Features](#key-features)
- [Configuration](#configuration)
- [Usage](#usage)
- [References](#references)

## Overview

The Scheduler Module provides centralized management for scheduled tasks (cron jobs) with flag-based control to enable/disable cron jobs across different environments.

### Key Features

- **Flag Control**: Environment-based enable/disable functionality
- **Centralized Management**: Single service for all scheduled tasks
- **Configuration Driven**: Uses NestJS ConfigService for settings

## Configuration

Add to your `.env` file:

```bash
# Enable/disable cron jobs (default: false)
ENABLE_CRON_JOBS=true
```

## Usage

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SchedulerService } from '@src/scheduler/scheduler.service';

@Injectable()
export class MyService {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    if (!this.schedulerService.isCronJobsEnabled) {
      return;
    }

    // Your cron job logic here
    console.log('Executing scheduled task...');
  }
}
```

## References

- [NestJS Schedule Documentation](https://docs.nestjs.com/techniques/task-scheduling)
- [Cron Expression Guide](https://crontab.guru/)
- [Architecture Guide](architecture.md)

---

Previous: [Load Testing](artillery.md)

Next: [Benchmarking](benchmarking.md)
