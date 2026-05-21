/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Filter,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllApplicationsApi,
  updateApplicationStatusApi,
} from "../../services/allApis";
import { toast } from "react-toastify";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);

  const navigate = useNavigate();

  const getApplications = async () => {
    try {
      setLoading(true);

      const result = await getAllApplicationsApi();

      console.log(result);

      if (result.status === 200) {
        setApplications(result.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplications();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Applied":
        return {
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          icon: Clock,
        };

      case "Shortlisted":
        return {
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          icon: FileText,
        };

      case "Interview":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          icon: CheckCircle,
        };

      case "Rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: XCircle,
        };

      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          icon: Clock,
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-emerald-400";
    }

    if (score >= 60) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id, status) => {
    try {
      const result = await updateApplicationStatusApi(id, { status });
      console.log(result);

      if (result.status === 200) {
        setApplications((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: status } : item,
          ),
        );
        toast.success("Status updated successfully");
      } else {
        toast.error("Status update failed!!");
      }
      setOpenStatusDropdown(null);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-400">
        Loading Applications...
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="space-y-6"
    >
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Applications Management
          </h1>

          <p className="text-slate-400 mt-2">
            Review, filter, and manage candidate applications.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

            <input
              type="text"
              placeholder="Search candidate or job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-slate-950 border border-slate-700/50 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Filter */}

          <div className="relative flex items-center">
            <Filter className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 bg-slate-950 border border-slate-700/50 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 appearance-none focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Statuses</option>

              <option value="Applied">Applied</option>

              <option value="Shortlisted">Shortlisted</option>

              <option value="Interview">Interview</option>

              <option value="Rejected">Rejected</option>
            </select>

            <ChevronDown className="absolute right-3 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="glass-panel rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden bg-slate-900/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800/80 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-5">Candidate</th>

                <th className="px-6 py-5">Job Title</th>

                <th className="px-6 py-5">ATS Score</th>

                <th className="px-6 py-5">Applied Date</th>

                <th className="px-6 py-5">Status</th>

                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app, index) => {
                    const atsScore = app.resumeId?.atsReadinessScore || 0;

                    const statusConfig = getStatusConfig(app.status);

                    const StatusIcon = statusConfig.icon;

                    return (
                      <motion.tr
                        key={app._id}
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                        }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        {/* User */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-slate-200">
                              {app.userId?.username?.charAt(0)}
                            </div>

                            <div>
                              <div className="text-slate-200 font-medium">
                                {app.userId?.username}
                              </div>

                              <div className="text-slate-500 text-xs">
                                {app.userId?.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Job */}

                        <td className="px-6 py-4 text-slate-300 font-medium text-sm">
                          {app.jobId?.title}
                        </td>

                        {/* ATS */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-950 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width: `${atsScore}%`,
                                }}
                                transition={{
                                  duration: 1,
                                }}
                                className={`h-full rounded-full ${
                                  atsScore >= 80
                                    ? "bg-emerald-500"
                                    : atsScore >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              />
                            </div>

                            <span
                              className={`text-sm font-bold ${getScoreColor(
                                atsScore,
                              )}`}
                            >
                              {atsScore}%
                            </span>
                          </div>
                        </td>

                        {/* Date */}

                        <td className="px-6 py-4 text-slate-400 text-sm">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />

                            {app.status}
                          </div>
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() =>
                                navigate("/admin/resume-result", {
                                  state: {
                                    resumeData: app.resumeId,
                                  },
                                })
                              }
                              className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Resume
                            </button>

                            <div className="relative">
                              <button
                                onClick={() =>
                                  setOpenStatusDropdown(
                                    openStatusDropdown === app._id
                                      ? null
                                      : app._id,
                                  )
                                }
                                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all flex items-center gap-1.5"
                              >
                                {app.status || "Applied"}
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>

                              <AnimatePresence>
                                {openStatusDropdown === app._id && (
                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      y: 5,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      y: 0,
                                    }}
                                    exit={{
                                      opacity: 0,
                                    }}
                                    className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden"
                                  >
                                    {[
                                      "Applied",
                                      "Shortlisted",
                                      "Interview",
                                      "Rejected",
                                    ].map((statusOption) => (
                                      <button
                                        key={statusOption}
                                        onClick={() =>
                                          handleStatusChange(
                                            app._id,
                                            statusOption,
                                          )
                                        }
                                        className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                      >
                                        {statusOption}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-500"
                    >
                      No Applications Found
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminApplications;
