import { tenantProvisionQueue } from "../services/backgroundJob.service";
import { TenantOnboardingService } from "../services/tenantOnboarding.service";

let isWorkerInitialized = false;

export const initializeTenantProvisionWorker = () => {
  if (isWorkerInitialized) return;
  isWorkerInitialized = true;

  const onboardingService = new TenantOnboardingService();

  tenantProvisionQueue.process(2, async (job) => {
    await job.progress({ percent: 3, stage: "Job accepted by worker" });

    const tenant = await onboardingService.onboardTenant(job.data.tenantData, async (progress) => {
      await job.progress(progress);
    });

    return {
      tenantId: tenant.id,
      tenantName: tenant.name,
      subdomain: tenant.subdomain,
    };
  });

  tenantProvisionQueue.on("failed", (job, err) => {
    console.error(`Tenant provisioning job ${job?.id} failed:`, err.message);
  });
};

