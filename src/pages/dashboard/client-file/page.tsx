import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import ClientHeader from "./components/ClientHeader";
import BasicInfoTab from "./components/BasicInfoTab";
import FinancingOfferTab from "./components/FinancingOfferTab";
import ExecutionTab from "./components/ExecutionTab";
import CollectionTab from "./components/CollectionTab";
import AttachmentsTab from "./components/AttachmentsTab";
import { useClients } from "@/hooks/useClients";
import { type ClientStage } from "@/mocks/dashboardData";

interface Tab {
  id: string;
  label: string;
  icon: string;
  stages: ClientStage[];
}

const allTabs: Tab[] = [
  {
    id: "basic",
    label: "البيانات الأساسية",
    icon: "ri-user-line",
    stages: ["new_request", "under_study", "awaiting_approval", "final_review", "signing", "execution", "collection", "archived"],
  },
  {
    id: "financing",
    label: "عرض التمويل والعقود",
    icon: "ri-calculator-line",
    stages: ["under_study", "awaiting_approval", "final_review", "signing", "execution", "collection", "archived"],
  },
  {
    id: "execution",
    label: "مرفقات السداد",
    icon: "ri-money-dollar-circle-line",
    stages: ["execution", "collection", "archived"],
  },
  {
    id: "collection",
    label: "التحصيل",
    icon: "ri-funds-line",
    stages: ["collection", "archived"],
  },
  {
    id: "attachments",
    label: "المرفقات والسجل",
    icon: "ri-attachment-line",
    stages: ["new_request", "under_study", "awaiting_approval", "final_review", "signing", "execution", "collection", "archived"],
  },
];

export default function ClientFilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const { getClientById } = useClients();

  const client = getClientById(id ?? "");

  if (!client) {
    return (
      <DashboardLayout title="ملف العميل">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <i className="ri-folder-open-line text-4xl text-gray-200 dark:text-gray-700"></i>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">لم يتم العثور على الملف</p>
          <button
            onClick={() => navigate("/dashboard/clients")}
            className="px-4 py-2 bg-brand-500 text-white text-sm rounded-lg cursor-pointer"
          >
            العودة للقائمة
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const visibleTabs = allTabs.filter((t) => t.stages.includes(client.stage));

  // Ensure active tab is valid for current stage
  const validActiveTab = visibleTabs.find(t => t.id === activeTab) ? activeTab : visibleTabs[0]?.id ?? "basic";

  const handleStageChange = (stage: ClientStage) => {
    console.log("Stage changed to:", stage);
  };

  return (
    <DashboardLayout title={`ملف العميل — ${client.fullName}`}>
      {/* Client Header */}
      <ClientHeader client={client} onStageChange={handleStageChange} />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-1 mb-5 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              validActiveTab === tab.id
                ? "bg-brand-500 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${tab.icon} text-sm`}></i>
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {validActiveTab === "basic" && <BasicInfoTab client={client} />}
      {validActiveTab === "financing" && <FinancingOfferTab client={client} />}
      {validActiveTab === "execution" && <ExecutionTab client={client} />}
      {validActiveTab === "collection" && <CollectionTab client={client} />}
      {validActiveTab === "attachments" && <AttachmentsTab client={client} />}
    </DashboardLayout>
  );
}
