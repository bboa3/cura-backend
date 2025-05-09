import { defineFunction, secret } from "@aws-amplify/backend";

export const contractStreamWatcher = defineFunction({
  name: "contract-stream-watcher",
  resourceGroupName: "data",
  entry: "./handler.ts",
  timeoutSeconds: 60 * 2,
  environment: {
    SUPPORT_PHONE: "874444689",
    VERIFIED_SES_SENDER_EMAIL: "sales@curati.life",
    VERIFIED_SES_SUPPORT_EMAIL: "support@curati.life",
    SMS_API_KEY: secret('SMS_API_KEY'),
    SMS_SENDER_ID: secret('SMS_SENDER_ID')
  }
});