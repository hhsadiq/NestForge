import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  public readonly isCronJobsEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isCronJobsEnabled = this.configService.get<boolean>(
      'app.enableCronJobs',
      {
        infer: true,
      },
    );
  }

  // Add your cron jobs here
}
