import { Logger } from "@aws-lambda-powertools/logger";
import type { AttributeValue } from "aws-lambda";
import { Business, DeliveryStatus, MedicineOrder, MedicineOrderStatus, Patient } from "../../helpers/types/schema";
import { createDeliveryStatusHistory } from "../helpers/create-delivery-status-history";
import { deliveryPickedUpPatientEmailNotifier } from "../helpers/delivery-picked-up-patient-email-notifier";
import { deliveryPickedUpPharmacyEmailNotifier } from "../helpers/delivery-picked-up-pharmacy-email-notifier";

interface TriggerInput {
  deliveryImage: { [key: string]: AttributeValue; };
  dbClient: any;
  logger: Logger;
}

export const postDeliveryPickedUpByPatient = async ({ deliveryImage, dbClient }: TriggerInput) => {
  const orderId = deliveryImage?.orderId?.S;
  const patientId = deliveryImage?.patientId?.S;
  const pharmacyId = deliveryImage?.pharmacyId?.S;
  const deliveredAt = deliveryImage?.deliveredAt?.S;

  if (!orderId || !patientId || !pharmacyId || !deliveredAt) {
    throw new Error("Missing required order fields");
  }

  const { data: orderData, errors: orderErrors } = await dbClient.models.medicineOrder.get({ id: orderId });

  if (orderErrors || !orderData) {
    throw new Error(`Failed to fetch order: ${JSON.stringify(orderErrors)}`);
  }
  const order = orderData as unknown as MedicineOrder

  const { data: patientData, errors: patientErrors } = await dbClient.models.patient.get({ userId: patientId });

  if (patientErrors || !patientData) {
    throw new Error(`Failed to fetch patient: ${JSON.stringify(patientErrors)}`);
  }
  const patient = patientData as unknown as Patient;

  const { data: pharmacyData, errors: pharmacyErrors } = await dbClient.models.business.get({ id: pharmacyId });

  if (pharmacyErrors || !pharmacyData) {
    throw new Error(`Failed to fetch pharmacy: ${JSON.stringify(pharmacyErrors)}`);
  }
  const pharmacy = pharmacyData as unknown as Business;

  await createDeliveryStatusHistory({
    client: dbClient,
    patientId: patientId,
    deliveryId: orderId,
    status: DeliveryStatus.PICKED_UP_BY_PATIENT
  })

  const orderDeepLink = `curati://life.curati.www/(app)/profile/orders/${orderId}`;
  const ratingDeepLink = `curati://life.curati.www/(app)/pharmacies/${pharmacyId}`;

  if (patient.email) {
    await deliveryPickedUpPatientEmailNotifier({
      patientName: patient.name,
      patientEmail: patient.email,
      orderNumber: order.orderNumber,
      pharmacyName: pharmacy.name,
      pickupTimestamp: deliveredAt,
      ratingDeepLink,
      orderDeepLink
    })
  }

  await deliveryPickedUpPharmacyEmailNotifier({
    pharmacyName: pharmacy.name,
    pharmacyEmail: pharmacy.email,
    patientName: patient.name,
    orderNumber: order.orderNumber,
    pickupTimestamp: deliveredAt
  })

  const { errors: orderUpdateErrors } = await dbClient.models.medicineOrder.update({
    id: orderId,
    status: MedicineOrderStatus.COMPLETED
  });

  if (orderUpdateErrors) {
    throw new Error(`Failed to update order: ${JSON.stringify(orderUpdateErrors)}`);
  }
};