import { Logger } from "@aws-lambda-powertools/logger";
import type { AttributeValue } from "aws-lambda";
import { BusinessService, Contract, InvoiceStatus, Patient, PaymentTermsType } from "../../../helpers/types/schema";
import { newContractInvoicePatientEmailNotifier } from "../../helpers/new-contract-invoice-patient-email-notifier";

interface TriggerInput {
  invoiceImage: { [key: string]: AttributeValue; };
  dbClient: any;
  logger: Logger;
}

export const postInvoiceCreationContractHandler = async ({ invoiceImage, dbClient }: TriggerInput) => {
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
  const paymentTerms = invoiceImage?.paymentTerms?.S as PaymentTermsType;

  if (!invoiceNumber || !invoiceSourceId || !paymentTerms || !invoiceStatus || !patientId || !invoiceCreatedAt || !invoiceDueDate || !invoiceSubTotal || !invoiceDiscount || !invoiceTotalTax || !invoiceTotalAmount) {
    throw new Error("Missing required invoice fields");
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
  const contract = contractData as unknown as Contract;

  const { data: serviceData, errors: serviceErrors } = await dbClient.models.businessService.get({ id: contract.businessServiceId });

  if (serviceErrors || !serviceData) {
    throw new Error(`Failed to fetch service: ${JSON.stringify(serviceErrors)}`);
  }
  const service = serviceData as unknown as BusinessService;

  const invoiceDeepLink = `curati://life.curati.www/(app)/profile/invoices/${invoiceNumber}`

  if (patient.email) {
    await newContractInvoicePatientEmailNotifier({
      patientName: patient.name,
      patientEmail: patient.email,
      contractNumber: contract.contractNumber,
      invoiceNumber,
      invoiceCreatedAt,
      invoiceDueDate,
      invoiceStatus,
      invoiceSubTotal: Number(invoiceSubTotal),
      invoiceDiscount: Number(invoiceDiscount),
      invoiceTotalTax: Number(invoiceTotalTax),
      invoiceTotalAmount: Number(invoiceTotalAmount),
      invoiceDocumentUrl,
      serviceName: service.serviceName,
      paymentTerms: paymentTerms,
      professionalName: service.professionalName,
      invoiceDeepLink: invoiceDeepLink
    });
  }
};