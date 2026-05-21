import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  deleteJobApi,
  getAllJobsApi,
  updateJobApi,
} from "../../services/allApis";
import { toast } from "react-toastify";

const AdminJobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
    status: "",
    _id: "",
  });

  useEffect(() => {
    getAllJobs();
  }, []);

  //get all jobs
  const getAllJobs = async () => {
    try {
      const result = await getAllJobsApi();
      if (result.status === 200) {
        setAllJobs(result.data);
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //delete jobs
  const handleDelete = async (id) => {
    const result = await deleteJobApi(id);
    if (result.status === 200) {
      alert("Are you sure ?");
      toast.success("Job deleted succcessfully");
      getAllJobs();
    }
  };

  //edit jobs
  const handleUpdateJob = async (id) => {
    try {
      const body = {
        title: selectedJob.title,
        company: selectedJob.company,
        location: selectedJob.location,
        salary: selectedJob.salary,
        description: selectedJob.description,
        skills: selectedJob.skills
          .split(",")
          .map((skill) => skill.trim()),
        status: selectedJob.status || "Active",
      };

      const result = await updateJobApi(id, body);

      if (result.status === 200) {
        toast.success("Job updated successfully");
        setIsEditModalOpen(false);
        getAllJobs();
      }
    } catch (err) {
      console.log(err);
      toast.error("Update failed!!");
    }
  };

  const handleEditClick = (job) => {
    setSelectedJob({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
      skills: job.skills?.join(", ") || "",
      status: job.status || "",
      _id: job._id,
    });

    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Job Board Management
          </h1>

          <p className="text-slate-400 mt-1">
            Add, edit, or remove job listings from the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs.length > 0 ? (
          <>
            {allJobs.map((job) => (
              <div
                key={job._id}
                className="glass-card p-6 flex flex-col group relative"
              >
                {job.status === "Closed" && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center">
                    <span className="px-4 py-2 bg-slate-900/80 border border-slate-700 text-slate-300 font-bold rounded-lg transform -rotate-12">
                      CLOSED
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 border border-slate-700 flex items-center justify-center text-xl font-bold text-black">
                    {job.company.charAt(0)}
                  </div>

                  <div className="flex gap-1 z-20">
                    <button
                      onClick={() => handleEditClick(job)}
                      className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-blue-500/10 rounded-lg transition-colors bg-slate-900/80"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors bg-slate-900/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-lg">
                    {job.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4 font-bold">
                    Company : {job.company}
                  </p>
                </div>

                <div className="text-md mb-2">
                  Description : {job.description}
                </div>

                {/* Skills Section */}
                <div className="mb-3">
                  <p className="text-sm mb-2 font-medium text-slate-300">
                    Skills :
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(job.skills)
                      ? job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700"
                          >
                            {skill}
                          </span>
                        ))
                      : job.skills
                          ?.split(",")
                          .map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                  </div>
                </div>

                <div className="space-y-2 mt-auto text-sm text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    {job.salary}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {job.location}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-sm">
                  <span className="text-slate-400">
                    <span className="text-blue-400 font-bold text-base">
                      {job.applicants}
                    </span>{" "}
                    applicants
                  </span>

                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      job.status?.toLowerCase() === "active"
                        ? "bg-emerald-500/10 text-green-500 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex justify-center items-center">
            <div>
              <img
                src="https://cdn.dribbble.com/userupload/22517386/file/original-8bd7460edf942f8684b0ccf9f061557d.png?resize=400x0"
                alt="no data img"
              />

              <h2 className="text-red-600">No Jobs Available !!!</h2>

              <button className="bg-yellow-400 text-black font-bold p-2 rounded cursor-pointer">
                <Link to={"/admin/dashboard"}>Add jobs</Link>
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl shadow-slate-950/50">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-100">
                Edit Job Listing
              </h2>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Job Title
                  </label>

                  <input
                    type="text"
                    value={selectedJob.title}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Company
                  </label>

                  <input
                    type="text"
                    value={selectedJob.company}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        company: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Location
                  </label>

                  <input
                    type="text"
                    value={selectedJob.location}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        location: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Salary Range
                  </label>

                  <input
                    type="text"
                    value={selectedJob.salary}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        salary: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Required Skills
                  </label>

                  <input
                    type="text"
                    value={selectedJob.skills}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        skills: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Status
                  </label>

                  <select
                    value={selectedJob.status || "Active"}
                    onChange={(e) =>
                      setSelectedJob({
                        ...selectedJob,
                        status: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-green-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Job Description
                </label>

                <textarea
                  value={selectedJob.description}
                  onChange={(e) =>
                    setSelectedJob({
                      ...selectedJob,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => handleUpdateJob(selectedJob._id)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all font-medium"
              >
                Update Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;