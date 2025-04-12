import { Logger } from "@aws-lambda-powertools/logger";
import type { AttributeValue } from "aws-lambda";
import { BusinessService, Contract, ContractStatus, InvoiceStatus, Patient } from "../../../helpers/types/schema";
import { paidContractInvoicePatientEmailNotifier } from "../../helpers/paid-contract-invoice-patient-email-notifier";

interface TriggerInput {
  invoiceImage: { [key: string]: AttributeValue; };
  dbClient: any;
  logger: Logger;
}

export const postInvoicePaymentContractHandler = async ({ invoiceImage, dbClient }: TriggerInput) => {
  const invoiceNumber = invoiceImage?.invoiceNumber?.S;
  const invoiceCreatedAt = invoiceImage?.createdAt?.S;
  const invoiceDueDate = invoiceImage?.dueDate?.S;
  const invoiceSubTotal = invoiceImage?.subTotal?.N;
  const invoiceDiscount = invoiceImage?.discount?.N;
  const invoiceTotalTax = invoiceImage?.taxes?.N;
  const invoiceTotalAmount = invoiceImage?.totalAmount?.N;
  const invoiceDocumentUrl = invoiceImage?.documentUrl?.S;
  const invoiceStatus = invoiceImage?.status?.S as InvoiceStatus;
  const invoiceSourceId = invoiceImage?.invoiceSourceId?.S;
  const patientId = invoiceImage?.patientId?.S;

  if (!invoiceNumber || !invoiceSourceId || !invoiceStatus || !patientId || !invoiceCreatedAt || !invoiceDueDate || !invoiceSubTotal || !invoiceDiscount || !invoiceTotalTax || !invoiceTotalAmount) {
    throw new Error("Missing required invoice fields");
  }

  const { errors: contractUpdateErrors } = await dbClient.models.contract.update({
    id: invoiceSourceId,
    status: ContractStatus.ACTIVE
  })

  if (contractUpdateErrors) {
    throw new Error(`Failed to update contract: ${JSON.stringify(contractUpdateErrors)}`);
  }

  const { data: patientData, errors: patientErrors } = await dbClient.models.patient.get({ userId: patientId });

  if (patientErrors || !patientData) {
    throw new Error(`Failed to fetch patient: ${JSON.stringify(patientErrors)}`);
  }
  const patient = patientData as unknown as Patient

  const { data: contractData, errors: contractErrors } = await dbClient.models.contract.get({ id: invoiceSourceId });

  if (contractErrors || !contractData) {
    throw new Error(`Failed to fetch contract: ${JSON.stringify(contractErrors)}`);
  }
  const contract = contractData as unknown as Contract

  const { data: serviceData, errors: serviceErrors } = await dbClient.models.businessService.get({ id: contract.businessServiceId });

  if (serviceErrors || !serviceData) {
    throw new Error(`Failed to fetch business service: ${JSON.stringify(serviceErrors)}`);
  }
  const service = serviceData as unknown as BusinessService;

  if (patient.email) {
    await paidContractInvoicePatientEmailNotifier({
      patientName: patient.name,
      patientEmail: patient.email,
      contractNumber: contract.contractNumber,
      invoiceNumber,
      invoiceTotalAmount: Number(invoiceTotalAmount),
      invoiceDocumentUrl,
      professionalName: service.professionalName,
      serviceName: service.serviceName
    });
  }
};