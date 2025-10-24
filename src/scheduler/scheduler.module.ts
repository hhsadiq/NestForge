import { Module } from '@nestjs/common';
import { ScheduleModule as Scheduler } from '@nestjs/schedule';

import { SchedulerService } from '@src/scheduler/scheduler.service';

@Module({
  imports: [Scheduler.forRoot()],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class ScheduleModule {}
