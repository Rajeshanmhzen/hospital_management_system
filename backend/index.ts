import app from "./src/app";
import { config } from "dotenv";
import { disconnectAllTenantClients } from "./src/config/tenant-prisma-manager";
import { initializeTenantProvisionWorker } from "./src/workers/tenantProvision.worker";
import { tenantProvisionQueue } from "./src/services/backgroundJob.service";
config();
const PORT = process.env.PORT || 3000;
initializeTenantProvisionWorker();

const server = app.listen(PORT, () => {
    console.log(`Server is running at port: http://localhost:${PORT}`);
});

const shutdown = async () => {
    await tenantProvisionQueue.close();
    await disconnectAllTenantClients();
    server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
