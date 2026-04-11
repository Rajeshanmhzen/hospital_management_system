import Queue from "bull";
import { TenantOnboardingInput } from "./tenantOnboarding.service";

export interface TenantProvisionPayload {
  tenantData: TenantOnboardingInput;
}

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const queueName = "tenant-provisioning";

export const tenantProvisionQueue = new Queue<TenantProvisionPayload>(queueName, redisUrl);

export class BackgroundJobService {
  async enqueueTenantProvisioning(tenantData: TenantOnboardingInput) {
    const job = await tenantProvisionQueue.add(
      { tenantData },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
        removeOnComplete: false,
        removeOnFail: false,
      }
    );

    return {
      jobId: String(job.id),
      status: "PENDING",
    };
  }

  async getJob(jobId: string) {
    const job = await tenantProvisionQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    return {
      id: String(job.id),
      name: queueName,
      state,
      progress: job.progress(),
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason || null,
      createdAt: job.timestamp ? new Date(job.timestamp).toISOString() : null,
      processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      result: job.returnvalue || null,
    };
  }
}
