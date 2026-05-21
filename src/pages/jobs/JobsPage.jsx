import { useState, useEffect } from "react";

import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

import { toast } from "react-toastify";

import {
  getMatchedJobsApi,
  getLatestResumeApi,
  applyJobApi,
} from "../../services/allApis";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);

  const [latestResume, setLatestResume] = useState(null);

  // =====================================
  // LOAD
  // =====================================

  useEffect(() => {
    getJobs();

    getLatestResume();
  }, []);

  // =====================================
  // SAVE
  // =====================================

  const toggleSave = (id) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === id
          ? {
              ...job,
              saved: !job.saved,
            }
          : job,
      ),
    );
  };

  // =====================================
  // GET RESUME
  // =====================================

  const getLatestResume = async () => {
    try {
      const result = await getLatestResumeApi();

      if (result.status === 200) {
        setLatestResume(result.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // GET JOBS
  // =====================================

  const getJobs = async () => {
    try {
      const result = await getMatchedJobsApi();

      console.log(result);

      if (result.status === 200) {
        setJobs(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // APPLY
  // =====================================

  const handleApply = async (jobId) => {
    try {
      if (!latestResume) {
        toast.warning("Please upload resume first");

        return;
      }

      const body = {
        jobId,

        resumeId: latestResume._id,
      };

      const result = await applyJobApi(body);

      if (result.status === 200) {
        toast.success("Applied Successfully");
      } else {
        toast.error("Already applied");
      }
    } catch (err) {
      console.log(err);

      toast.warning(err.response?.data?.message || "Application failed");
    }
  };

  // =====================================
  // LABEL
  // =====================================

  const getMatchLabel = (score) => {
    if (score >= 90) return "Excellent Match";

    if (score >= 75) return "Strong Match";

    if (score >= 60) return "Moderate Match";

    if (score >= 40) return "Weak Match";

    return "Poor Match";
  };

  // =====================================
  // COLOR
  // =====================================

  const getMatchColor = (score) => {
    if (score >= 90) return "#10b981";

    if (score >= 75) return "#3b82f6";

    if (score >= 60) return "#eab308";

    return "#ef4444";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Recommended Jobs</h1>

        <p className="text-slate-400 mt-1">
          Smart AI job matching based on your resume.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card rounded-2xl text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Jobs Available</h3>
          <p className="text-slate-400">There are currently no recommended jobs matching your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
          {jobs.map((job) => {
            const matchPercentage = job.matchPercentage || 0;

            return (
              <div key={job._id} className="glass-card p-6 flex flex-col h-full">
                {/* TOP */}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-black font-bold">
                      {job.title?.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-100">{job.title}</h3>

                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Building className="w-4 h-4" />

                        {job.company}
                      </div>
                    </div>
                  </div>

                  <button onClick={() => toggleSave(job._id)}>
                    {job.saved ? (
                      <BookmarkCheck className="text-blue-500" />
                    ) : (
                      <Bookmark />
                    )}
                  </button>
                </div>

                {/* INFO */}

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin className="w-4 h-4" />

                    {job.location}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <DollarSign className="w-4 h-4" />

                    {job.salary}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4" />

                    {formatDistanceToNow(
                      new Date(job.createdAt),

                      {
                        addSuffix: true,
                      },
                    )}
                  </div>
                </div>

                {/* MATCH */}

                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 text-sm">
                      {getMatchLabel(matchPercentage)}
                    </span>

                    <span className="text-slate-100 font-bold">
                      {matchPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${matchPercentage}%`,
                        background: getMatchColor(matchPercentage),
                      }}
                    ></div>
                  </div>
                </div>

                {/* SKILLS */}

                <div className="mb-5">
                  <p className="text-xs text-slate-500 uppercase mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"   
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MISSING */}

                <div className="mb-5">
                  <p className="text-xs text-red-400 uppercase mb-2">
                    Missing Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(job.missingSkills || [])

                      .slice(0, 5)

                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="mb-6 flex-grow">
                  <p className="text-xs text-slate-500 uppercase mb-2">
                    Description
                  </p>

                  <p className="text-sm text-slate-300">{job.description}</p>
                </div>

                {/* APPLY */}

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={matchPercentage < 40}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all

                  ${
                    matchPercentage >= 40
                      ? "bg-white text-black hover:bg-green-500"
                      : "bg-slate-700 text-slate-400 cursor-not-allowed"
                  }

                  `}
                >
                  {matchPercentage >= 40 ? "Apply Now" : "Low Match"}

                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
