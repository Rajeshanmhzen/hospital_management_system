# Backend Pagination Implementation Guide

This guide explains how to implement reusable pagination in any new module (e.g., Doctors, Patients, Appointments) using existing utilities.

## Prerequisites
Ensure the following utilities exist:
- `backend/src/utils/pagination.util.ts`
- `backend/src/utils/apiResponse.util.ts`

---

## Step 1: Repository Layer
Add `skip` and `take` to your list method and create a count method.

**Example: `doctor.repository.ts`**
```typescript
async listDoctors(skip?: number, take?: number) {
    return await masterPrisma.doctor.findMany({
        skip,
        take,
        // ... include or where filters
    });
}

async countDoctors() {
    return await masterPrisma.doctor.count();
}
```

---

## Step 2: Service Layer
Use `getPaginationParams` to calculate skip/take and `getPaginationMeta` to format the metadata.

**Example: `doctor.service.ts`**
```typescript
import { getPaginationParams, getPaginationMeta } from "../utils/pagination.util";

async listDoctors(query: any) {
    // 1. Get standardized skip/take/page/limit
    const { skip, take, page, limit } = getPaginationParams(query);

    // 2. Fetch data and count from repository
    const data = await this.doctorRepo.listDoctors(skip, take);
    const totalCount = await this.doctorRepo.countDoctors();

    // 3. Return data with metadata
    return {
        data,
        meta: getPaginationMeta(totalCount, page, limit)
    };
}
```

---

## Step 3: Controller Layer
Pass `req.query` to the service and use `sendSuccess` to return the response.

**Example: `doctor.controller.ts`**
```typescript
import { sendSuccess } from "../utils/apiResponse.util";

listDoctors = async (req: Request, res: Response) => {
    try {
        const result = await this.doctorService.listDoctors(req.query);
        
        // sendSuccess(res, message, data, status, meta)
        return sendSuccess(res, "Doctors retrieved successfully", result.data, 200, result.meta);
    } catch (err: any) {
        // ... handle error
    }
};
```

---

## How to use from Frontend
The frontend should send `page` and `limit` in the URL:
`GET /api/doctors?page=2&limit=15`

The response will look like this:
```json
{
    "success": true,
    "message": "Doctors retrieved successfully",
    "data": [...],
    "meta": {
        "totalCount": 100,
        "totalPages": 7,
        "currentPage": 2,
        "limit": 15
    }
}
```
