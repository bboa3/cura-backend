import { Dayjs } from "dayjs";
import { DriverPerformanceSummary, SalesSummaryTimeGranularity } from "../../../functions/helpers/types/schema";

interface TriggerInput {
  driverId: string;
  businessId: string;
  timeGranularity: SalesSummaryTimeGranularity;
  previousPeriodStart: Dayjs;
  previousPeriodEnd: Dayjs;
  dbClient: any;
}

export const fetchPreviousSummaries = async ({ driverId, businessId, timeGranularity, previousPeriodStart, previousPeriodEnd, dbClient }: TriggerInput): Promise<DriverPerformanceSummary | null> => {
  const { data, errors } = await dbClient.models.driverPerformanceSummary.get({
    driverId: { eq: driverId },
    businessId: { eq: businessId },
    timeGranularity: { eq: timeGranularity },
    periodStart: { eq: previousPeriodStart.toISOString() },
    periodEnd: { eq: previousPeriodEnd.toISOString() }
  });
  if (errors) throw new Error(`Previous summary fetch error: ${JSON.stringify(errors)}`);

  return data as DriverPerformanceSummary;
};