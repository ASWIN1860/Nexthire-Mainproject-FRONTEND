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

import {
  getAllJobsApi,
  getLatestResumeApi,
} from "../../services/allApis";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [resumeSkills, setResumeSkills] = useState([]);

  useEffect(() => {
    getJobs();
    getResumeSkills();
  }, []);

  // save button
  const toggleSave = (id) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === id
          ? { ...job, saved: !job.saved }
          : job
      )
    );
  };

  // get latest resume skills
  const getResumeSkills = async () => {
    try {
      const result = await getLatestResumeApi();

      console.log("RESUME RESULT :", result.data);

      if (result.status === 200) {
        const skillsData = result.data.data.skills;

        console.log(skillsData);

        setResumeSkills(
          typeof skillsData === "string"
            ? skillsData
                .split(",")
                .map((skill) => skill.trim())
            : skillsData || []
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // calculate match percentage
  const calculateMatch = (jobSkills = []) => {
    if (!resumeSkills || resumeSkills.length === 0) {
      return 0;
    }

    const matchedSkills = jobSkills.filter((skill) =>
      resumeSkills.some(
        (resumeSkill) =>
          resumeSkill.toLowerCase() ===
          skill.toLowerCase()
      )
    );

    return Math.round(
      (matchedSkills.length / jobSkills.length) * 100
    );
  };

  // get jobs
  const getJobs = async () => {
    try {
      const result = await getAllJobsApi();

      if (result.status === 200) {
        const activeJobs = result.data.filter(
          (job) => job.status === "Active"
        );

        setJobs(activeJobs);
      }

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Recommended Jobs
          </h1>

          <p className="text-slate-400 mt-1">
            Based on your resume analysis,
            here are the best matches.
          </p>
        </div>

        <div className="flex gap-3">
          <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500">
            <option>
              Match Score: High to Low
            </option>

            <option>Date: Newest First</option>

            <option>Salary: High to Low</option>
          </select>

          <button className="btn-secondary">
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {jobs.map((job) => {
          const matchPercentage =
            calculateMatch(job.skills || []);

          return (
            <div
              key={job._id}
              className="glass-card p-6 flex flex-col h-full group relative overflow-hidden"
            >
              {/* background effect */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -z-10 rounded-full transition-colors duration-500 ${
                  matchPercentage >= 90
                    ? "bg-emerald-500"
                    : matchPercentage >= 80
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
              ></div>

              {/* top section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 border border-slate-700 flex items-center justify-center text-xl font-bold text-black">
                    {job.title?.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 line-clamp-1">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <Building className="w-3.5 h-3.5" />

                      <span>{job.company}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    toggleSave(job._id)
                  }
                  className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                >
                  {job.saved ? (
                    <BookmarkCheck className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Bookmark className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* info grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                  <MapPin className="w-4 h-4 text-slate-500" />

                  <span className="line-clamp-1 font-bold">
                    {job.location}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                  <DollarSign className="w-4 h-4 text-emerald-500" />

                  <span className="line-clamp-1 font-bold">
                    {job.salary}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                  <Briefcase className="w-4 h-4 text-blue-500" />

                  <span className="line-clamp-1 font-bold">
                    Job : {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                  <Clock className="w-4 h-4 text-purple-500" />

                  <span className="line-clamp-1 font-bold">
                    {formatDistanceToNow(
                      new Date(job.createdAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  </span>
                </div>
              </div>

              {/* skills */}
              <div className="mb-6 flex-grow">
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Required Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {(job.skills || []).map(
                    (skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>

                {/* description */}
                <p className="text-xs font-medium text-slate-500 my-3 uppercase tracking-wider">
                  Job Description
                </p>

                <div className="flex flex-wrap gap-2">
                  <h4 className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md">
                    {job.description}
                  </h4>
                </div>
              </div>

              {/* bottom section */}
              <div className="pt-4 border-t border-slate-800/80 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="4"
                      />

                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke={
                          matchPercentage >= 90
                            ? "#10b981"
                            : matchPercentage >= 80
                            ? "#3b82f6"
                            : "#eab308"
                        }
                        strokeWidth="4"
                        strokeDasharray={`${matchPercentage} 100`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-200">
                      {matchPercentage}%
                    </span>
                  </div>

                  <span className="text-sm font-medium text-slate-400">
                    Match Profile
                  </span>
                </div>

                <button className="btn-primary py-2 px-4 shadow-none bg-slate-100 text-slate-900 hover:bg-green-600 cursor-pointer flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-black transition-colors">
                  Apply
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobsPage;