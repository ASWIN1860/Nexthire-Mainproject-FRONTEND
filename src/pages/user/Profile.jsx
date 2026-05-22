import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  Settings,
  Award,
  Calendar,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../utils/cn";
import {
  getResumeHistoryApi,
  getLatestResumeApi,
  getUserApplicationsApi,
  editUserApi,
} from "../../services/allApis";
import { formatDistanceToNow } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({
    username: "Guest User",
    email: "guest@example.com",
    date: "",
    bio: "",
  });
  const [profileDp, setProfileDp] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    profile: "",
    bio: "",
  });

  const handleEditProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);

      const response = await editUserApi(decoded.id, editForm);
      if (response.status === 200) {
        sessionStorage.setItem("uname", editForm.username);
        sessionStorage.setItem("dp", editForm.profile);
        sessionStorage.setItem("bio", editForm.bio);
        setUser({ ...user, username: editForm.username, bio: editForm.bio });
        window.dispatchEvent(new Event("profileUpdated"));
        setProfileDp(editForm.profile);
        setIsEditModalOpen(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred");
    }
  };

  const [statsData, setStatsData] = useState({
    resumesAnalyzed: 0,
    jobsApplied: 0,
    avgAtsScore: 0,
    skillsMatched: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topSkills, setTopSkills] = useState([]);

  useEffect(() => {
    const storedName = sessionStorage.getItem("uname");
    const storedMail = sessionStorage.getItem("email");
    const storedDp = sessionStorage.getItem("dp");
    const storedDate = sessionStorage.getItem("date");
    const storedBio = sessionStorage.getItem("bio");
    if (storedName && storedMail && storedDate) {
      setUser({
        username: storedName,
        email: storedMail,
        date: storedDate,
        bio: storedBio || "",
      });
    }
    if (storedDp) {
      setProfileDp(storedDp);
    }
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [historyRes, latestRes, appsRes] = await Promise.all([
        getResumeHistoryApi(),
        getLatestResumeApi(),
        getUserApplicationsApi(),
      ]);

      let resumesAnalyzed = 0;
      let avgAtsScore = 0;
      let recent = [];
      let topS = [];
      let skillsMatched = 0;
      let jobsApplied = 0;

      if (historyRes.status === 200 && historyRes.data) {
        resumesAnalyzed = historyRes.data.length;
        if (resumesAnalyzed > 0) {
          const totalAts = historyRes.data.reduce(
            (acc, curr) => acc + (curr.atsReadinessScore || curr.score || 0),
            0,
          );
          avgAtsScore = Math.round(totalAts / resumesAnalyzed);
        }

        recent = historyRes.data.slice(0, 3).map((r) => ({
          title: "Uploaded a new resume for analysis",
          filename: r.resumeFile
            ? r.resumeFile.split(/[\/\\]/).pop()
            : "Resume.pdf",
          date: r.createdAt,
        }));
      }

      if (latestRes.status === 200 && latestRes.data?.data) {
        const resume = latestRes.data.data;
        topS = resume.skills || [];
        skillsMatched = resume.skillsMatchScore || topS.length;
      }

      if (appsRes && appsRes.status === 200 && appsRes.data) {
        jobsApplied = appsRes.data.length;
      }

      setStatsData({
        resumesAnalyzed,
        jobsApplied,
        avgAtsScore,
        skillsMatched,
      });
      setRecentActivity(recent);
      setTopSkills(topS);
    } catch (err) {
      console.log(err);
    }
  };

  const stats = [
    {
      label: "Resumes Analyzed",
      value: statsData.resumesAnalyzed,
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Jobs Applied",
      value: statsData.jobsApplied,
      icon: Briefcase,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Avg ATS Score",
      value: `${statsData.avgAtsScore}%`,
      icon: TrendingUp,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "Skills Matched",
      value: `${statsData.skillsMatched}%`,
      icon: Award,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-slate-800/80 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1">
              <div className="bg-slate-900 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                {profileDp ? (
                  <>
                    <img
                      src={profileDp}
                      className="w-full h-full rounded-full"
                      alt=""
                    />
                  </>
                ) : (
                  <User className="w-16 h-16 text-slate-300" />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.username}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="font-bold">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined Date :
                  {user.date
                    ? new Date(user.date).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })
                    : "No Date"}
                </span>
              </div>
            </div>
            <h2
              className="font-bold text-slate-400"
              style={{ fontStyle: "italic", fontSize: "16px" }}
            >
              Bio : {user.bio}
            </h2>
          </div>

          <button
            onClick={() => {
              setEditForm({
                username: user.username,
                profile: profileDp,
                bio: user.bio || "",
              });
              setIsEditModalOpen(true);
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-800/80"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-slate-800/80" />
                  )}
                  <div className="relative z-10 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-medium">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {activity.filename}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {activity.date
                        ? formatDistanceToNow(new Date(activity.date), {
                            addSuffix: true,
                          })
                        : "Recently"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No recent activity.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-8 rounded-2xl border border-slate-800/80"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Top Skills</h2>
          <div className="flex flex-wrap gap-2">
            {topSkills.length > 0 ? (
              topSkills.slice(0, 15).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No skills found. Upload a resume to analyze.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  value={editForm.profile}
                  onChange={(e) =>
                    setEditForm({ ...editForm, profile: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter profile image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
