import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  mockClients,
  employees,
  type Client,
  type ClientStage,
  type UserRole,
} from "@/mocks/dashboardData";

/** تحويل صف Supabase إلى Client */
function rowToClient(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    phone: row.phone as string,
    whatsapp: row.whatsapp as string | undefined,
    city: row.city as string,
    employerType: row.employer_type as string,
    employerName: row.employer_name as string,
    serviceType: row.service_type as string,
    salaryTransfer: row.salary_transfer as boolean,
    salaryBank: row.salary_bank as string | undefined,
    privacyConsent: row.privacy_consent as boolean,
    submittedAt: row.submitted_at as string,
    source: row.source as string,
    nationalIdImage: row.national_id_image as string | undefined,
    nationalIdNumber: row.national_id_number as string | undefined,
    nationalIdExpiry: row.national_id_expiry as string | undefined,
    salaryAmount: row.salary_amount as number | undefined,
    salaryDate: row.salary_date as string | undefined,
    joinDate: row.join_date as string | undefined,
    additionalPhones: (row.additional_phones as string[]) ?? [],
    hasGuarantor: row.has_guarantor as boolean,
    guarantor: row.guarantor as Client["guarantor"],
    guarantorCreditReport: row.guarantor_credit_report as Client["guarantorCreditReport"],
    guarantorIdImage: row.guarantor_id_image as string | undefined,
    salaryDefinition: row.salary_definition as Client["salaryDefinition"],
    stage: row.stage as ClientStage,
    assignedTo: row.assigned_to as string | undefined,
    assignedToRole: row.assigned_to_role as UserRole | undefined,
    rejectionReason: row.rejection_reason as string | undefined,
    specialStatus: row.special_status as Client["specialStatus"],
    specialStatusReason: row.special_status_reason as string | undefined,
    specialStatusDate: row.special_status_date as string | undefined,
    reviewStatus: row.review_status as Client["reviewStatus"],
    reviewDeficiencies: (row.review_deficiencies as Client["reviewDeficiencies"]) ?? [],
    reviewNote: row.review_note as string | undefined,
    reviewedAt: row.reviewed_at as string | undefined,
    reviewedBy: row.reviewed_by as string | undefined,
    managerApprovalRequested: row.manager_approval_requested as boolean | undefined,
    managerApprovalRequest: row.manager_approval_request as Client["managerApprovalRequest"],
    managerApprovalDecision: row.manager_approval_decision as Client["managerApprovalDecision"],
    managerApprovalNote: row.manager_approval_note as string | undefined,
    creditReport: row.credit_report as Client["creditReport"],
    financingOffer: row.financing_offer as Client["financingOffer"],
    financingCalc: row.financing_calc as Client["financingCalc"],
    financial: row.financial as Client["financial"],
    contracts: (row.contracts as Client["contracts"]) ?? [],
    paymentAttachments: (row.payment_attachments as Client["paymentAttachments"]) ?? [],
    clientPaymentAmount: row.client_payment_amount as number | undefined,
    collectionAttachments: (row.collection_attachments as Client["collectionAttachments"]) ?? [],
    collectionStatus: row.collection_status as Client["collectionStatus"],
    attachments: (row.attachments as Client["attachments"]) ?? [],
    actionLogs: (row.action_logs as Client["actionLogs"]) ?? [],
  };
}

/** تحويل Client إلى صف Supabase */
function clientToRow(client: Client): Record<string, unknown> {
  return {
    id: client.id,
    full_name: client.fullName,
    phone: client.phone,
    whatsapp: client.whatsapp ?? null,
    city: client.city,
    employer_type: client.employerType,
    employer_name: client.employerName,
    service_type: client.serviceType,
    salary_transfer: client.salaryTransfer,
    salary_bank: client.salaryBank ?? null,
    privacy_consent: client.privacyConsent,
    submitted_at: client.submittedAt,
    source: client.source,
    national_id_image: client.nationalIdImage ?? null,
    national_id_number: client.nationalIdNumber ?? null,
    national_id_expiry: client.nationalIdExpiry ?? null,
    salary_amount: client.salaryAmount ?? null,
    salary_date: client.salaryDate ?? null,
    join_date: client.joinDate ?? null,
    additional_phones: client.additionalPhones ?? [],
    has_guarantor: client.hasGuarantor,
    guarantor: client.guarantor ?? null,
    guarantor_credit_report: client.guarantorCreditReport ?? null,
    guarantor_id_image: client.guarantorIdImage ?? null,
    salary_definition: client.salaryDefinition ?? null,
    stage: client.stage,
    assigned_to: client.assignedTo ?? null,
    assigned_to_role: client.assignedToRole ?? null,
    rejection_reason: client.rejectionReason ?? null,
    special_status: client.specialStatus ?? null,
    special_status_reason: client.specialStatusReason ?? null,
    special_status_date: client.specialStatusDate ?? null,
    review_status: client.reviewStatus ?? null,
    review_deficiencies: client.reviewDeficiencies ?? [],
    review_note: client.reviewNote ?? null,
    reviewed_at: client.reviewedAt ?? null,
    reviewed_by: client.reviewedBy ?? null,
    manager_approval_requested: client.managerApprovalRequested ?? false,
    manager_approval_request: client.managerApprovalRequest ?? null,
    manager_approval_decision: client.managerApprovalDecision ?? null,
    manager_approval_note: client.managerApprovalNote ?? null,
    credit_report: client.creditReport ?? null,
    financing_offer: client.financingOffer ?? null,
    financing_calc: client.financingCalc ?? null,
    financial: client.financial ?? null,
    contracts: client.contracts ?? [],
    payment_attachments: client.paymentAttachments ?? [],
    client_payment_amount: client.clientPaymentAmount ?? null,
    collection_attachments: client.collectionAttachments ?? [],
    collection_status: client.collectionStatus ?? null,
    attachments: client.attachments ?? [],
    action_logs: client.actionLogs ?? [],
  };
}

/** خوارزمية التوزيع التلقائي */
function pickLeastLoadedEmployee(clients: Client[]): { name: string; role: UserRole } | null {
  const activeEmployees = employees.filter((e) => e.role === "employee");
  if (activeEmployees.length === 0) return null;

  const workload = activeEmployees.map((emp) => ({
    name: emp.name,
    role: emp.role as UserRole,
    count: clients.filter((c) => c.assignedTo === emp.name && !c.specialStatus).length,
  }));

  workload.sort((a, b) => a.count - b.count);
  return workload[0];
}

export interface NewClientInput {
  fullName: string;
  phone: string;
  whatsapp?: string;
  city: string;
  employerType: string;
  employerName: string;
  serviceType: string;
  salaryTransfer: boolean;
  salaryBank?: string;
  source: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل العملاء من Supabase
  useEffect(() => {
    let mounted = true;

    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (mounted) {
          if (data && data.length > 0) {
            setClients(data.map((row) => rowToClient(row as Record<string, unknown>)));
          } else {
            // أول تشغيل — نزرع البيانات التجريبية
            await seedMockData();
          }
        }
      } catch {
        // fallback للبيانات التجريبية
        if (mounted) setClients(mockClients);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchClients();

    // Realtime subscription
    const channel = supabase
      .channel("clients_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "clients" }, (payload) => {
        if (!mounted) return;
        if (payload.eventType === "INSERT") {
          const newClient = rowToClient(payload.new as Record<string, unknown>);
          setClients((prev) => [newClient, ...prev.filter((c) => c.id !== newClient.id)]);
        } else if (payload.eventType === "UPDATE") {
          const updated = rowToClient(payload.new as Record<string, unknown>);
          setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        } else if (payload.eventType === "DELETE") {
          setClients((prev) => prev.filter((c) => c.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  /** زرع البيانات التجريبية في Supabase */
  const seedMockData = async () => {
    try {
      const rows = mockClients.map(clientToRow);
      const { error } = await supabase.from("clients").insert(rows);
      if (!error) {
        setClients(mockClients);
        // تحديث العداد
        await supabase
          .from("client_counter")
          .update({ current_value: 20 })
          .eq("id", 1);
      }
    } catch {
      setClients(mockClients);
    }
  };

  /** الحصول على ID العميل التالي */
  const getNextClientId = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.rpc("get_next_client_id");
      if (error || !data) throw error;
      return data as string;
    } catch {
      const counter = clients.length + 21;
      return `CLT-${String(counter).padStart(3, "0")}`;
    }
  };

  /** إنشاء ملف عميل جديد */
  const createClientFromLanding = useCallback(
    async (input: NewClientInput): Promise<{ client: Client; assignedTo: string | null }> => {
      const clientId = await getNextClientId();
      const now = new Date().toISOString();
      const assigned = pickLeastLoadedEmployee(clients);

      const newClient: Client = {
        id: clientId,
        fullName: input.fullName,
        phone: input.phone,
        whatsapp: input.whatsapp,
        city: input.city,
        employerType: input.employerType,
        employerName: input.employerName,
        serviceType: input.serviceType,
        salaryTransfer: input.salaryTransfer,
        salaryBank: input.salaryBank,
        privacyConsent: true,
        submittedAt: now,
        source: input.source,
        hasGuarantor: false,
        stage: "new_request" as ClientStage,
        assignedTo: assigned?.name,
        assignedToRole: assigned?.role,
        attachments: [],
        actionLogs: [
          {
            id: `${clientId}-l1`,
            action: "إنشاء الملف",
            performedBy: "النظام",
            role: "employee" as UserRole,
            timestamp: now,
            note: "تم إنشاء الملف تلقائياً من صفحة الهبوط",
          },
          ...(assigned
            ? [
                {
                  id: `${clientId}-l2`,
                  action: "تعيين تلقائي",
                  performedBy: "النظام",
                  role: "supervisor" as UserRole,
                  timestamp: now,
                  note: `تم التعيين التلقائي لـ ${assigned.name}`,
                },
              ]
            : []),
        ],
      };

      try {
        const { error } = await supabase.from("clients").insert(clientToRow(newClient));
        if (error) throw error;
      } catch {
        // fallback محلي
        setClients((prev) => [newClient, ...prev]);
      }

      return { client: newClient, assignedTo: assigned?.name ?? null };
    },
    [clients]
  );

  /** تحديث عميل في Supabase */
  const updateClient = useCallback(async (clientId: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c))
    );

    const current = clients.find((c) => c.id === clientId);
    if (!current) return;

    const merged = { ...current, ...updates };
    const row = clientToRow(merged);

    try {
      await supabase.from("clients").update(row).eq("id", clientId);
    } catch {
      // ignore — state already updated
    }
  }, [clients]);

  /** تعيين عميل لموظف */
  const assignClient = useCallback(
    async (clientId: string, employeeName: string, employeeRole: UserRole, performedBy: string) => {
      const now = new Date().toISOString();
      const current = clients.find((c) => c.id === clientId);
      if (!current) return;

      const newLog = {
        id: `${clientId}-assign-${Date.now()}`,
        action: "تعيين الموظف",
        performedBy,
        role: "supervisor" as UserRole,
        timestamp: now,
        note: `تم تعيين ${employeeName}`,
      };

      await updateClient(clientId, {
        assignedTo: employeeName,
        assignedToRole: employeeRole,
        actionLogs: [...current.actionLogs, newLog],
      });
    },
    [clients, updateClient]
  );

  /** توزيع تلقائي */
  const autoDistribute = useCallback(
    async (clientIds: string[], performedBy: string): Promise<Record<string, string>> => {
      const now = new Date().toISOString();
      const assignments: Record<string, string> = {};
      let currentClients = [...clients];

      for (const id of clientIds) {
        const assigned = pickLeastLoadedEmployee(currentClients);
        if (!assigned) continue;
        assignments[id] = assigned.name;

        const current = currentClients.find((c) => c.id === id);
        if (!current) continue;

        const newLog = {
          id: `${id}-auto-${Date.now()}`,
          action: "تعيين تلقائي",
          performedBy,
          role: "supervisor" as UserRole,
          timestamp: now,
          note: `توزيع تلقائي لـ ${assigned.name}`,
        };

        const updated = {
          ...current,
          assignedTo: assigned.name,
          assignedToRole: assigned.role,
          actionLogs: [...current.actionLogs, newLog],
        };

        currentClients = currentClients.map((c) => (c.id === id ? updated : c));
        await updateClient(id, {
          assignedTo: assigned.name,
          assignedToRole: assigned.role,
          actionLogs: updated.actionLogs,
        });
      }

      setClients(currentClients);
      return assignments;
    },
    [clients, updateClient]
  );

  /** تحديث مرحلة العميل */
  const updateStage = useCallback(
    async (
      clientId: string,
      newStage: ClientStage,
      performedBy: string,
      role: UserRole,
      note?: string
    ) => {
      const now = new Date().toISOString();
      const current = clients.find((c) => c.id === clientId);
      if (!current) return;

      const newLog = {
        id: `${clientId}-stage-${Date.now()}`,
        action: "تغيير المرحلة",
        performedBy,
        role,
        timestamp: now,
        fromStage: current.stage,
        toStage: newStage,
        note,
      };

      await updateClient(clientId, {
        stage: newStage,
        actionLogs: [...current.actionLogs, newLog],
      });
    },
    [clients, updateClient]
  );

  const getClientById = useCallback(
    (id: string) => clients.find((c) => c.id === id) ?? null,
    [clients]
  );

  const unassignedClients = clients.filter(
    (c) => !c.assignedTo && !c.specialStatus && c.stage === "new_request"
  );

  const assignedClients = clients.filter((c) => c.assignedTo && !c.specialStatus);

  return {
    clients,
    isLoading,
    unassignedClients,
    assignedClients,
    createClientFromLanding,
    assignClient,
    autoDistribute,
    updateStage,
    updateClient,
    getClientById,
  };
}
