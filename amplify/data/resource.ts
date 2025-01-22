import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { addOrUpdateSearchableRecord } from '../functions/add-or-update-searchable-record/resource';
import { addUserToGroup } from '../functions/add-user-to-group/resource';
import { adminCreateUser } from '../functions/admin-create-user/resource';
import { createStreamToken } from '../functions/create-stream-token/resource';
import { deleteSearchableRecord } from '../functions/delete-searchable-record/resource';

const ambulanceStatus = ['AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'OUT_OF_SERVICE'] as const;
const sleepQuality = ['POOR', 'AVERAGE', 'GOOD', 'EXCELLENT'] as const;
const physicalActivityLevel = ['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE'] as const;
const gender = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'] as const;

// const theme = ['LIGHT', 'DARK']  as const;
const deliveryStatus = ['PENDING', 'PHARMACY_CONFIRMED', 'PHARMACY_REJECTED', 'DRIVER_CONFIRMED', 'DISPATCHED', 'ONTHEWAY', 'DELIVERED', 'DELAYED', 'CANCELED', 'NOT_DELIVERED', 'PICKUP_CONFIRMED'] as const;
const deliveryType = ['PICKUP', 'DELIVERY'] as const;
const medicineOrderStatus = ['PENDING_PAYMENT', 'PENDING_CONFIRMATION', 'CONFIRMED', 'REJECTED', 'DISPATCHED', 'DELIVERED', 'CANCELED'] as const;

const notificationType = ['GENERAL', 'PERSONAL', 'PROMOTIONAL', 'UPDATE'] as const;
const targetAction = [
  'VIEW_PRESCRIPTION', 'SCHEDULE_APPOINTMENT', 'REFILL_MEDICATION', 'CONSULTATION_REMINDER', 'MEDICATION_REMINDER',
  'PROMOTIONAL_OFFERS', 'FEEDBACK_REQUEST', 'HEALTH_TIPS_AND_ARTICLES', 'UPDATE_PERSONAL_HEALTH_PROFILE', 'JOIN_HEALTH_PROGRAMS',
  'ORDER_TRACKING', 'UPDATE_INSURANCE_INFO', 'NEW_HEALTH_SERVICES', 'JOIN_COMMUNITY_EVENTS', 'REVIEW_LAB_RESULTS',
  'MANAGE_SUBSCRIPTIONS', 'SEASONAL_HEALTH_TIPS', 'VIEW_NEW_MESSAGE', 'CHAT_WITH_DOCTOR', 'CHAT_WITH_PHARMACIST',
  'RESPOND_TO_CHATBOT', 'DISCUSS_APPOINTMENT', 'CLARIFY_PRESCRIPTION', 'URGENT_NOTIFICATION'
] as const;
const priority = ['LOW', 'MEDIUM', 'HIGH'] as const;
const reminderType = ['MEDICATION', 'REFILL', 'APPOINTMENT'] as const;
const reminderStatus = ['PENDING', 'COMPLETED', 'SKIPPED'] as const;
const repeatType = ['NONE', 'DAILY', 'WEEKLY', 'CUSTOM'] as const;
const contractType = ['ONE_TIME', 'MONTHLY', 'SEMI_ANNUALLY', 'ANNUALLY'] as const;
const contractStatus = ['PENDING_PAYMENT', 'PENDING_CONFIRMATION', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'REJECTED', 'SUSPENDED'] as const;
const language = ['PORTUGUESE', 'ENGLISH', 'TSONGA', 'CHANGANA', 'MAKHUWA', 'SENA', 'NDAU'] as const;

const recurrenceType = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NONE'] as const;
const serviceFeasibility = ["LOW", "MEDIUM", "HIGH"] as const;

const cardBrand = ['MASTERCARD', 'VISA'] as const;
const mobileProviderName = ['M_PESA', 'E_MOLA', 'M_KESH'] as const;
const paymentTermsType = ['NET_1', 'NET_7', 'NET_30'] as const;
const paymentMethodType = ['CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_PAYMENT'] as const;
const invoiceStatus = ['PENDING', 'PAID', 'PARTIALLY_PAID', 'FAILED', 'OVERDUE'] as const;
const paymentTransactionStatus = ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'] as const;

const pricingCondition = [
  // Base Prices
  "STANDARD",
  "EMERGENCY",
  "COMPLEXITY",
  "FOLLOW_UP",
  "URGENT_CARE",

  // Additional Charges
  "ADDITIONAL_AFTER_HOURS",
  "ADDITIONAL_WEEKEND",
  "ADDITIONAL_SPECIAL_EQUIPMENT",

  // Discounts and Penalties
  "MONTHLY_DISCOUNTED",
  "SEMI_ANNUALLY_DISCOUNTED",
  "ANNUALLY_DISCOUNTED",
  "CANCELLATION"
] as const;
const addressType = ['HOME', 'WORK', 'PHARMACY', 'HOSPITAL', 'COURIER', 'SHIPPING', 'BILLING'] as const;
const consultationType = ['VIDEO', 'AUDIO', 'TEXT', 'IN_PERSON'] as const;
const outcome = ['NOT_COMPLETED', 'SUCCESSFUL', 'FOLLOW_UP_REQUIRED', 'REFERRAL_REQUIRED'] as const;
const prescriptionStatus = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPENSED', "PENDING_VALIDATION"] as const;
const prescriptionType = ['INPATIENT', 'OUTPATIENT'] as const;

const appointmentStatus = ['PENDING', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED'] as const;
const appointmentType = ['VIDEO', 'AUDIO', 'TEXT', 'IN_PERSON'] as const;

const licenseStatus = ['ACTIVE', 'SUSPENDED', 'EXPIRED'] as const;
const professionalStatus = ['ONLINE', 'OFFLINE', 'ON_BREAK', 'BUSY'] as const;
const businessType = ['PHARMACY', 'HOSPITAL', 'DELIVERY', 'LABORATORY'] as const;
const articleStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
const mediaTypes = ['IMAGE', 'VIDEO'] as const;
const categoryTypes = ['ARTICLE'] as const;
const medicationRecordType = ['MEDICATION', 'VACCINATION', 'OTHER'] as const;
const medicationRecordStatus = ['ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPENSED', "PENDING_VALIDATION"] as const;
const medicationFrequencyType = ['DAILY', 'WEEKLY', 'MONTHLY', 'AS_NEEDED'] as const;

const professionalType = ['DOCTOR', 'NURSE', 'PHARMACIST', 'DRIVER'] as const;
const professionalRole = ['MANAGER', 'ASSISTANT', 'STAFF', 'INTERN', "OWNER"] as const;
const userRoles = ['ADMIN', 'PROFESSIONAL', 'PATIENT'] as const;

const schema = a.schema({
  addUserToGroup: a
    .mutation()
    .arguments({
      authId: a.string().required(),
      groupName: a.string().required(),
    })
    .returns(a.customType({
      content: a.string()
    }))
    .handler(a.handler.function(addUserToGroup))
    .authorization((allow) => [allow.groups(['ADMIN', 'PROFESSIONAL'])]),
  adminCreateUser: a
    .mutation()
    .arguments({
      phone: a.string().required(),
      password: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['ADMIN', 'PROFESSIONAL'])])
    .handler(a.handler.function(adminCreateUser))
    .returns(a.customType({
      content: a.string()
    })),

  addOrUpdateSearchableRecord: a
    .mutation()
    .arguments({
      indexName: a.string().required(),
      objectID: a.string().required(),
      body: a.json().required(),
    })
    .authorization((allow) => [allow.groups(['ADMIN', 'PROFESSIONAL'])])
    .handler(a.handler.function(addOrUpdateSearchableRecord))
    .returns(a.customType({
      content: a.string()
    })),

  deleteSearchableRecord: a
    .mutation()
    .arguments({
      indexName: a.string().required(),
      objectID: a.string().required(),
    })
    .authorization((allow) => [allow.groups(['ADMIN', 'PROFESSIONAL'])])
    .handler(a.handler.function(deleteSearchableRecord))
    .returns(a.customType({
      content: a.string()
    })),

  createStreamToken: a
    .mutation()
    .arguments({
      userId: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(createStreamToken))
    .returns(a.customType({
      content: a.string()
    })),

  user: a.model({
    id: a.id().required(),
    authId: a.string().required(),
    role: a.enum(userRoles),
    email: a.string(),
    phone: a.string(),
    name: a.string(),
    expoPushTokens: a.string().required().array(),
    isDeleted: a.boolean().required().default(false),
    notifications: a.hasMany('notification', 'userId'),
    //view: a.hasMany('view', 'userId'),
    articles: a.hasMany('article', 'authorId'),
    articleLikes: a.hasMany('articleLike', 'userId'),
    businessLikes: a.hasMany('businessLike', 'userId'),
    medicineLikes: a.hasMany('medicineLike', 'userId'),
    address: a.hasMany('address', 'userId'),
    ratings: a.hasMany('rating', 'userId'),
    reminders: a.hasMany('reminder', 'userId'),
    professional: a.hasOne('professional', 'userId'),
    patient: a.hasOne('patient', 'userId'),
  }).authorization(allow => [
    allow.authenticated().to(['read']),
    allow.ownerDefinedIn('authId').to(['create', 'read', 'update']),
    allow.groups(['ADMIN']).to(['read', 'create', 'update']),
  ]).disableOperations(['subscriptions', 'delete']),

  patient: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    phone: a.string().required(),
    email: a.string(),
    name: a.string().required(),
    gender: a.enum(gender),
    preferredLanguage: a.enum(language),
    dateOfBirth: a.datetime(),
    lastLogin: a.datetime(),
    profilePicture: a.string(),
    nationalID: a.string(),
    contracts: a.hasMany('contract', 'patientId'),
    medicineOrders: a.hasMany('medicineOrder', 'patientId'),
    invoices: a.hasMany('invoice', 'patientId'),
    paymentMethods: a.hasMany('paymentMethod', 'patientId'),
    //  patientHealthStatus: a.hasOne('patientHealthStatus', 'patientId'),
    //  insurance: a.hasOne('insurance', 'patientId'),
    medications: a.hasMany('medicationRecord', 'patientId'),
    prescriptions: a.hasMany('prescription', 'patientId'),
    consultationRecords: a.hasMany('consultationRecord', 'patientId'),
    appointments: a.hasMany('appointment', 'patientId'),
    user: a.belongsTo('user', 'userId'),
    deliveries: a.hasMany('delivery', 'patientId'),
  }).authorization(allow => [
    allow.owner().to(['read', 'create', 'update']),
    allow.group('PROFESSIONAL').to(['read']),
    allow.group('ADMIN').to(['read', 'update']),
  ]).disableOperations(['subscriptions', 'delete']),

  // insurance: a.model({
  //   id: a.id().required(),
  //   patientId: a.id().required(),
  //   provider: a.string().required(),
  //   policyNumber: a.string().required(),
  //   groupNumber: a.string(),
  //   effectiveDate: a.date(),
  //   expirationDate: a.date(),
  //   memberID: a.string(),
  //   isVerified: a.boolean().default(false),
  //   patient: a.belongsTo('patient', 'patientId'),
  // }).authorization(allow => [
  //   allow.owner().to(['read', 'create', 'update']),
  //   allow.group('PROFESSIONAL').to(['read']),
  //   allow.group('ADMIN').to(['read', 'update']),
  // ]).disableOperations(['subscriptions']),

  // patientHealthStatus: a.model({
  //   id: a.id().required(),
  //   patientId: a.id().required(),
  //   caloriesBurned: a.integer(),
  //   weight: a.float(),
  //   cholesterolTotal: a.float(),
  //   cholesterolLDL: a.float(),
  //   cholesterolHDL: a.float(),
  //   bodyMassIndex: a.float(),
  //   bodyFatPercentage: a.float(),
  //   hydrationLevel: a.float(),
  //   sleepQuality: a.enum(sleepQuality),
  //   physicalActivityLevel: a.enum(physicalActivityLevel),
  //   variabilityMetrics: a.json(),
  //   socialActivityFeatures: a.string().array(),
  //   predictiveHealthScores: a.json(),
  //   engagementStrategies: a.string().array(),
  //   additionalMetrics: a.json(),
  //   medicationAllergies: a.string().array().required(),
  //   patient: a.belongsTo('patient', 'patientId'),
  //   heartRateRecords: a.hasMany('heartRateRecord', 'patientHealthStatusId'),
  //   bloodSugarRecords: a.hasMany('bloodSugarRecord', 'patientHealthStatusId'),
  // })
  //   .authorization(allow => [
  //     allow.owner().to(['read', 'create', 'update']),
  //     allow.group('PROFESSIONAL').to(['read', 'update']),
  //     allow.group('ADMIN').to(['read']),
  //   ]).disableOperations(['subscriptions']),

  // heartRateRecord: a.model({
  //   id: a.id().required(),
  //   patientHealthStatusId: a.id().required(),
  //   heartRate: a.integer().required(),
  //   timestamp: a.datetime().required(),
  //   patientHealthStatus: a.belongsTo('patientHealthStatus', 'patientHealthStatusId'),
  // }).authorization(allow => [
  //   allow.owner().to(['read', 'create', 'update']),
  //   allow.group('PROFESSIONAL').to(['read', 'update']),
  //   allow.group('ADMIN').to(['read']),
  // ]),

  // bloodSugarRecord: a.model({
  //   id: a.id().required(),
  //   patientHealthStatusId: a.id().required(),
  //   bloodSugarLevel: a.float().required(),
  //   timestamp: a.datetime().required(),
  //   patientHealthStatus: a.belongsTo('patientHealthStatus', 'patientHealthStatusId'),
  // }).authorization(allow => [
  //   allow.owner().to(['read', 'create', 'update']),
  //   allow.group('PROFESSIONAL').to(['read', 'update']),
  //   allow.group('ADMIN').to(['read']),
  // ]),

  prescription: a.model({
    id: a.id().required(),
    patientId: a.id().required(),
    prescriptionNumber: a.string().required(),
    status: a.enum(prescriptionStatus),
    type: a.enum(prescriptionType),
    prescriberId: a.id(),
    issuedAt: a.datetime().required(),
    expiryAt: a.datetime().required(),
    documentUrl: a.string(),
    purpose: a.string(),
    notes: a.string(),
    refillsAllowed: a.integer().required(),
    refillsRemaining: a.integer().required(),
    isRenewable: a.boolean().required().default(false),
    renewalAt: a.datetime(),
    patient: a.belongsTo('patient', 'patientId'),
    prescriber: a.belongsTo('professional', 'prescriberId'),
    items: a.hasMany('prescriptionItem', 'prescriptionId'),
    orders: a.hasMany('medicineOrder', 'prescriptionId'),
    medicationRecords: a.hasMany('medicationRecord', 'prescriptionId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.group('PROFESSIONAL').to(['read', 'update', 'create']),
      allow.group('ADMIN').to(['read', 'update']),
    ])
    .disableOperations(['subscriptions', 'delete']),

  prescriptionItem: a.model({
    id: a.id().required(),
    medicineId: a.id().required(),
    prescriptionId: a.id().required(),
    name: a.string().required(),
    dosage: a.string().required(),
    frequency: a.customType({
      type: a.enum(medicationFrequencyType),
      daysOfWeek: a.integer().array(),
      daysOfMonth: a.integer().array(),
      specificTimes: a.string().array(),
    }),
    quantity: a.integer().required(),
    notes: a.string(),
    medicine: a.belongsTo('medicine', 'medicineId'),
    prescription: a.belongsTo('prescription', 'prescriptionId'),
    medicationRecords: a.hasMany('medicationRecord', 'prescriptionItemId'),
  })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update']),
      allow.group('PROFESSIONAL').to(['read', 'update', 'create']),
      allow.group('ADMIN').to(['read', 'update']),
    ])
    .disableOperations(['subscriptions', 'delete']),

  medicationRecord: a.model({
    id: a.id().required(),
    prescriptionId: a.id().required(),
    prescriptionItemId: a.id().required(),
    pharmacyInventoryId: a.id().required(),
    patientId: a.id().required(),
    administeredById: a.id(),
    recordType: a.enum(medicationRecordType),
    status: a.enum(medicationRecordStatus),
    name: a.string().required(),
    dosage: a.string(),
    frequency: a.customType({
      type: a.enum(medicationFrequencyType),
      daysOfWeek: a.integer().array(),
      daysOfMonth: a.integer().array(),
      specificTimes: a.string().array(),
    }),
    purpose: a.string(),
    notes: a.string(),
    quantity: a.integer().required(),
    startDate: a.datetime().required(),
    nextRefillDate: a.datetime(),
    reminderEnabled: a.boolean().required(),
    nextDoseDate: a.datetime(), // For vaccinations
    nextDoseNumber: a.integer(), // For vaccinations
    administeredBy: a.belongsTo('professional', 'administeredById'),
    patient: a.belongsTo('patient', 'patientId'),
    prescription: a.belongsTo('prescription', 'prescriptionId'),
    prescriptionItem: a.belongsTo('prescriptionItem', 'prescriptionItemId'),
    pharmacyInventory: a.belongsTo('pharmacyInventory', 'pharmacyInventoryId'),
    reminders: a.hasMany('reminder', 'medicationRecordId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.group('PROFESSIONAL').to(['read', 'update', 'create']),
      allow.group('ADMIN').to(['read']),
    ]).disableOperations(['subscriptions', 'delete']),

  medicineOrder: a.model({
    id: a.id().required(),
    orderNumber: a.string().required(),
    patientId: a.id().required(),
    businessId: a.id().required(),
    prescriptionId: a.id(),
    isForPatient: a.boolean().required().default(true),
    status: a.enum(medicineOrderStatus),
    patient: a.belongsTo('patient', 'patientId'),
    prescription: a.belongsTo('prescription', 'prescriptionId'),
    items: a.hasMany('medicineOrderItem', 'orderId'),
    delivery: a.hasOne('delivery', 'orderId'),
    pharmacy: a.belongsTo('business', 'businessId'),
    invoices: a.hasMany('invoice', 'medicineOrderId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read']),
    ]).disableOperations(['subscriptions', 'delete']),

  medicineOrderItem: a.model({
    id: a.id().required(),
    orderId: a.id().required(),
    pharmacyInventoryId: a.id().required(),
    description: a.string().required(),
    quantity: a.integer().required(),
    unitPrice: a.float().required(),
    order: a.belongsTo('medicineOrder', 'orderId'),
    pharmacyInventory: a.belongsTo('pharmacyInventory', 'pharmacyInventoryId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read']),
    ]).disableOperations(['subscriptions', 'delete']),

  contract: a.model({
    id: a.id().required(),
    contractNumber: a.string().required(),
    patientId: a.string().required(),
    businessId: a.string().required(),
    businessServiceId: a.string().required(),
    contractType: a.enum(contractType),
    status: a.enum(contractStatus),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    appliedPricingConditions: a.string().required().array().required(),
    purpose: a.string(),
    notes: a.string(),
    patientSignature: a.string(),
    businessSignature: a.string(),
    patient: a.belongsTo('patient', 'patientId'),
    business: a.belongsTo('business', 'businessId'),
    businessService: a.belongsTo('businessService', 'businessServiceId'),
    appointments: a.hasMany('appointment', 'contractId'),
    invoices: a.hasMany('invoice', 'contractId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read']),
    ]).disableOperations(['subscriptions', 'delete']),

  service: a.model({
    id: a.id().required(),
    name: a.string().required(),
    description: a.string().required(),
    keywords: a.string().required().array().required(),
    professional: a.string(),
    allowedProfessionalType: a.enum(businessType),
    requiredEquipment: a.string(),
    treatmentTechniques: a.string(),
    conditionsTreated: a.string().array().required(),
    image: a.string().required(),
    serviceFeasibility: a.enum(serviceFeasibility),
    baseSessionDurationMinutes: a.integer(),
    isDeleted: a.boolean().default(false),
    businessService: a.hasMany('businessService', 'serviceId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('PROFESSIONAL').to(['read']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  businessService: a.model({
    id: a.id().required(),
    businessId: a.id().required(),
    professionalId: a.id().required(),
    professionalType: a.enum(businessType),
    serviceId: a.id().required(),
    sessionDurationMinutes: a.integer().required(),
    businessLatitude: a.float().required(),
    businessLongitude: a.float().required(),
    isDeleted: a.boolean().default(false),
    ratings: a.hasMany('rating', 'businessServiceId'),
    pricing: a.hasMany('businessServicePricing', 'businessServiceId'),
    service: a.belongsTo('service', 'serviceId'),
    business: a.belongsTo('business', 'businessId'),
    contracts: a.hasMany('contract', 'businessServiceId'),
    professional: a.belongsTo('professional', 'professionalId'),
    consultationRecords: a.hasMany('consultationRecord', 'businessServiceId'),
    appointments: a.hasMany('appointment', 'businessServiceId')
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('PROFESSIONAL').to(['read', 'update', 'create']),
      allow.group('ADMIN').to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  businessServicePricing: a.model({
    id: a.id().required(),
    businessServiceId: a.id().required(),
    description: a.string().required(),
    fee: a.float().required(),
    condition: a.enum(pricingCondition),
    businessService: a.belongsTo('businessService', 'businessServiceId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('PROFESSIONAL').to(['read', 'update', 'create']),
      allow.group('ADMIN').to(['read', 'update']),
    ]).disableOperations(['subscriptions']),

  appointment: a.model({
    id: a.id().required(),
    contractId: a.id().required(),
    patientId: a.id().required(),
    professionalId: a.id().required(),
    businessServiceId: a.id().required(),
    appointmentDateTime: a.datetime().required(),
    duration: a.integer().required(),
    status: a.enum(appointmentStatus),
    type: a.enum(appointmentType),
    reason: a.string(),
    notes: a.string(),
    patientRescheduledCount: a.integer().default(0),
    professionalRescheduledCount: a.integer().default(0),
    isConfirmed: a.boolean().default(false),
    confirmationDateTime: a.datetime(),
    cancellationReason: a.string(),
    contract: a.belongsTo('contract', 'contractId'),
    patient: a.belongsTo('patient', 'patientId'),
    professional: a.belongsTo('professional', 'professionalId'),
    businessService: a.belongsTo('businessService', 'businessServiceId'),
    consultationRecord: a.hasOne('consultationRecord', 'appointmentId'),
    reminders: a.hasMany('reminder', 'appointmentId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.group('PROFESSIONAL').to(['read', 'create', 'update']),
      allow.group('ADMIN').to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  consultationRecord: a.model({
    id: a.id().required(),
    patientId: a.id().required(),
    businessId: a.id().required(),
    professionalId: a.id().required(),
    businessServiceId: a.id().required(),
    appointmentId: a.id().required(),
    type: a.enum(consultationType),
    purpose: a.string(),
    notes: a.string(),
    outcome: a.enum(outcome),
    patient: a.belongsTo('patient', 'patientId'),
    business: a.belongsTo('business', 'businessId'),
    professional: a.belongsTo('professional', 'professionalId'),
    businessService: a.belongsTo('businessService', 'businessServiceId'),
    appointment: a.belongsTo('appointment', 'appointmentId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.group('PROFESSIONAL').to(['read', 'create', 'update']),
      allow.group('ADMIN').to(['read']),
    ]).disableOperations(['subscriptions', 'delete']),

  category: a.model({
    id: a.id().required(),
    type: a.enum(categoryTypes),
    name: a.string().required(),
    slug: a.string().required(),
    description: a.string(),
    isDeleted: a.boolean().required().default(false),
    subCategories: a.string().required().array(),
    articles: a.hasMany('articleCategory', 'categoryId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  articleCategory: a.model({
    id: a.id().required(),
    articleId: a.id().required(),
    categoryId: a.id().required(),
    article: a.belongsTo('article', 'articleId'),
    category: a.belongsTo('category', 'categoryId'),
  }).identifier(['articleId', 'categoryId']).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'delete']),
  ]).disableOperations(['update', 'subscriptions']),

  article: a.model({
    id: a.id().required(),
    title: a.string().required(),
    slug: a.string().required(),
    excerpt: a.string(),
    authorId: a.id().required(),
    status: a.enum(articleStatus),
    tags: a.string().required().array().required(),
    publishedAt: a.datetime().required(),
    viewCount: a.integer().required().default(0),
    likeCount: a.integer().required().default(0),
    isDeleted: a.boolean().default(false),
    featuredImage: a.hasOne('media', 'articleId'),
    likes: a.hasMany('articleLike', 'articleId'),
    //views: a.hasMany('view', 'articleId'),
    author: a.belongsTo('user', 'authorId'),
    contentBlocks: a.hasMany('contentBlock', 'articleId'),
    categories: a.hasMany('articleCategory', 'articleId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  contentBlock: a.model({
    id: a.id().required(),
    articleId: a.id().required(),
    title: a.string(),
    content: a.string().required(),
    order: a.integer().required(),
    article: a.belongsTo('article', 'articleId'),
    medias: a.hasMany('media', 'contentBlockId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  media: a.model({
    id: a.id().required(),
    url: a.string().required(),
    thumbnailUrl: a.string(),
    type: a.enum(mediaTypes),
    fileSize: a.integer(),
    mimeType: a.string(),
    articleId: a.id(),
    contentBlockId: a.id(),
    article: a.belongsTo('article', 'articleId'),
    contentBlock: a.belongsTo('contentBlock', 'contentBlockId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  business: a.model({
    id: a.id().required(),
    businessType: a.enum(businessType),
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string().required(),
    logoUrl: a.string().required(),
    uniqueTaxIdentificationNumber: a.string().required(),
    description: a.string().required(),
    isPublished: a.boolean().default(true),
    establishedDate: a.datetime(),
    address: a.hasOne('address', 'businessId'),
    contracts: a.hasMany('contract', 'businessId'),
    // certifications: a.hasMany('certification', 'businessId'),
    licenses: a.hasMany('license', 'businessId'),
    businessOpeningHour: a.hasOne('businessOpeningHour', 'businessId'),
    likes: a.hasMany('businessLike', 'businessId'),
    ratings: a.hasMany('rating', 'businessId'),
    consultationRecords: a.hasMany('consultationRecord', 'businessId'),
    businessServices: a.hasMany('businessService', 'businessId'),
    invoices: a.hasMany('invoice', 'businessId'),
    professionals: a.hasMany('professional', 'businessId'),
    courierDeliveries: a.hasMany('delivery', 'courierId'),
    pharmacyDeliveries: a.hasMany('delivery', 'pharmacyId'),
    pharmacyInventoryItems: a.hasMany('pharmacyInventory', 'pharmacyId'),
    medicineOrders: a.hasMany('medicineOrder', 'businessId'),
    // hospitalAmbulances: a.hasMany('ambulance', 'hospitalId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('PROFESSIONAL').to(['read', 'update']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  professional: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    businessId: a.id().required(),
    professionalRegistrationNumber: a.string().required(),
    phone: a.string().required(),
    email: a.string().required(),
    name: a.string().required(),
    gender: a.enum(gender),
    dateOfBirth: a.datetime(),
    lastLogin: a.datetime(),
    profilePicture: a.string().required(),
    bio: a.string(),
    type: a.enum(professionalType),
    role: a.enum(professionalRole),
    isActive: a.boolean().default(true),
    status: a.enum(professionalStatus),
    languagesSpoken: a.string().required().array().required(),
    specialties: a.string().required().array().required(),
    education: a.string().required().array().required(),
    careerStartDate: a.datetime().required(),
    availability: a.hasOne('professionalAvailability', 'professionalId'),
    // certifications: a.hasMany('certification', 'professionalId'),
    licenses: a.hasMany('license', 'professionalId'),
    ratings: a.hasMany('rating', 'professionalId'),
    user: a.belongsTo('user', 'userId'),
    business: a.belongsTo('business', 'businessId'),
    prescriptions: a.hasMany('prescription', 'prescriberId'),
    services: a.hasMany('businessService', 'professionalId'),
    consultationRecords: a.hasMany('consultationRecord', 'professionalId'),
    appointments: a.hasMany('appointment', 'professionalId'),
    medicationsAdministered: a.hasMany('medicationRecord', 'administeredById'),
    vehicles: a.hasMany('vehicle', 'driverId'),
    driverDeliveries: a.hasMany('delivery', 'driverId'),
    driverLocationHistories: a.hasMany('driverLocationHistory', 'driverId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['PROFESSIONAL', 'ADMIN']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions', 'delete']),

  professionalAvailability: a.model({
    id: a.id().required(),
    professionalId: a.id().required(),
    bufferBefore: a.integer().required(),
    bufferAfter: a.integer().required(),
    timeSlots: a.json().array().required(),
    exclusions: a.datetime().array(),
    recurrencePattern: a.hasOne('recurrencePattern', 'professionalAvailabilityId'),
    professional: a.belongsTo('professional', 'professionalId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['PROFESSIONAL', 'ADMIN']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions']),

  recurrencePattern: a.model({
    id: a.id().required(),
    recurrenceType: a.enum(recurrenceType),
    recurrenceEnd: a.datetime(),
    daysOfWeek: a.integer().array(),
    professionalAvailabilityId: a.id().required(),
    professionalAvailability: a.belongsTo('professionalAvailability', 'professionalAvailabilityId')
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['PROFESSIONAL', 'ADMIN']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions']),

  driverLocationHistory: a.model({
    driverId: a.id().required(),
    latitude: a.float().required(),
    longitude: a.float().required(),
    timestamp: a.datetime().required(),
    driver: a.belongsTo('professional', 'driverId'),
  }).identifier(['driverId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['PROFESSIONAL', 'ADMIN']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions']),

  vehicle: a.model({
    id: a.id().required(),
    driverId: a.id().required(),
    plate: a.string().required(),
    model: a.string().required(),
    year: a.integer().required(),
    color: a.string().required(),
    type: a.string().required(),
    driver: a.belongsTo('professional', 'driverId'),
    deliveries: a.hasMany('delivery', 'vehicleId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['PROFESSIONAL', 'ADMIN']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions', 'delete']),

  delivery: a.model({
    id: a.id().required(),
    patientId: a.id().required(),
    orderId: a.id().required(),
    orderNumber: a.string().required(),
    driverId: a.id(),
    vehicleId: a.id(),
    courierId: a.id(),
    pharmacyId: a.id().required(),
    status: a.enum(deliveryStatus),
    distanceInKm: a.float().required(),
    estimatedDeliveryDuration: a.integer().required(),
    deliveryType: a.enum(deliveryType),
    totalDeliveryFee: a.float().required(),
    specialHandlingFee: a.float().required(),
    driverCommission: a.float(),
    notes: a.string(),
    preferredDeliveryTimeStartAt: a.datetime().required(),
    preferredDeliveryTimeEndAt: a.datetime().required(),
    pickedUpAt: a.datetime(),
    deliveredAt: a.datetime(),
    signatureImage: a.string(),
    deliveryConfirmationCode: a.string(),
    order: a.belongsTo('medicineOrder', 'orderId'),
    driver: a.belongsTo('professional', 'driverId'),
    courier: a.belongsTo('business', 'courierId'),
    vehicle: a.belongsTo('vehicle', 'vehicleId'),
    pharmacy: a.belongsTo('business', 'pharmacyId'),
    patient: a.belongsTo('patient', 'patientId'),
    address: a.hasOne('address', 'deliveryId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.groups(['PROFESSIONAL', 'ADMIN']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions', 'delete']),

  // ambulance: a.model({
  //   id: a.id().required(),
  //   hospitalId: a.id().required(),
  //   hospitalName: a.string().required(),
  //   vehiclePlate: a.string().required(),
  //   vehicleModel: a.string().required(),
  //   vehicleYear: a.integer().required(),
  //   vehicleColor: a.string().required(),
  //   vehicleType: a.string().required(),
  //   status: a.enum(ambulanceStatus),
  //   medicalEquipment: a.string().array(),
  //   crewMembers: a.string().array(),
  //   currentLatitude: a.float().required(),
  //   currentLongitude: a.float().required(),
  //   serviceArea: a.string().array(),
  //   contactNumber: a.string().required(),
  //   image: a.string().required(),
  //   hospital: a.belongsTo('business', 'hospitalId'),
  // })
  //   .authorization(allow => [
  //     allow.authenticated().to(['read']),
  //     allow.group('ADMIN').to(['read', 'create', 'update']),
  //   ]).disableOperations(['subscriptions', 'delete']),

  medicineCategory: a.model({
    id: a.id().required(),
    genericName: a.string().required(),
    dosageForms: a.string().array(),
    administrationRoutes: a.string().array(),
    indications: a.string().array(),
    sideEffects: a.string().array(),
    contraindications: a.string().array(),
    prescriptionLevel: a.integer().required(),
    precautions: a.string().array(),
    description: a.string(),
    composition: a.string(),
    specialHandlingDeliveryCondition: a.string(),
    specialHandlingDeliveryDescription: a.string(),
    specialHandlingDeliveryFee: a.float(),
    interactions: a.string().array(),
    storageConditions: a.string(),
    medicines: a.hasMany('medicine', 'categoryId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  medicine: a.model({
    id: a.id().required(),
    name: a.string().required(),
    brand: a.string().required(),
    description: a.string().required(),
    usage: a.string().required(),
    composition: a.string().required(),
    administrationRoute: a.string().required(),
    image: a.string().required(),
    needsPrescription: a.boolean().required(),
    packaging: a.string().required(),
    contraindications: a.string(),
    sideEffects: a.string(),
    precautions: a.string(),
    interactions: a.string(),
    storageConditions: a.string().required(),
    specialHandlingDeliveryCondition: a.string(),
    specialHandlingDeliveryDescription: a.string(),
    specialHandlingDeliveryFee: a.float().required().default(0),
    categoryId: a.id().required(),
    isDeleted: a.boolean().required().default(false),
    category: a.belongsTo('medicineCategory', 'categoryId'),
    prescriptionItems: a.hasMany('prescriptionItem', 'medicineId'),
    pharmacyInventories: a.hasMany('pharmacyInventory', 'medicineId'),
    //views: a.hasMany('view', 'medicineId'),
    likes: a.hasMany('medicineLike', 'medicineId'),
    ratings: a.hasMany('rating', 'medicineId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  pharmacyInventory: a.model({
    id: a.id().required(),
    pharmacyId: a.id().required(),
    medicineId: a.id().required(),
    price: a.float().required(),
    stock: a.integer().required(),
    specialHandlingDeliveryFee: a.float().default(0),
    pharmacyLatitude: a.float().required(),
    pharmacyLongitude: a.float().required(),
    isDeleted: a.boolean().default(false),
    pharmacy: a.belongsTo('business', 'pharmacyId'),
    medicine: a.belongsTo('medicine', 'medicineId'),
    medicineOrderItems: a.hasMany('medicineOrderItem', 'pharmacyInventoryId'),
    medicationRecords: a.hasMany('medicationRecord', 'pharmacyInventoryId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  notification: a.model({
    id: a.id().required(),
    title: a.string().required(),
    message: a.string().required(),
    type: a.enum(notificationType),
    targetAction: a.enum(targetAction),
    priority: a.enum(priority),
    payload: a.customType({
      href: a.string()
    }),
    expiresAt: a.datetime().required(),
    isRead: a.boolean().required().default(false),
    userId: a.id().required(),
    user: a.belongsTo('user', 'userId'),
  }).authorization(allow => [
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  // view: a.model({
  //   id: a.id().required(),
  //   userId: a.id(),
  //   identityId: a.string(),
  //   articleId: a.id(),
  //   medicineId: a.id(),
  //   user: a.belongsTo('user', 'userId'),
  //   article: a.belongsTo('article', 'articleId'),
  //   medicine: a.belongsTo('medicine', 'medicineId'),
  // })
  //   .authorization(allow => [
  //     allow.guest().to(['read', 'create']),
  //     allow.authenticated().to(['read', 'create']),
  //   ])
  //   .disableOperations(['update', 'delete', 'subscriptions']),

  articleLike: a.model({
    userId: a.id().required(),
    articleId: a.id().required(),
    user: a.belongsTo('user', 'userId'),
    article: a.belongsTo('article', 'articleId'),
  }).identifier(['articleId', 'userId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  medicineLike: a.model({
    userId: a.id().required(),
    medicineId: a.id().required(),
    user: a.belongsTo('user', 'userId'),
    medicine: a.belongsTo('medicine', 'medicineId'),
  }).identifier(['medicineId', 'userId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  businessLike: a.model({
    userId: a.id().required(),
    businessId: a.id().required(),
    user: a.belongsTo('user', 'userId'),
    business: a.belongsTo('business', 'businessId'),
  }).identifier(['businessId', 'userId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  address: a.model({
    id: a.id().required(),
    userId: a.id(),
    businessId: a.id(),
    deliveryId: a.id(),
    addressLine1: a.string().required(),
    neighborhoodOrDistrict: a.string().required(),
    city: a.string().required(),
    province: a.string().required(),
    postalCode: a.string(),
    country: a.string().required(),
    latitude: a.float(),
    longitude: a.float(),
    type: a.enum(addressType),
    user: a.belongsTo('user', 'userId'),
    business: a.belongsTo('business', 'businessId'),
    delivery: a.belongsTo('delivery', 'deliveryId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions']),

  // certification: a.model({
  //   id: a.id().required(),
  //   issuedBy: a.string().required(),
  //   name: a.string().required(),
  //   description: a.string(),
  //   professionalId: a.id(),
  //   businessId: a.id(),
  //   professional: a.belongsTo('professional', 'professionalId'),
  //   business: a.belongsTo('business', 'businessId'),
  // })
  //   .authorization(allow => [
  //     allow.authenticated().to(['create', 'read', 'update', 'delete']),
  //     allow.group('ADMIN').to(['read', 'create', 'update']),
  //   ]).disableOperations(['subscriptions']),

  license: a.model({
    id: a.id().required(),
    issuedBy: a.string().required(),
    licenseNumber: a.string().required(),
    issueDate: a.datetime().required(),
    status: a.enum(licenseStatus),
    expiryDate: a.datetime(),
    description: a.string(),
    businessId: a.id(),
    professionalId: a.id(),
    professional: a.belongsTo('professional', 'professionalId'),
    business: a.belongsTo('business', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions']),

  businessOpeningHour: a.model({
    id: a.id().required(),
    businessId: a.id().required(),
    regularOpeningHours: a.hasMany('businessRegularOpeningHour', 'businessOpeningHourId'),
    specialOpeningHours: a.hasMany('businessSpecialOpeningHour', 'businessOpeningHourId'),
    business: a.belongsTo('business', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  businessRegularOpeningHour: a.model({
    id: a.id().required(),
    dayOfWeek: a.integer().required(),
    timeRange: a.customType({
      openingTime: a.string().required(),
      closingTime: a.string().required(),
    }),
    isClosed: a.boolean().required().default(false),
    is24Hours: a.boolean().required().default(false),
    businessOpeningHourId: a.id().required(),
    businessOpeningHour: a.belongsTo('businessOpeningHour', 'businessOpeningHourId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  businessSpecialOpeningHour: a.model({
    id: a.id().required(),
    date: a.date().required(),
    timeRange: a.customType({
      openingTime: a.string().required(),
      closingTime: a.string().required(),
    }),
    isClosed: a.boolean().required().default(false),
    is24Hours: a.boolean().required().default(false),
    businessOpeningHourId: a.id().required(),
    businessOpeningHour: a.belongsTo('businessOpeningHour', 'businessOpeningHourId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  rating: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    comment: a.string().required(),
    rating: a.integer().required(),
    verifiedPurchase: a.boolean(),
    responseComment: a.string(),
    responseCreatedAt: a.datetime(),
    businessId: a.id(),
    professionalId: a.id(),
    medicineId: a.id(),
    businessServiceId: a.id(),
    medicine: a.belongsTo('medicine', 'medicineId'),
    businessService: a.belongsTo('businessService', 'businessServiceId'),
    business: a.belongsTo('business', 'businessId'),
    professional: a.belongsTo('professional', 'professionalId'),
    user: a.belongsTo('user', 'userId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions']),

  reminder: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    appointmentId: a.id(),
    medicationRecordId: a.id(),
    type: a.enum(reminderType),
    title: a.string().required(),
    message: a.string().required(),
    dateTime: a.datetime().required(),
    status: a.enum(reminderStatus),
    repeat: a.enum(repeatType),
    user: a.belongsTo('user', 'userId'),
    appointment: a.belongsTo('appointment', 'appointmentId'),
    medicationRecord: a.belongsTo('medicationRecord', 'medicationRecordId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update', 'create', 'delete']),
    ]).disableOperations(['subscriptions']),

  invoice: a.model({
    id: a.id().required(),
    invoiceNumber: a.string().required(),
    patientId: a.id().required(),
    businessId: a.id().required(),
    medicineOrderId: a.id(),
    contractId: a.id(),
    orderNumber: a.string().required(),
    paymentMethodType: a.enum(paymentMethodType),
    subTotal: a.float().required(),
    discount: a.float().required(),
    taxes: a.float().required(),
    totalAmount: a.float().required(),
    paymentTerms: a.enum(paymentTermsType),
    dueDate: a.datetime().required(),
    status: a.enum(invoiceStatus),
    patient: a.belongsTo('patient', 'patientId'),
    medicineOrder: a.belongsTo('medicineOrder', 'medicineOrderId'),
    contract: a.belongsTo('contract', 'contractId'),
    business: a.belongsTo('business', 'businessId'),
    transactions: a.hasMany('paymentTransaction', 'invoiceId'),
  })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update', 'create']),
    ]).disableOperations(['subscriptions', 'delete']),

  paymentTransaction: a.model({
    id: a.id().required(),
    invoiceId: a.id().required(),
    paymentMethodId: a.id().required(),
    transactionID: a.string(),
    amount: a.float().required(),
    transactionDate: a.datetime().required(),
    status: a.enum(paymentTransactionStatus),
    notes: a.string(),
    invoice: a.belongsTo('invoice', 'invoiceId'),
    paymentMethod: a.belongsTo('paymentMethod', 'paymentMethodId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  paymentMethod: a.model({
    id: a.id().required(),
    patientId: a.id().required(),
    ownerName: a.string().required(),
    type: a.enum(paymentMethodType),
    paymentToken: a.string().required(), // Token or reference ID
    isDefault: a.boolean().required(),
    cardDetails: a.customType({
      cardBrand: a.enum(cardBrand),
      lastFourDigits: a.string().required(),
    }),
    mobileDetails: a.customType({
      mobileNumber: a.string().required(),
      mobileProviderName: a.enum(mobileProviderName),
    }),
    patient: a.belongsTo('patient', 'patientId'),
    transactions: a.hasMany('paymentTransaction', 'paymentMethodId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('ADMIN').to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),
})
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});