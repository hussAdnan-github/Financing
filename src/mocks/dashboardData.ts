export type ClientStage =
  | "new_request"
  | "under_study"
  | "awaiting_approval"
  | "final_review"
  | "signing"
  | "execution"
  | "collection"
  | "archived";

export type ClientSpecialStatus =
  | "rejected"
  | "cancelled"
  | "completed"
  | "defaulted"
  | "partial_default";

export type UserRole = "employee" | "supervisor" | "auditor" | "manager";

export interface CreditProduct {
  id: string;
  type: string;
  provider: string;
  remainingAmount: number;
  paymentStatus: string;
  verifiedAmount: number;
}

export interface ExecutionDecision {
  decisionDate: string;
  registrationDate: string;
  remainingAmount: number;
  executionStatus: string;
  settlementDate?: string;
}

export interface DefaultSummaryItem {
  title: string;
  amount: number;
}

export interface CreditReport {
  reportDate?: string;
  activeProducts: CreditProduct[];
  guaranteedProducts: CreditProduct[];
  bnplProducts: { status: string; remainingAmount: number }[];
  defaultedProducts: CreditProduct[];
  guaranteedDefaulted: CreditProduct[];
  bouncedChecks: { bank: string; remainingAmount: number; status: string }[];
  recentInquiries: { date: string; inquirer: string; productType: string; amount: number }[];
  executionDecisions: ExecutionDecision[];
  defaultSummary: DefaultSummaryItem[];
  totalActiveObligations: number;
  totalDefaulted: number;
  creditScore: number;
}

export interface FinancingOffer {
  installment: number;
  netFinancingAmount: number;
  financingType: string;
  profitRate: number;
  providerName: string;
  providerProfit: number;
  initialOfferFile?: string;
  finalOfferFile?: string;
}

export interface SalaryDefinition {
  attachmentFile?: string;
  issueDate?: string;
}

export interface PaymentAttachment {
  id: string;
  name: string;
  date: string;
  paymentAmount: number;
  paymentDate: string;
}

export interface CollectionAttachment {
  id: string;
  name: string;
  date: string;
  collectionAmount: number;
}

export interface ContractFile {
  id: string;
  type: string;
  status: "pending_upload" | "uploaded" | "signed";
  fileUrl?: string;
  uploadedAt?: string;
}

export interface FinancingCalc {
  requestedAmount: number;
  approvedAmount: number;
  profitRate: number;
  months: number;
  monthlyInstallment: number;
  totalAmount: number;
  offerPrice: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  note: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  attachmentUrl?: string;
}

export interface FinancialSection {
  agreementValue: number;
  expenses: Expense[];
  payments: Payment[];
  paymentSchedule: { dueDate: string; amount: number; status: string }[];
}

export interface Attachment {
  id: string;
  name: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  fileType: string;
  fileSize: string;
  url: string;
}

export interface ActionLog {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  note?: string;
  fromStage?: ClientStage;
  toStage?: ClientStage;
}

export interface Guarantor {
  name: string;
  phone: string;
  nationalId: string;
  relation: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected" | "returned";

export interface ManagerApprovalRequest {
  requestedAt: string;
  requestedBy: string;
  reason: string;
  urgency: "normal" | "urgent";
}

export interface ReviewDeficiency {
  id: string;
  category: string;
  description: string;
  severity: "high" | "medium" | "low";
  resolved: boolean;
  resolvedAt?: string;
}

export interface Client {
  id: string;
  specialStatus?: ClientSpecialStatus;
  specialStatusReason?: string;
  specialStatusDate?: string;
  reviewStatus?: ReviewStatus;
  reviewDeficiencies?: ReviewDeficiency[];
  reviewNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  // Manager approval request (supervisor-initiated, rare case)
  managerApprovalRequested?: boolean;
  managerApprovalRequest?: ManagerApprovalRequest;
  managerApprovalDecision?: "approved" | "rejected";
  managerApprovalNote?: string;
  // Landing page data
  fullName: string;
  phone: string;
  whatsapp?: string;
  city: string;
  employerType: string;
  employerName: string;
  serviceType: string;
  salaryTransfer: boolean;
  salaryBank?: string;
  privacyConsent: boolean;
  submittedAt: string;
  source: string;
  // Employee-completed data
  nationalIdImage?: string;
  nationalIdNumber?: string;
  nationalIdExpiry?: string;
  salaryAmount?: number;
  salaryDate?: string;
  joinDate?: string;
  additionalPhones?: string[];
  hasGuarantor: boolean;
  guarantor?: Guarantor;
  guarantorCreditReport?: CreditReport;
  guarantorIdImage?: string;
  // Salary definition
  salaryDefinition?: SalaryDefinition;
  // Stage & assignment
  stage: ClientStage;
  assignedTo?: string;
  assignedToRole?: UserRole;
  rejectionReason?: string;
  // Financial
  creditReport?: CreditReport;
  financingOffer?: FinancingOffer;
  financingCalc?: FinancingCalc;
  financial?: FinancialSection;
  // Contracts
  contracts?: ContractFile[];
  // Execution
  paymentAttachments?: PaymentAttachment[];
  clientPaymentAmount?: number;
  // Collection
  collectionAttachments?: CollectionAttachment[];
  collectionStatus?: "active" | "completed" | "defaulted";
  // Attachments & logs
  attachments: Attachment[];
  actionLogs: ActionLog[];
}

export const specialStatusLabels: Record<ClientSpecialStatus, string> = {
  rejected: "مرفوض",
  cancelled: "ملغي",
  completed: "منتهي",
  defaulted: "متعثر",
  partial_default: "متعثر جزئي",
};

export const specialStatusColors: Record<ClientSpecialStatus, string> = {
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600",
  completed: "bg-emerald-100 text-emerald-700",
  defaulted: "bg-rose-100 text-rose-800",
  partial_default: "bg-orange-100 text-orange-700",
};

export const stageLabels: Record<ClientStage, string> = {
  new_request: "طلب جديد",
  under_study: "تحت الدراسة",
  awaiting_approval: "بانتظار موافقة العميل",
  final_review: "مراجعة نهائية",
  signing: "توقيع العقود",
  execution: "تنفيذ",
  collection: "التحصيل",
  archived: "أرشفة",
};

export const stageColors: Record<ClientStage, string> = {
  new_request: "bg-blue-100 text-blue-700",
  under_study: "bg-amber-100 text-amber-700",
  awaiting_approval: "bg-orange-100 text-orange-700",
  final_review: "bg-purple-100 text-purple-700",
  signing: "bg-teal-100 text-teal-700",
  execution: "bg-green-100 text-green-700",
  collection: "bg-cyan-100 text-cyan-700",
  archived: "bg-gray-100 text-gray-600",
};

export const roleLabels: Record<UserRole, string> = {
  employee: "موظف",
  supervisor: "مشرف",
  auditor: "مدقق",
  manager: "مدير",
};

export const mockClients: Client[] = [
  {
    id: "CLT-006",
    fullName: "بندر سليمان الرشيدي",
    phone: "0543219876",
    city: "الرياض",
    employerType: "مدني",
    employerName: "وزارة المالية",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الراجحي",
    privacyConsent: true,
    submittedAt: "2026-04-05T10:00:00",
    source: "حملة إنستغرام - مارس",
    hasGuarantor: false,
    stage: "new_request",
    specialStatus: "rejected",
    specialStatusReason: "السجل الائتماني لا يستوفي الحد الأدنى المطلوب",
    specialStatusDate: "2026-04-08T14:00:00",
    assignedTo: "سارة المطيري",
    assignedToRole: "employee",
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-05T11:00:00", fileType: "image", fileSize: "1.2 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-05T10:00:00" },
      { id: "l2", action: "رفض الملف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-08T14:00:00", note: "السجل الائتماني لا يستوفي الحد الأدنى المطلوب" },
    ],
  },
  {
    id: "CLT-007",
    fullName: "هند عبدالله الزهراني",
    phone: "0508765432",
    city: "جدة",
    employerType: "قطاع خاص",
    employerName: "مجموعة بن لادن",
    serviceType: "تمويل عقاري",
    salaryTransfer: false,
    privacyConsent: true,
    submittedAt: "2026-03-20T09:00:00",
    source: "إحالة مباشرة",
    hasGuarantor: false,
    stage: "under_study",
    specialStatus: "cancelled",
    specialStatusReason: "طلب العميل إيقاف التعامل",
    specialStatusDate: "2026-04-10T11:00:00",
    assignedTo: "خالد الدوسري",
    assignedToRole: "employee",
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-03-20T09:00:00" },
      { id: "l2", action: "إلغاء الملف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-10T11:00:00", note: "طلب العميل إيقاف التعامل" },
    ],
  },
  {
    id: "CLT-008",
    fullName: "عمر فهد الحمدان",
    phone: "0521234567",
    city: "الدمام",
    employerType: "عسكري",
    employerName: "وزارة الداخلية",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "البنك الأهلي السعودي",
    privacyConsent: true,
    submittedAt: "2026-02-10T08:00:00",
    source: "حملة جوجل - فبراير",
    hasGuarantor: false,
    stage: "collection",
    specialStatus: "completed",
    specialStatusDate: "2026-04-15T10:00:00",
    clientPaymentAmount: 45000,
    collectionStatus: "completed" as const,
    assignedTo: "نورة القحطاني",
    assignedToRole: "employee",
    financial: {
      agreementValue: 45000,
      expenses: [{ id: "e1", description: "رسوم إدارية", amount: 350, date: "2026-02-11" }],
      payments: [
        { id: "pay1", amount: 45000, date: "2026-04-15", method: "تحويل بنكي", note: "سداد كامل" },
      ],
      paymentSchedule: [],
    },
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-02-10T08:00:00" },
      { id: "l2", action: "اكتمال التحصيل", performedBy: "نورة القحطاني", role: "employee", timestamp: "2026-04-15T10:00:00", note: "تم سداد المبلغ كاملاً" },
    ],
  },
  {
    id: "CLT-009",
    fullName: "ماجد عبدالكريم العسيري",
    phone: "0536789012",
    city: "أبها",
    employerType: "مدني",
    employerName: "وزارة الصحة",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الجزيرة",
    privacyConsent: true,
    submittedAt: "2026-01-15T10:00:00",
    source: "حملة إنستغرام - يناير",
    hasGuarantor: false,
    stage: "collection",
    specialStatus: "defaulted",
    specialStatusReason: "لم يسدد منذ 3 أشهر",
    specialStatusDate: "2026-04-01T09:00:00",
    clientPaymentAmount: 60000,
    collectionStatus: "defaulted" as const,
    assignedTo: "خالد الدوسري",
    assignedToRole: "employee",
    financial: {
      agreementValue: 60000,
      expenses: [{ id: "e1", description: "رسوم إدارية", amount: 450, date: "2026-01-16" }],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-01-15T10:00:00" },
      { id: "l2", action: "تصنيف متعثر", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-01T09:00:00", note: "لم يسدد منذ 3 أشهر" },
    ],
  },
  {
    id: "CLT-010",
    fullName: "لطيفة محمد الشمري",
    phone: "0549876543",
    city: "الرياض",
    employerType: "شبه حكومي",
    employerName: "شركة سابك",
    serviceType: "إعادة تمويل",
    salaryTransfer: true,
    salaryBank: "بنك الرياض",
    privacyConsent: true,
    submittedAt: "2026-02-01T09:00:00",
    source: "حملة تويتر - فبراير",
    hasGuarantor: false,
    stage: "collection",
    specialStatus: "partial_default",
    specialStatusReason: "سدّد 40% فقط من المبلغ المستحق",
    specialStatusDate: "2026-04-10T10:00:00",
    clientPaymentAmount: 80000,
    collectionStatus: "active" as const,
    assignedTo: "سارة المطيري",
    assignedToRole: "employee",
    financial: {
      agreementValue: 80000,
      expenses: [{ id: "e1", description: "رسوم إدارية", amount: 550, date: "2026-02-02" }],
      payments: [
        { id: "pay1", amount: 32000, date: "2026-03-15", method: "تحويل بنكي", note: "دفعة جزئية" },
      ],
      paymentSchedule: [],
    },
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-02-01T09:00:00" },
      { id: "l2", action: "تصنيف متعثر جزئي", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-10T10:00:00", note: "سدّد 40% فقط من المبلغ المستحق" },
    ],
  },
  {
    id: "CLT-001",
    fullName: "محمد عبدالله الغامدي",
    phone: "0501234567",
    city: "الرياض",
    employerType: "مدني",
    employerName: "وزارة الصحة",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الراجحي",
    privacyConsent: true,
    submittedAt: "2026-04-20T09:15:00",
    source: "حملة إنستغرام - أبريل",
    nationalIdImage: "https://readdy.ai/api/search-image?query=Saudi%20national%20ID%20card%20document%20flat%20lay%20on%20white%20background%20professional%20scan&width=400&height=260&seq=id1&orientation=landscape",
    nationalIdNumber: "1098765432",
    nationalIdExpiry: "2028-06-15",
    salaryAmount: 12500,
    salaryDate: "27",
    joinDate: "2018-03-01",
    additionalPhones: ["0551234567"],
    hasGuarantor: false,
    stage: "under_study",
    assignedTo: "سارة المطيري",
    assignedToRole: "employee",
    reviewStatus: "pending",
    reviewDeficiencies: [],
    salaryDefinition: {
      issueDate: "2026-04-01",
    },
    creditReport: {
      reportDate: "2026-04-21",
      activeProducts: [
        { id: "p1", type: "قرض شخصي", provider: "بنك الراجحي", remainingAmount: 45000, paymentStatus: "منتظم", verifiedAmount: 45000 },
        { id: "p2", type: "بطاقة ائتمانية", provider: "البنك الأهلي", remainingAmount: 8200, paymentStatus: "منتظم", verifiedAmount: 8200 },
      ],
      guaranteedProducts: [],
      bnplProducts: [{ status: "نشط", remainingAmount: 1200 }],
      defaultedProducts: [],
      guaranteedDefaulted: [],
      bouncedChecks: [],
      recentInquiries: [
        { date: "2026-03-15", inquirer: "بنك الرياض", productType: "قرض شخصي", amount: 80000 },
      ],
      executionDecisions: [],
      defaultSummary: [],
      totalActiveObligations: 53200,
      totalDefaulted: 0,
      creditScore: 720,
    },
    financingOffer: {
      installment: 1395,
      netFinancingAmount: 75000,
      financingType: "تمويل شخصي",
      profitRate: 4.5,
      providerName: "بنك الراجحي",
      providerProfit: 8700,
    },
    financingCalc: {
      requestedAmount: 80000,
      approvedAmount: 75000,
      profitRate: 4.5,
      months: 60,
      monthlyInstallment: 1395,
      totalAmount: 83700,
      offerPrice: "عرض سعر رقم OS-2026-0420",
    },
    financial: {
      agreementValue: 75000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 500, date: "2026-04-21" },
        { id: "e2", description: "تقرير ائتماني", amount: 150, date: "2026-04-21" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-20T10:30:00", fileType: "image", fileSize: "1.2 MB", url: "#" },
      { id: "a2", name: "كشف الراتب - مارس 2026", category: "راتب", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-20T10:35:00", fileType: "pdf", fileSize: "0.8 MB", url: "#" },
      { id: "a3", name: "التقرير الائتماني", category: "ائتماني", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-21T09:00:00", fileType: "pdf", fileSize: "2.1 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-20T09:15:00", note: "تم إنشاء الملف تلقائياً من صفحة الهبوط" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-20T09:45:00", note: "تم تعيين سارة المطيري" },
      { id: "l3", action: "تحديث البيانات", performedBy: "سارة المطيري", role: "employee", timestamp: "2026-04-20T10:30:00", note: "تم رفع صورة الهوية وكشف الراتب" },
      { id: "l4", action: "تغيير المرحلة", performedBy: "سارة المطيري", role: "employee", timestamp: "2026-04-21T09:00:00", fromStage: "new_request", toStage: "under_study", note: "اكتملت البيانات الأساسية" },
    ],
  },
  {
    id: "CLT-002",
    fullName: "فاطمة سعد العتيبي",
    phone: "0559876543",
    city: "جدة",
    employerType: "عسكري",
    employerName: "وزارة الدفاع",
    serviceType: "تمويل عقاري",
    salaryTransfer: true,
    salaryBank: "البنك الأهلي السعودي",
    privacyConsent: true,
    submittedAt: "2026-04-18T14:20:00",
    source: "حملة جوجل - أبريل",
    nationalIdNumber: "1087654321",
    nationalIdExpiry: "2029-01-20",
    salaryAmount: 18000,
    salaryDate: "25",
    joinDate: "2015-07-15",
    additionalPhones: [],
    hasGuarantor: true,
    guarantor: { name: "سعد العتيبي", phone: "0501112233", nationalId: "1076543210", relation: "والد" },
    stage: "awaiting_approval",
    assignedTo: "خالد الدوسري",
    assignedToRole: "employee",
    financingCalc: {
      requestedAmount: 500000,
      approvedAmount: 480000,
      profitRate: 3.8,
      months: 240,
      monthlyInstallment: 2890,
      totalAmount: 693600,
      offerPrice: "عرض سعر رقم OS-2026-0418",
    },
    financial: {
      agreementValue: 480000,
      expenses: [
        { id: "e1", description: "رسوم تقييم العقار", amount: 1200, date: "2026-04-19" },
        { id: "e2", description: "رسوم إدارية", amount: 800, date: "2026-04-19" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-18T15:00:00", fileType: "image", fileSize: "1.5 MB", url: "#" },
      { id: "a2", name: "كشف الراتب", category: "راتب", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-18T15:05:00", fileType: "pdf", fileSize: "0.9 MB", url: "#" },
      { id: "a3", name: "عقد الزواج", category: "وثائق أخرى", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-19T10:00:00", fileType: "pdf", fileSize: "1.1 MB", url: "#" },
      { id: "a4", name: "حسبة التمويل", category: "مالي", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-19T11:00:00", fileType: "pdf", fileSize: "0.5 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-18T14:20:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-18T14:50:00", note: "تم تعيين خالد الدوسري" },
      { id: "l3", action: "تغيير المرحلة", performedBy: "خالد الدوسري", role: "employee", timestamp: "2026-04-19T11:30:00", fromStage: "new_request", toStage: "under_study" },
      { id: "l4", action: "تغيير المرحلة", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-20T09:00:00", fromStage: "under_study", toStage: "awaiting_approval", note: "تمت المراجعة وإرسال العرض للعميل" },
    ],
  },
  {
    id: "CLT-003",
    fullName: "عبدالرحمن ناصر الشهري",
    phone: "0534567890",
    city: "الدمام",
    employerType: "قطاع خاص",
    employerName: "شركة أرامكو السعودية",
    serviceType: "تمويل مركبات",
    salaryTransfer: false,
    privacyConsent: true,
    submittedAt: "2026-04-22T11:00:00",
    source: "إحالة مباشرة",
    hasGuarantor: false,
    stage: "new_request",
    assignedTo: "نورة القحطاني",
    assignedToRole: "employee",
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-22T11:00:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-22T11:30:00", note: "تم تعيين نورة القحطاني" },
    ],
  },
  {
    id: "CLT-004",
    fullName: "سلطان محمد الحربي",
    phone: "0567891234",
    city: "مكة المكرمة",
    employerType: "مدني",
    employerName: "وزارة التعليم",
    serviceType: "إعادة تمويل",
    salaryTransfer: true,
    salaryBank: "بنك الرياض",
    privacyConsent: true,
    submittedAt: "2026-04-15T08:30:00",
    source: "حملة إنستغرام - أبريل",
    nationalIdNumber: "1065432109",
    nationalIdExpiry: "2027-09-10",
    salaryAmount: 9800,
    salaryDate: "28",
    joinDate: "2012-09-01",
    additionalPhones: ["0501234568", "0551234568"],
    hasGuarantor: false,
    stage: "signing",
    assignedTo: "سارة المطيري",
    assignedToRole: "employee",
    contracts: [
      { id: "c1", type: "عرض قرض حسن", status: "uploaded", fileUrl: "#", uploadedAt: "2026-04-22T10:00:00" },
      { id: "c2", type: "مخالصة", status: "pending_upload" },
      { id: "c3", type: "سند لأمر", status: "pending_upload" },
      { id: "c4", type: "سند قبض", status: "pending_upload" },
      { id: "c5", type: "سند استلام", status: "pending_upload" },
    ],
    financingOffer: {
      installment: 1260,
      netFinancingAmount: 55000,
      financingType: "إعادة تمويل",
      profitRate: 4.2,
      providerName: "بنك الرياض",
      providerProfit: 5480,
    },
    financingCalc: {
      requestedAmount: 60000,
      approvedAmount: 55000,
      profitRate: 4.2,
      months: 48,
      monthlyInstallment: 1260,
      totalAmount: 60480,
      offerPrice: "عرض سعر رقم OS-2026-0415",
    },
    financial: {
      agreementValue: 55000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 400, date: "2026-04-16" },
        { id: "e2", description: "تقرير ائتماني", amount: 150, date: "2026-04-16" },
        { id: "e3", description: "رسوم توثيق", amount: 250, date: "2026-04-17" },
      ],
      payments: [
        { id: "pay1", amount: 5000, date: "2026-04-20", method: "تحويل بنكي", note: "دفعة أولى" },
      ],
      paymentSchedule: [
        { dueDate: "2026-05-28", amount: 1260, status: "قادم" },
        { dueDate: "2026-06-28", amount: 1260, status: "قادم" },
        { dueDate: "2026-07-28", amount: 1260, status: "قادم" },
      ],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-15T09:00:00", fileType: "image", fileSize: "1.3 MB", url: "#" },
      { id: "a2", name: "كشف الراتب", category: "راتب", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-15T09:05:00", fileType: "pdf", fileSize: "0.7 MB", url: "#" },
      { id: "a3", name: "التقرير الائتماني", category: "ائتماني", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-16T10:00:00", fileType: "pdf", fileSize: "1.8 MB", url: "#" },
      { id: "a4", name: "عقد التمويل", category: "عقود", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-22T14:00:00", fileType: "pdf", fileSize: "3.2 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-15T08:30:00" },
      { id: "l2", action: "تغيير المرحلة", performedBy: "سارة المطيري", role: "employee", timestamp: "2026-04-15T09:30:00", fromStage: "new_request", toStage: "under_study" },
      { id: "l3", action: "تغيير المرحلة", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-17T10:00:00", fromStage: "under_study", toStage: "awaiting_approval" },
      { id: "l4", action: "موافقة العميل", performedBy: "سارة المطيري", role: "employee", timestamp: "2026-04-18T14:00:00", fromStage: "awaiting_approval", toStage: "final_review", note: "وافق العميل على العرض" },
      { id: "l5", action: "اعتماد المدير", performedBy: "فيصل الزهراني", role: "manager", timestamp: "2026-04-20T09:00:00", fromStage: "final_review", toStage: "signing", note: "تمت الموافقة النهائية" },
    ],
  },
  {
    id: "CLT-011",
    fullName: "عبدالله فهد المطيري",
    phone: "0501112233",
    city: "الرياض",
    employerType: "مدني",
    employerName: "وزارة التعليم",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الراجحي",
    privacyConsent: true,
    submittedAt: "2026-04-24T08:00:00",
    source: "حملة إنستغرام - أبريل",
    hasGuarantor: false,
    stage: "new_request",
    assignedTo: undefined,
    assignedToRole: undefined,
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-24T08:00:00" },
    ],
  },
  {
    id: "CLT-012",
    fullName: "نورة سعد الدوسري",
    phone: "0552223344",
    city: "جدة",
    employerType: "عسكري",
    employerName: "وزارة الدفاع",
    serviceType: "تمويل عقاري",
    salaryTransfer: true,
    salaryBank: "البنك الأهلي السعودي",
    privacyConsent: true,
    submittedAt: "2026-04-23T14:00:00",
    source: "حملة جوجل - أبريل",
    hasGuarantor: false,
    stage: "new_request",
    assignedTo: undefined,
    assignedToRole: undefined,
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-23T14:00:00" },
    ],
  },
  {
    id: "CLT-013",
    fullName: "فهد عبدالرحمن القحطاني",
    phone: "0533334455",
    city: "الدمام",
    employerType: "قطاع خاص",
    employerName: "شركة أرامكو السعودية",
    serviceType: "تمويل مركبات",
    salaryTransfer: false,
    privacyConsent: true,
    submittedAt: "2026-04-22T10:30:00",
    source: "إحالة مباشرة",
    hasGuarantor: false,
    stage: "new_request",
    assignedTo: undefined,
    assignedToRole: undefined,
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-22T10:30:00" },
    ],
  },
  {
    id: "CLT-014",
    fullName: "مها عبدالله الزهراني",
    phone: "0544445566",
    city: "مكة المكرمة",
    employerType: "شبه حكومي",
    employerName: "شركة الاتصالات السعودية",
    serviceType: "إعادة تمويل",
    salaryTransfer: true,
    salaryBank: "بنك الرياض",
    privacyConsent: true,
    submittedAt: "2026-04-21T09:00:00",
    source: "حملة تويتر - أبريل",
    hasGuarantor: false,
    stage: "new_request",
    assignedTo: undefined,
    assignedToRole: undefined,
    attachments: [],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-21T09:00:00" },
    ],
  },
  {
    id: "CLT-017",
    fullName: "خالد عبدالرحمن العمري",
    phone: "0577778899",
    city: "الرياض",
    employerType: "مدني",
    employerName: "وزارة الصحة",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الراجحي",
    privacyConsent: true,
    submittedAt: "2026-04-17T10:00:00",
    source: "حملة إنستغرام - أبريل",
    nationalIdNumber: "1076543219",
    nationalIdExpiry: "2028-03-10",
    salaryAmount: 14000,
    salaryDate: "27",
    joinDate: "2017-06-01",
    additionalPhones: [],
    hasGuarantor: false,
    stage: "final_review",
    assignedTo: "سارة المطيري",
    assignedToRole: "employee",
    reviewStatus: "approved",
    reviewDeficiencies: [],
    reviewNote: "جميع الوثائق مكتملة — تمت الموافقة",
    reviewedAt: "2026-04-22T11:00:00",
    reviewedBy: "منى الزهراني",
    salaryDefinition: { issueDate: "2026-04-05" },
    creditReport: {
      reportDate: "2026-04-18",
      activeProducts: [
        { id: "p1", type: "قرض شخصي", provider: "بنك الراجحي", remainingAmount: 30000, paymentStatus: "منتظم", verifiedAmount: 30000 },
      ],
      guaranteedProducts: [],
      bnplProducts: [],
      defaultedProducts: [],
      guaranteedDefaulted: [],
      bouncedChecks: [],
      recentInquiries: [],
      executionDecisions: [],
      defaultSummary: [],
      totalActiveObligations: 30000,
      totalDefaulted: 0,
      creditScore: 710,
    },
    financingOffer: {
      installment: 1180,
      netFinancingAmount: 65000,
      financingType: "تمويل شخصي",
      profitRate: 4.3,
      providerName: "بنك الراجحي",
      providerProfit: 6200,
    },
    financingCalc: {
      requestedAmount: 70000,
      approvedAmount: 65000,
      profitRate: 4.3,
      months: 60,
      monthlyInstallment: 1180,
      totalAmount: 70800,
      offerPrice: "عرض سعر رقم OS-2026-0417",
    },
    financial: {
      agreementValue: 65000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 450, date: "2026-04-18" },
        { id: "e2", description: "تقرير ائتماني", amount: 150, date: "2026-04-18" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-17T11:00:00", fileType: "image", fileSize: "1.3 MB", url: "#" },
      { id: "a2", name: "كشف الراتب - أبريل 2026", category: "راتب", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-17T11:05:00", fileType: "pdf", fileSize: "0.8 MB", url: "#" },
      { id: "a3", name: "التقرير الائتماني", category: "ائتماني", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-18T09:00:00", fileType: "pdf", fileSize: "1.9 MB", url: "#" },
      { id: "a4", name: "حسبة التمويل", category: "مالي", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-19T10:00:00", fileType: "pdf", fileSize: "0.5 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-17T10:00:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-17T10:30:00" },
      { id: "l3", action: "تغيير المرحلة", performedBy: "سارة المطيري", role: "employee", timestamp: "2026-04-18T09:30:00", fromStage: "new_request", toStage: "under_study" },
      { id: "l4", action: "تغيير المرحلة", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-20T09:00:00", fromStage: "under_study", toStage: "awaiting_approval" },
      { id: "l5", action: "موافقة العميل", performedBy: "سارة المطيري", role: "employee", timestamp: "2026-04-21T11:00:00", fromStage: "awaiting_approval", toStage: "final_review", note: "وافق العميل على العرض" },
      { id: "l6", action: "موافقة المدقق", performedBy: "منى الزهراني", role: "auditor", timestamp: "2026-04-22T11:00:00", note: "جميع الوثائق مكتملة" },
    ],
  },
  {
    id: "CLT-018",
    fullName: "نوف عبدالعزيز الحارثي",
    phone: "0588889900",
    city: "جدة",
    employerType: "شبه حكومي",
    employerName: "شركة سابك",
    serviceType: "إعادة تمويل",
    salaryTransfer: true,
    salaryBank: "بنك الجزيرة",
    privacyConsent: true,
    submittedAt: "2026-04-16T09:00:00",
    source: "حملة جوجل - أبريل",
    nationalIdNumber: "1065432198",
    nationalIdExpiry: "2029-11-20",
    salaryAmount: 22000,
    salaryDate: "26",
    joinDate: "2014-03-15",
    additionalPhones: ["0501234570"],
    hasGuarantor: false,
    stage: "final_review",
    assignedTo: "خالد الدوسري",
    assignedToRole: "employee",
    reviewStatus: "approved",
    reviewDeficiencies: [],
    reviewNote: "ملف ممتاز — جميع البيانات صحيحة ومكتملة",
    reviewedAt: "2026-04-23T09:00:00",
    reviewedBy: "منى الزهراني",
    salaryDefinition: { issueDate: "2026-04-08" },
    creditReport: {
      reportDate: "2026-04-17",
      activeProducts: [
        { id: "p1", type: "قرض شخصي", provider: "بنك الجزيرة", remainingAmount: 55000, paymentStatus: "منتظم", verifiedAmount: 55000 },
      ],
      guaranteedProducts: [],
      bnplProducts: [{ status: "نشط", remainingAmount: 1500 }],
      defaultedProducts: [],
      guaranteedDefaulted: [],
      bouncedChecks: [],
      recentInquiries: [
        { date: "2026-04-05", inquirer: "بنك الرياض", productType: "إعادة تمويل", amount: 120000 },
      ],
      executionDecisions: [],
      defaultSummary: [],
      totalActiveObligations: 56500,
      totalDefaulted: 0,
      creditScore: 740,
    },
    financingOffer: {
      installment: 2150,
      netFinancingAmount: 110000,
      financingType: "إعادة تمويل",
      profitRate: 4.0,
      providerName: "بنك الجزيرة",
      providerProfit: 9800,
    },
    financingCalc: {
      requestedAmount: 120000,
      approvedAmount: 110000,
      profitRate: 4.0,
      months: 60,
      monthlyInstallment: 2150,
      totalAmount: 129000,
      offerPrice: "عرض سعر رقم OS-2026-0416",
    },
    financial: {
      agreementValue: 110000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 700, date: "2026-04-17" },
        { id: "e2", description: "تقرير ائتماني", amount: 150, date: "2026-04-17" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-16T10:00:00", fileType: "image", fileSize: "1.2 MB", url: "#" },
      { id: "a2", name: "كشف الراتب - أبريل 2026", category: "راتب", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-16T10:05:00", fileType: "pdf", fileSize: "0.7 MB", url: "#" },
      { id: "a3", name: "التقرير الائتماني", category: "ائتماني", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-17T09:00:00", fileType: "pdf", fileSize: "2.2 MB", url: "#" },
      { id: "a4", name: "حسبة التمويل", category: "مالي", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-17T10:00:00", fileType: "pdf", fileSize: "0.6 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-16T09:00:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-16T09:30:00" },
      { id: "l3", action: "تغيير المرحلة", performedBy: "خالد الدوسري", role: "employee", timestamp: "2026-04-17T10:30:00", fromStage: "new_request", toStage: "under_study" },
      { id: "l4", action: "تغيير المرحلة", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-19T09:00:00", fromStage: "under_study", toStage: "awaiting_approval" },
      { id: "l5", action: "موافقة العميل", performedBy: "خالد الدوسري", role: "employee", timestamp: "2026-04-21T14:00:00", fromStage: "awaiting_approval", toStage: "final_review", note: "وافق العميل على العرض" },
      { id: "l6", action: "موافقة المدقق", performedBy: "منى الزهراني", role: "auditor", timestamp: "2026-04-23T09:00:00", note: "ملف ممتاز — جميع البيانات صحيحة" },
    ],
  },
  {
    id: "CLT-015",
    fullName: "أحمد سعد البقمي",
    phone: "0555556677",
    city: "الرياض",
    employerType: "مدني",
    employerName: "وزارة المالية",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الراجحي",
    privacyConsent: true,
    submittedAt: "2026-04-20T09:00:00",
    source: "حملة إنستغرام - أبريل",
    nationalIdImage: "https://readdy.ai/api/search-image?query=Saudi%20national%20ID%20card%20document%20flat%20lay%20on%20white%20background%20professional%20scan&width=400&height=260&seq=id2&orientation=landscape",
    nationalIdNumber: "1043210987",
    nationalIdExpiry: "2028-12-20",
    salaryAmount: 11000,
    salaryDate: "25",
    joinDate: "2020-01-15",
    additionalPhones: [],
    hasGuarantor: false,
    stage: "under_study",
    assignedTo: "خالد الدوسري",
    assignedToRole: "employee",
    reviewStatus: "returned",
    reviewDeficiencies: [
      { id: "d1", category: "هوية", description: "صورة الهوية غير واضحة — يرجى إعادة التصوير", severity: "high", resolved: false },
      { id: "d2", category: "راتب", description: "تاريخ إصدار تعريف الراتب منتهي الصلاحية (أكثر من 3 أشهر)", severity: "medium", resolved: false },
      { id: "d3", category: "ائتماني", description: "التقرير الائتماني مفقود — يرجى رفع التقرير الحديث", severity: "high", resolved: false },
    ],
    reviewNote: "الملف يحتوي على 3 نواقص أساسية — يرجى استكمالها قبل إعادة المراجعة",
    reviewedAt: "2026-04-22T10:00:00",
    reviewedBy: "منى الزهراني",
    salaryDefinition: {
      issueDate: "2026-01-10",
    },
    creditReport: {
      reportDate: "2026-04-21",
      activeProducts: [
        { id: "p1", type: "قرض شخصي", provider: "بنك الراجحي", remainingAmount: 25000, paymentStatus: "منتظم", verifiedAmount: 25000 },
      ],
      guaranteedProducts: [],
      bnplProducts: [],
      defaultedProducts: [],
      guaranteedDefaulted: [],
      bouncedChecks: [],
      recentInquiries: [],
      executionDecisions: [],
      defaultSummary: [],
      totalActiveObligations: 25000,
      totalDefaulted: 0,
      creditScore: 680,
    },
    financingCalc: {
      requestedAmount: 50000,
      approvedAmount: 45000,
      profitRate: 4.8,
      months: 48,
      monthlyInstallment: 1050,
      totalAmount: 50400,
      offerPrice: "عرض سعر رقم OS-2026-0420",
    },
    financial: {
      agreementValue: 45000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 400, date: "2026-04-21" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية (غير واضحة)", category: "هوية", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-20T10:30:00", fileType: "image", fileSize: "0.8 MB", url: "#" },
      { id: "a2", name: "تعريف الراتب - يناير 2026", category: "راتب", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-20T10:35:00", fileType: "pdf", fileSize: "0.6 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-20T09:00:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-20T09:30:00", note: "تم تعيين خالد الدوسري" },
      { id: "l3", action: "ردّ الملف للموظف", performedBy: "منى الزهراني", role: "auditor", timestamp: "2026-04-22T10:00:00", note: "3 نواقص — هوية غير واضحة، تعريف راتب منتهي، تقرير ائتماني مفقود" },
    ],
  },
  {
    id: "CLT-016",
    fullName: "سلمى عبدالله العتيبي",
    phone: "0566667788",
    city: "جدة",
    employerType: "عسكري",
    employerName: "وزارة الدفاع",
    serviceType: "تمويل عقاري",
    salaryTransfer: true,
    salaryBank: "البنك الأهلي السعودي",
    privacyConsent: true,
    submittedAt: "2026-04-19T11:00:00",
    source: "حملة جوجل - أبريل",
    nationalIdNumber: "1032109876",
    nationalIdExpiry: "2029-05-15",
    salaryAmount: 20000,
    salaryDate: "25",
    joinDate: "2016-08-01",
    additionalPhones: ["0501234569"],
    hasGuarantor: true,
    guarantor: { name: "عبدالله العتيبي", phone: "0509998877", nationalId: "1021098765", relation: "والد" },
    stage: "under_study",
    assignedTo: "نورة القحطاني",
    assignedToRole: "employee",
    reviewStatus: "approved",
    reviewDeficiencies: [],
    reviewNote: "جميع الوثائق مكتملة والبيانات صحيحة — تمت الموافقة على المراجعة",
    reviewedAt: "2026-04-23T14:00:00",
    reviewedBy: "منى الزهراني",
    salaryDefinition: {
      issueDate: "2026-04-10",
    },
    creditReport: {
      reportDate: "2026-04-20",
      activeProducts: [
        { id: "p1", type: "قرض شخصي", provider: "البنك الأهلي", remainingAmount: 35000, paymentStatus: "منتظم", verifiedAmount: 35000 },
      ],
      guaranteedProducts: [],
      bnplProducts: [{ status: "نشط", remainingAmount: 800 }],
      defaultedProducts: [],
      guaranteedDefaulted: [],
      bouncedChecks: [],
      recentInquiries: [
        { date: "2026-04-10", inquirer: "بنك الرياض", productType: "تمويل عقاري", amount: 500000 },
      ],
      executionDecisions: [],
      defaultSummary: [],
      totalActiveObligations: 35800,
      totalDefaulted: 0,
      creditScore: 750,
    },
    financingCalc: {
      requestedAmount: 500000,
      approvedAmount: 480000,
      profitRate: 3.8,
      months: 240,
      monthlyInstallment: 2890,
      totalAmount: 693600,
      offerPrice: "عرض سعر رقم OS-2026-0419",
    },
    financial: {
      agreementValue: 480000,
      expenses: [
        { id: "e1", description: "رسوم تقييم العقار", amount: 1200, date: "2026-04-20" },
        { id: "e2", description: "رسوم إدارية", amount: 800, date: "2026-04-20" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "نورة القحطاني", uploadedAt: "2026-04-19T12:00:00", fileType: "image", fileSize: "1.4 MB", url: "#" },
      { id: "a2", name: "كشف الراتب - أبريل 2026", category: "راتب", uploadedBy: "نورة القحطاني", uploadedAt: "2026-04-19T12:05:00", fileType: "pdf", fileSize: "0.9 MB", url: "#" },
      { id: "a3", name: "التقرير الائتماني", category: "ائتماني", uploadedBy: "نورة القحطاني", uploadedAt: "2026-04-20T09:00:00", fileType: "pdf", fileSize: "2.0 MB", url: "#" },
      { id: "a4", name: "صورة هوية الكفيل", category: "هوية", uploadedBy: "نورة القحطاني", uploadedAt: "2026-04-20T10:00:00", fileType: "image", fileSize: "1.1 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-19T11:00:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-19T11:30:00", note: "تم تعيين نورة القحطاني" },
      { id: "l3", action: "موافقة المدقق", performedBy: "منى الزهراني", role: "auditor", timestamp: "2026-04-23T14:00:00", note: "جميع الوثائق مكتملة — تمت الموافقة" },
    ],
  },
  {
    id: "CLT-019",
    fullName: "طارق عبدالله المنصور",
    phone: "0512223344",
    city: "الرياض",
    employerType: "مدني",
    employerName: "وزارة المالية",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الراجحي",
    privacyConsent: true,
    submittedAt: "2026-04-23T10:00:00",
    source: "إحالة مباشرة",
    nationalIdNumber: "1099887766",
    nationalIdExpiry: "2027-08-20",
    salaryAmount: 28000,
    salaryDate: "27",
    joinDate: "2010-05-01",
    additionalPhones: [],
    hasGuarantor: false,
    stage: "under_study",
    assignedTo: "سارة المطيري",
    assignedToRole: "employee",
    reviewStatus: "pending",
    reviewDeficiencies: [],
    // طلب اعتماد المدير — حالة استثنائية
    managerApprovalRequested: true,
    managerApprovalRequest: {
      requestedAt: "2026-04-24T09:30:00",
      requestedBy: "أحمد الشمري",
      reason: "مبلغ التمويل المطلوب يتجاوز الحد المعتاد (200,000 ر.س) ويستلزم موافقة مباشرة من المدير قبل المتابعة",
      urgency: "urgent",
    },
    financingCalc: {
      requestedAmount: 200000,
      approvedAmount: 185000,
      profitRate: 4.2,
      months: 84,
      monthlyInstallment: 2680,
      totalAmount: 225120,
      offerPrice: "عرض سعر رقم OS-2026-0423",
    },
    financial: {
      agreementValue: 185000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 900, date: "2026-04-23" },
        { id: "e2", description: "تقرير ائتماني", amount: 150, date: "2026-04-23" },
      ],
      payments: [],
      paymentSchedule: [],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-23T11:00:00", fileType: "image", fileSize: "1.3 MB", url: "#" },
      { id: "a2", name: "كشف الراتب - أبريل 2026", category: "راتب", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-23T11:05:00", fileType: "pdf", fileSize: "0.9 MB", url: "#" },
      { id: "a3", name: "التقرير الائتماني", category: "ائتماني", uploadedBy: "سارة المطيري", uploadedAt: "2026-04-23T12:00:00", fileType: "pdf", fileSize: "2.1 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-23T10:00:00" },
      { id: "l2", action: "تعيين الموظف", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-23T10:30:00", note: "تم تعيين سارة المطيري" },
      { id: "l3", action: "طلب اعتماد المدير", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-24T09:30:00", note: "مبلغ التمويل يتجاوز الحد المعتاد — يستلزم موافقة المدير" },
    ],
  },
  {
    id: "CLT-005",
    fullName: "ريم عبدالعزيز المالكي",
    phone: "0512345678",
    city: "الرياض",
    employerType: "شبه حكومي",
    employerName: "شركة الاتصالات السعودية",
    serviceType: "قرض شخصي",
    salaryTransfer: true,
    salaryBank: "بنك الجزيرة",
    privacyConsent: true,
    submittedAt: "2026-04-10T10:00:00",
    source: "حملة تويتر - أبريل",
    nationalIdNumber: "1054321098",
    nationalIdExpiry: "2030-03-05",
    salaryAmount: 15000,
    salaryDate: "26",
    joinDate: "2019-01-15",
    additionalPhones: [],
    hasGuarantor: false,
    stage: "collection",
    assignedTo: "خالد الدوسري",
    assignedToRole: "employee",
    collectionStatus: "active" as const,
    clientPaymentAmount: 90000,
    paymentAttachments: [
      { id: "pa1", name: "إيصال تحويل أبريل", date: "2026-04-26", paymentAmount: 2100, paymentDate: "2026-04-26" },
    ],
    collectionAttachments: [
      { id: "ca1", name: "ملف تحصيل أبريل", date: "2026-04-26", collectionAmount: 12100 },
    ],
    financial: {
      agreementValue: 90000,
      expenses: [
        { id: "e1", description: "رسوم إدارية", amount: 600, date: "2026-04-11" },
        { id: "e2", description: "تقرير ائتماني", amount: 150, date: "2026-04-11" },
      ],
      payments: [
        { id: "pay1", amount: 10000, date: "2026-04-15", method: "تحويل بنكي", note: "دفعة أولى" },
        { id: "pay2", amount: 2100, date: "2026-04-26", method: "خصم تلقائي", note: "قسط أبريل" },
      ],
      paymentSchedule: [
        { dueDate: "2026-05-26", amount: 2100, status: "قادم" },
        { dueDate: "2026-06-26", amount: 2100, status: "قادم" },
      ],
    },
    attachments: [
      { id: "a1", name: "صورة الهوية الوطنية", category: "هوية", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-10T11:00:00", fileType: "image", fileSize: "1.1 MB", url: "#" },
      { id: "a2", name: "كشف الراتب", category: "راتب", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-10T11:05:00", fileType: "pdf", fileSize: "0.6 MB", url: "#" },
      { id: "a3", name: "عقد التمويل الموقع", category: "عقود", uploadedBy: "خالد الدوسري", uploadedAt: "2026-04-13T14:00:00", fileType: "pdf", fileSize: "2.8 MB", url: "#" },
    ],
    actionLogs: [
      { id: "l1", action: "إنشاء الملف", performedBy: "النظام", role: "employee", timestamp: "2026-04-10T10:00:00" },
      { id: "l2", action: "تغيير المرحلة", performedBy: "خالد الدوسري", role: "employee", timestamp: "2026-04-10T11:30:00", fromStage: "new_request", toStage: "under_study" },
      { id: "l3", action: "تغيير المرحلة", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-11T09:00:00", fromStage: "under_study", toStage: "awaiting_approval" },
      { id: "l4", action: "تغيير المرحلة", performedBy: "خالد الدوسري", role: "employee", timestamp: "2026-04-12T10:00:00", fromStage: "awaiting_approval", toStage: "final_review" },
      { id: "l5", action: "اعتماد المدير", performedBy: "فيصل الزهراني", role: "manager", timestamp: "2026-04-12T14:00:00", fromStage: "final_review", toStage: "signing" },
      { id: "l6", action: "تغيير المرحلة", performedBy: "خالد الدوسري", role: "employee", timestamp: "2026-04-13T14:30:00", fromStage: "signing", toStage: "execution" },
      { id: "l7", action: "تغيير المرحلة", performedBy: "أحمد الشمري", role: "supervisor", timestamp: "2026-04-15T09:00:00", fromStage: "execution", toStage: "collection", note: "تم الصرف وبدأ التحصيل" },
    ],
  },
];

export const specialStatusStats = {
  rejected: 12,
  cancelled: 5,
  completed: 38,
  defaulted: 7,
  partial_default: 4,
};

export const dashboardStats = {
  totalClients: 127,
  newToday: 8,
  pendingApproval: 14,
  activeFiles: 89,
  totalRevenue: 2450000,
  pendingPayments: 380000,
  totalProfit: 185000,
  rejectedThisMonth: 6,
};

export const employees = [
  { id: "emp1", name: "سارة المطيري", role: "employee" as UserRole, assignedCount: 18, avatar: "https://readdy.ai/api/search-image?query=Professional%20Saudi%20woman%20portrait%20headshot%20neutral%20background%20corporate%20attire&width=80&height=80&seq=emp1&orientation=squarish" },
  { id: "emp2", name: "خالد الدوسري", role: "employee" as UserRole, assignedCount: 22, avatar: "https://readdy.ai/api/search-image?query=Professional%20Saudi%20man%20portrait%20headshot%20neutral%20background%20corporate%20attire&width=80&height=80&seq=emp2&orientation=squarish" },
  { id: "emp3", name: "نورة القحطاني", role: "employee" as UserRole, assignedCount: 15, avatar: "https://readdy.ai/api/search-image?query=Professional%20Saudi%20woman%20portrait%20headshot%20neutral%20background%20corporate%20attire&width=80&height=80&seq=emp3&orientation=squarish" },
  { id: "emp4", name: "أحمد الشمري", role: "supervisor" as UserRole, assignedCount: 0, avatar: "https://readdy.ai/api/search-image?query=Professional%20Saudi%20man%20portrait%20headshot%20neutral%20background%20corporate%20attire&width=80&height=80&seq=emp4&orientation=squarish" },
  { id: "emp5", name: "منى الزهراني", role: "auditor" as UserRole, assignedCount: 0, avatar: "https://readdy.ai/api/search-image?query=Professional%20Saudi%20woman%20portrait%20headshot%20neutral%20background%20corporate%20attire&width=80&height=80&seq=emp5&orientation=squarish" },
  { id: "emp6", name: "فيصل الزهراني", role: "manager" as UserRole, assignedCount: 0, avatar: "https://readdy.ai/api/search-image?query=Professional%20Saudi%20man%20portrait%20headshot%20neutral%20background%20corporate%20attire&width=80&height=80&seq=emp6&orientation=squarish" },
];

export type UserStatus = "active" | "inactive" | "suspended";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  assignedCount: number;
  joinedAt: string;
  lastActive: string;
  initials: string;
}

export interface RolePermission {
  key: string;
  label: string;
  description: string;
  roles: Record<UserRole, boolean>;
}

export interface PermissionGroup {
  group: string;
  icon: string;
  permissions: RolePermission[];
}

export const systemUsers: SystemUser[] = [
  { id: "usr1", name: "فيصل الزهراني", email: "faisal@company.sa", phone: "0501112233", role: "manager", status: "active", assignedCount: 0, joinedAt: "2023-01-15", lastActive: "2026-04-24T08:30:00", initials: "فز" },
  { id: "usr2", name: "أحمد الشمري", email: "ahmed@company.sa", phone: "0502223344", role: "supervisor", status: "active", assignedCount: 55, joinedAt: "2023-03-10", lastActive: "2026-04-24T09:15:00", initials: "أش" },
  { id: "usr3", name: "منى الزهراني", email: "mona@company.sa", phone: "0503334455", role: "auditor", status: "active", assignedCount: 0, joinedAt: "2023-06-01", lastActive: "2026-04-23T14:00:00", initials: "مز" },
  { id: "usr4", name: "سارة المطيري", email: "sara@company.sa", phone: "0504445566", role: "employee", status: "active", assignedCount: 18, joinedAt: "2024-01-20", lastActive: "2026-04-24T10:00:00", initials: "سم" },
  { id: "usr5", name: "خالد الدوسري", email: "khalid@company.sa", phone: "0505556677", role: "employee", status: "active", assignedCount: 22, joinedAt: "2024-02-15", lastActive: "2026-04-24T09:45:00", initials: "خد" },
  { id: "usr6", name: "نورة القحطاني", email: "noura@company.sa", phone: "0506667788", role: "employee", status: "active", assignedCount: 15, joinedAt: "2024-04-01", lastActive: "2026-04-23T16:30:00", initials: "نق" },
  { id: "usr7", name: "عمر البقمي", email: "omar@company.sa", phone: "0507778899", role: "employee", status: "inactive", assignedCount: 0, joinedAt: "2024-05-10", lastActive: "2026-03-15T11:00:00", initials: "عب" },
  { id: "usr8", name: "ليلى الحربي", email: "layla@company.sa", phone: "0508889900", role: "supervisor", status: "suspended", assignedCount: 0, joinedAt: "2023-09-01", lastActive: "2026-04-10T08:00:00", initials: "له" },
];

export const permissionGroups: PermissionGroup[] = [
  {
    group: "ملفات العملاء",
    icon: "ri-folder-user-line",
    permissions: [
      { key: "view_clients", label: "عرض ملفات العملاء", description: "الاطلاع على قائمة وتفاصيل ملفات العملاء", roles: { employee: true, supervisor: true, auditor: true, manager: true } },
      { key: "create_client", label: "إنشاء ملف عميل", description: "إضافة عملاء جدد يدوياً", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
      { key: "edit_client_basic", label: "تعديل البيانات الأساسية", description: "تعديل بيانات العميل الأساسية والمالية", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
      { key: "edit_client_final_review", label: "تعديل في مرحلة المراجعة النهائية", description: "صلاحية التعديل في مرحلة المراجعة النهائية فقط", roles: { employee: false, supervisor: true, auditor: false, manager: true } },
      { key: "delete_client", label: "حذف ملف عميل", description: "حذف ملفات العملاء نهائياً", roles: { employee: false, supervisor: false, auditor: false, manager: true } },
    ],
  },
  {
    group: "مسار العمل والمراحل",
    icon: "ri-flow-chart",
    permissions: [
      { key: "advance_stage", label: "تقديم الملف للمرحلة التالية", description: "نقل الملف من مرحلة لأخرى", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
      { key: "reject_file", label: "رفض الملف", description: "رفض الملف مع ذكر السبب", roles: { employee: false, supervisor: true, auditor: false, manager: true } },
      { key: "approve_final", label: "الاعتماد النهائي (المدير)", description: "اعتماد الملف في مرحلة المراجعة النهائية", roles: { employee: false, supervisor: false, auditor: false, manager: true } },
      { key: "assign_clients", label: "توزيع العملاء على الموظفين", description: "تعيين الملفات للموظفين", roles: { employee: false, supervisor: true, auditor: false, manager: true } },
      { key: "transfer_to_executor", label: "تحويل للمنفذ", description: "تحويل الملف للمنفذ بعد اعتماد المدير", roles: { employee: false, supervisor: true, auditor: false, manager: true } },
    ],
  },
  {
    group: "المرفقات والوثائق",
    icon: "ri-attachment-2",
    permissions: [
      { key: "upload_attachments", label: "رفع المرفقات", description: "رفع ملفات ووثائق للملف", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
      { key: "delete_attachments", label: "حذف المرفقات", description: "حذف المرفقات المرفوعة", roles: { employee: false, supervisor: true, auditor: false, manager: true } },
      { key: "review_documents", label: "مراجعة الوثائق", description: "مراجعة الوثائق وقبولها أو ردّها", roles: { employee: false, supervisor: true, auditor: true, manager: true } },
      { key: "upload_contracts", label: "رفع العقود", description: "رفع العقود للتوقيع أو الموقّعة", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
    ],
  },
  {
    group: "الإدارة المالية",
    icon: "ri-money-dollar-circle-line",
    permissions: [
      { key: "view_financial", label: "عرض البيانات المالية", description: "الاطلاع على الأرقام والحسابات المالية", roles: { employee: true, supervisor: true, auditor: true, manager: true } },
      { key: "edit_financial", label: "تعديل البيانات المالية", description: "إدخال وتعديل قيمة الاتفاق والمصروفات", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
      { key: "record_payments", label: "تسجيل المدفوعات", description: "إضافة دفعات وتحديث سجل المدفوعات", roles: { employee: true, supervisor: true, auditor: false, manager: true } },
      { key: "view_reports", label: "عرض التقارير المالية", description: "الاطلاع على التقارير المالية الشاملة", roles: { employee: false, supervisor: true, auditor: true, manager: true } },
    ],
  },
  {
    group: "التقارير والإحصائيات",
    icon: "ri-bar-chart-2-line",
    permissions: [
      { key: "view_operational_reports", label: "التقارير التشغيلية", description: "عرض تقارير الطلبات والمراحل", roles: { employee: false, supervisor: true, auditor: true, manager: true } },
      { key: "export_reports", label: "تصدير التقارير", description: "تصدير التقارير بصيغ مختلفة", roles: { employee: false, supervisor: false, auditor: false, manager: true } },
      { key: "view_special_status", label: "عرض الحالات الخاصة", description: "الاطلاع على الملفات المرفوضة والمتعثرة", roles: { employee: false, supervisor: true, auditor: true, manager: true } },
    ],
  },
  {
    group: "إدارة النظام",
    icon: "ri-settings-3-line",
    permissions: [
      { key: "manage_users", label: "إدارة المستخدمين", description: "إضافة وتعديل وتعطيل المستخدمين", roles: { employee: false, supervisor: false, auditor: false, manager: true } },
      { key: "manage_roles", label: "إدارة الأدوار والصلاحيات", description: "تعديل صلاحيات الأدوار", roles: { employee: false, supervisor: false, auditor: false, manager: true } },
      { key: "manage_landing_page", label: "إدارة صفحة الهبوط", description: "تعديل محتوى صفحة الهبوط", roles: { employee: false, supervisor: false, auditor: false, manager: true } },
      { key: "view_audit_log", label: "سجل التدقيق الكامل", description: "الاطلاع على سجل جميع الإجراءات في النظام", roles: { employee: false, supervisor: false, auditor: true, manager: true } },
    ],
  },
];

export const notifications = [
  { id: "n1", type: "new_request", message: "طلب جديد من عبدالرحمن الشهري", time: "منذ 5 دقائق", read: false, targetRole: "employee" },
  { id: "n2", type: "pending_approval", message: "ملف محمد الغامدي بانتظار الاعتماد", time: "منذ 30 دقيقة", read: false, targetRole: "manager" },
  { id: "n3", type: "rejection", message: "تم رفض ملف سلمى العمري - السبب: نقص في المستندات", time: "منذ ساعة", read: false, targetRole: "employee" },
  { id: "n4", type: "payment_due", message: "متأخرات مالية: ريم المالكي - قسط مايو", time: "منذ 2 ساعة", read: true, targetRole: "manager" },
  { id: "n5", type: "data_complete", message: "اكتملت بيانات فاطمة العتيبي", time: "منذ 3 ساعات", read: true, targetRole: "supervisor" },
  { id: "n6", type: "manager_approval", message: "اعتمد المدير ملف سلطان الحربي - يرجى تحويله للتنفيذ", time: "منذ 4 ساعات", read: true, targetRole: "supervisor" },
  { id: "n7", type: "new_request", message: "طلب جديد من لطيفة الشمري", time: "منذ 5 ساعات", read: true, targetRole: "employee" },
];

export const reportsData = {
  operational: {
    byPeriod: [
      { period: "يناير 2026", count: 18 },
      { period: "فبراير 2026", count: 24 },
      { period: "مارس 2026", count: 31 },
      { period: "أبريل 2026", count: 27 },
    ],
    byCity: [
      { city: "الرياض", count: 52 },
      { city: "جدة", count: 38 },
      { city: "الدمام", count: 21 },
      { city: "مكة المكرمة", count: 16 },
    ],
    byEmployerType: [
      { type: "مدني", count: 45 },
      { type: "عسكري", count: 28 },
      { type: "شبه حكومي", count: 22 },
      { type: "قطاع خاص", count: 18 },
      { type: "متقاعد", count: 14 },
    ],
    byServiceType: [
      { service: "قرض شخصي", count: 58 },
      { service: "تمويل عقاري", count: 32 },
      { service: "تمويل مركبات", count: 21 },
      { service: "إعادة تمويل", count: 16 },
    ],
    stageStatus: [
      { stage: "طلب جديد", count: 3 },
      { stage: "تحت الدراسة", count: 8 },
      { stage: "بانتظار موافقة العميل", count: 5 },
      { stage: "مراجعة نهائية", count: 4 },
      { stage: "توقيع العقود", count: 6 },
      { stage: "تنفيذ", count: 12 },
      { stage: "التحصيل", count: 45 },
      { stage: "أرشفة", count: 44 },
    ],
    rejectionReasons: [
      { reason: "السجل الائتماني ضعيف", count: 18 },
      { reason: "نقص في المستندات", count: 12 },
      { reason: "الراتب لا يكفي", count: 9 },
      { reason: "عدم استيفاء الشروط", count: 7 },
      { reason: "طلب العميل الإلغاء", count: 5 },
    ],
  },
  financial: {
    totalPayments: 1850000,
    pendingAmounts: 380000,
    totalExpenses: 125000,
    totalProfit: 185000,
    byMonth: [
      { month: "يناير", payments: 320000, expenses: 28000, profit: 38000 },
      { month: "فبراير", payments: 410000, expenses: 32000, profit: 45000 },
      { month: "مارس", payments: 580000, expenses: 38000, profit: 62000 },
      { month: "أبريل", payments: 540000, expenses: 27000, profit: 40000 },
    ],
  },
};
