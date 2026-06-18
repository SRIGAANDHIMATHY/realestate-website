/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  verifyAgent,
  suspendAgent} from "../../services/adminService";

import {
  Search,
  Eye,
  Pencil,
  ShieldCheck,
  Ban,
  UserPlus,
} from "lucide-react";



export default function AgentManagementPage() {
  const [agents, setAgents] = useState<any[]>([]);
const [filteredAgents, setFilteredAgents] = useState<any[]>([]);
const [statusFilter, setStatusFilter] = useState("All");
const [stats, setStats] = useState({
  totalAgents: 0,
  verifiedAgents: 0,
  pendingAgents: 0,
  suspendedAgents: 0,
});
const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
  // eslint-disable-next-line react-hooks/immutability
  loadAgents();
}, []);

const loadAgents = async () => {
  try {
    // Load all users
    const users = await getAllUsers();

    // Keep only agents
    const agentUsers = users.filter(
      (u: any) =>
        u.role?.toUpperCase() === "AGENT"
    );

    setAgents(agentUsers);
    setFilteredAgents(agentUsers);

    // Load KPI statistics

    setStats({
  totalAgents: agentUsers.length,

  verifiedAgents: agentUsers.filter(
    (a: any) => a.status === "VERIFIED"
  ).length,

  pendingAgents: agentUsers.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any) => a.status === "PENDING"
  ).length,

  suspendedAgents: agentUsers.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any) => a.status === "SUSPENDED"
  ).length,
});

  } catch (error) {
    console.error("Failed to load agents:", error);
  }
};

useEffect(() => {
  let filtered = agents.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (agent: any) =>
      agent.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      agent.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter !== "All") {
    filtered = filtered.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (agent: any) =>
        agent.status?.toUpperCase() === statusFilter.toUpperCase()
    );
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setFilteredAgents(filtered);
}, [search, agents, statusFilter]);

const handleVerify = async (
  userId: number
) => {
  try {
    await verifyAgent(userId);
    loadAgents();
    alert("Agent Verified");
  } catch (err) {
    console.error(err);
  }
};

const handleSuspend = async (
  userId: number
) => {
  try {
    await suspendAgent(userId);
    loadAgents();
    alert("Agent Suspended");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <MainLayout role="admin" title="Agent Management">
      <div className="animate-slide-up space-y-6 font-sans text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-800">
              Agent Registry
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verify credentials, manage active listings permissions, and monitor agent ratings.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/agents/new")}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <UserPlus size={16} />
            Register Agent
          </button>
        </div>

        {/* Statistics panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Platform Agents", value:stats.totalAgents , color: "text-slate-800" },
            { label: "Verified Partners", value: stats.verifiedAgents , color: "text-emerald-600" },
            { label: "Verification Requests", value: stats.pendingAgents, color: "text-amber-500" },
            { label: "Suspended Accounts", value: stats.suspendedAgents, color: "text-rose-600" },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-premium-soft">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </p>
              <h3 className={`text-2xl font-bold font-heading mt-3 leading-none ${kpi.color}`}>
                {kpi.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-premium-soft flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)}
              placeholder="Search agents by name, agency..."
              className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                statusFilter === "All"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600"
              }`}
            >
              All
            </button>
            {["Verified", "Pending", "Suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100">
                <tr className="text-slate-500 font-semibold text-left">
                  <th className="px-6 py-4">Agent Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAgents.map((agent) => (
                  <tr key={agent.userId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
                          {agent.fullName
                            ?.split(" ")
                            .map((w: string) => w[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{agent.fullName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">ID: AG-{agent.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{agent.email}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{agent.phone}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{agent.role}</td>
                    <div className="px-6 py-4 text-slate-500 font-medium">
                        User ID: {agent.userId}
                      </div>
                    <td className="px-6 py-4">
                      <span
  className="px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-600 border-emerald-100"
>
  {agent.status}
</span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-1.5 justify-end">

                          {/* View */}
                          <button
                            onClick={() =>
                              alert(
                                `Agent: ${agent.fullName}\nEmail: ${agent.email}\nPhone: ${agent.phone}`
                              )
                            }
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
                            title="View Profile"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() =>
                              navigate(`/admin/agents/edit/${agent.userId}`)
                            }
                            className="p-1.5 rounded-lg border border-blue-100 bg-blue-50/20 hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit Agent"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Verify */}
                          <button
                              onClick={() =>
                                handleVerify(agent.userId)
                              }
                              className="p-1.5 rounded-lg border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50 text-emerald-600 transition-colors"
                            >
                              <ShieldCheck size={14} />
                            </button>

                          {/* Suspend */}
                          <button
                            onClick={() =>
                              handleSuspend(agent.userId)
                            }
                            className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/20 hover:bg-rose-50 text-rose-600 transition-colors"
                          >
                            <Ban size={14} />
                          </button>

                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}