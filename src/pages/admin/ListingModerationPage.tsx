import MainLayout from "../../components/layout/MainLayout";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  FileEdit,
  Building2,
  Clock3,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getListingStats
} from "../../services/adminService";



export default function ListingModerationPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listings, setListings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] =
  useState("");

const [selectedStatus] =
  useState("ALL");

const [stats, setStats] = useState({
  totalListings: 0,
  pendingListings: 0,
  approvedListings: 0,
  rejectedListings: 0,
});

const loadStats = async () => {
  try {
    const data = await getListingStats();
    setStats(data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  // eslint-disable-next-line react-hooks/immutability
  loadProperties();
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadStats();
}, []);

const loadProperties = async () => {
  try {
    const data =
      await getPendingProperties();

    setListings(data);
  } catch (err) {
    console.error(err);
  }
};
const handleApprove = async (
  propertyId: number
) => {
  try {
    await approveProperty(propertyId);

    loadProperties();
    loadStats();

    alert("Property Approved");
  } catch (err) {
    console.error(err);
  }
};
const handleReject = async (
  propertyId: number
) => {
  try {
    await rejectProperty(propertyId);

    loadProperties();
    loadStats();

    alert("Property Rejected");
  } catch (err) {
    console.error(err);
  }
};
const filteredListings = listings.filter(
  (listing) => {

    const matchesSearch =
      listing.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      listing.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" ||
      listing.listingStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  }
);

  return (
    <MainLayout role="admin" title="Listing Moderation">
      <div className="animate-slide-up space-y-6 font-sans text-left">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-800">
            Listing Moderation Queue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review agent-submitted listings, verify specifications, and grant approval for marketplace publication.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Platform Listings", value: stats.totalListings, icon: Building2, color: "text-blue-600 bg-blue-50/50" },
            { label: "Pending Reviews", value: stats.pendingListings, icon: Clock3, color: "text-amber-500 bg-amber-50/50" },
            { label: "Approved Listings", value: stats.approvedListings, icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50/50" },
            { label: "Rejected / Suspended", value: stats.rejectedListings, icon: AlertTriangle, color: "text-rose-600 bg-rose-50/50" },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-premium-soft flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-xl ${kpi.color}`}>
                    <Icon size={14} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-800 mt-4 leading-none">
                  {kpi.value}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-premium-soft flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              type="text"
              placeholder="Search by property title, agent, location..."
              className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs bg-slate-50/50 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all">
              All
            </button>
            {["Pending", "Approved", "Rejected", "Revision Required"].map((status) => (
              <button key={status} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all">
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100">
                <tr className="text-slate-500 font-semibold text-left">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((listing) => (
                  <tr key={listing.propertyId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-800">{listing.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">ID: LST-00{listing.propertyId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{listing.propertyType}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{listing.city}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">₹ {Number(listing.price).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">Agent #{listing.agentId}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(
 listing.createdAt
).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          listing.listingStatus === "PENDING_REVIEW"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : listing.listingStatus === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
}`}
                      >
                        {listing.listingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end">
                        <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors" title="Review documentation">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50 text-emerald-600 transition-colors" title="Approve listing" onClick={() =>
    handleApprove(listing.propertyId)
  }>
                          <CheckCircle2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/20 hover:bg-rose-50 text-rose-600 transition-colors" title="Reject listing"  onClick={() =>
    handleReject(listing.propertyId)
  }>
                          <XCircle size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg border border-blue-100 bg-blue-50/20 hover:bg-blue-50 text-blue-600 transition-colors" title="Request revision">
                          <FileEdit size={14} />
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