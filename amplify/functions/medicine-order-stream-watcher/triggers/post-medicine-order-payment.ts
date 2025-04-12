import { Logger } from "@aws-lambda-powertools/logger";
import type { AttributeValue } from "aws-lambda";
import { DeliveryStatus, Professional } from '../../helpers/types/schema';
import { newOrderPharmacyEmailNotifier } from '../helpers/new-order-pharmacy-email-notifier';
import { newOrderPharmacySMSNotifier } from '../helpers/new-order-pharmacy-sms-notifier';
import { updateStockInventories } from '../helpers/update-stock-inventories';

interface TriggerInput {
  medicineOrderImage: { [key: string]: AttributeValue; };
  dbClient: any;
  logger: Logger;
}

export const postMedicineOrderPayment = async ({ medicineOrderImage, dbClient }: TriggerInput) => {
  const orderId = medicineOrderImage?.id?.S;
  const orderNumber = medicineOrderImage?.orderNumber?.S;
  const pharmacyId = medicineOrderImage?.businessId?.S;
  const patientId = medicineOrderImage?.patientId?.S;

  if (!orderId || !orderNumber || !pharmacyId || !patientId) {
    throw new Error("Missing required order fields");
  }

  const { data: pharmacistsData, errors: pharmacistErrors } = await dbClient.models.professional.list({
    filter: { businessId: { eq: pharmacyId } }
  });

  if (pharmacistErrors || !pharmacistsData) {
    throw new Error(`Failed to fetch pharmacists: ${JSON.stringify(pharmacistErrors)}`);
  }
  const pharmacists = pharmacistsData as Professional[]

  await updateStockInventories({
    client: dbClient,
    orderId
  })

  await dbClient.models.delivery.update({
    orderId,
    status: DeliveryStatus.PHARMACY_PREPARING
  });

  const emails = pharmacists.map((p: Professional) => p.email).filter(Boolean);
  const phones = pharmacists.map((p) => `+258${p.phone.replace(/\D/g, '')}`).filter(Boolean);
  if (emails.length > 0) {
    await newOrderPharmacyEmailNotifier(
      emails,
      orderNumber
    );
  }

  if (phones.length > 0) {
    await Promise.all(phones.map((phone) => newOrderPharmacySMSNotifier(phone, orderNumber)));
  }
};