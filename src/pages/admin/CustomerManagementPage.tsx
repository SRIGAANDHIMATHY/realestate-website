import MainLayout from "../../components/layout/MainLayout";
import {
  Search,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Customer {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  status: string;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
}

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    suspendedCustomers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadCustomers();
    // eslint-disable-next-line react-hooks/immutability
    loadStats();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await fetch(
        "https://realestate-backend-bph9.onrender.com/api/admin/customers"
      );

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(
        "https://realestate-backend-bph9.onrender.com/api/admin/customers/stats"
      );

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const suspendCustomer = async (id: number) => {
    try {
      await fetch(
        `https://realestate-backend-bph9.onrender.com/api/admin/customers/${id}/suspend`,
        {
          method: "PUT",
        }
      );

      loadCustomers();
      loadStats();
    } catch (error) {
      console.error(error);
    }
  };

  const activateCustomer = async (id: number) => {
    try {
      await fetch(
        `https://realestate-backend-bph9.onrender.com/api/admin/customers/${id}/activate`,
        {
          method: "PUT",
        }
      );

      loadCustomers();
      loadStats();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.phone?.includes(search)
  );

  return (
    <MainLayout role="admin" title="Customer Management">
      <div className="animate-slide-up space-y-6 font-sans text-left">

        <div>
          <h2 className="text-xl font-bold font-heading text-slate-800">
            Customer Directory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer accounts and account status.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-premium-soft">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Total Customers
            </p>
            <h3 className="text-2xl font-bold mt-3">
              {stats.totalCustomers}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-premium-soft">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Active Customers
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-3">
              {stats.activeCustomers}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-premium-soft">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Suspended Customers
            </p>
            <h3 className="text-2xl font-bold text-rose-600 mt-3">
              {stats.suspendedCustomers}
            </h3>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-premium-soft">
          <div className="relative w-full md:w-96">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs bg-slate-50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">

              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.userId}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold">
                          {customer.fullName}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {customer.email}
                      </td>

                      <td className="px-6 py-4">
                        {customer.phone}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            customer.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            className="p-2 border rounded-lg"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>

                          {customer.status === "SUSPENDED" ? (
                            <button
                              onClick={() =>
                                activateCustomer(customer.userId)
                              }
                              className="p-2 border rounded-lg text-emerald-600"
                              title="Activate"
                            >
                              <UserCheck size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                suspendCustomer(customer.userId)
                              }
                              className="p-2 border rounded-lg text-rose-600"
                              title="Suspend"
                            >
                              <UserX size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}