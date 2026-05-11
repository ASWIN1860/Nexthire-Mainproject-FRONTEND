import { Plus, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { addJobsApi } from "../../services/allApis";

const AddJob = () => {
  const [title, setTitle] = useState("");

  const [company, setCompany] = useState("");

  const [location, setLocation] = useState("");

  const [salary, setSalary] = useState("");

  const [description, setDescription] = useState("");

  const [skills, setSkills] = useState([]);

  const [allSkills, setAllSkills] = useState([]);


  const handleAddJob = async () => {
    

    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !description ||
      skills.length === 0
    ) {
      toast.warning("Please fill all fields");

      return;
    }

    try {

      const body = {
        title,

        company,

        location,

        salary,

        description,

        skills,
      };

      const result = await addJobsApi(body);

      console.log(result);

      if (result.status === 200) {
        toast.success("Job added successfully");

        setTitle("");

        setCompany("");

        setLocation("");

        setSalary("");

        setDescription("");

        setSkills([]);
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed to add job");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel p-6 rounded-3xl h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Post New Job</h2>
          <p className="text-sm text-slate-400">Create a new job listing</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Job Title
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Senior Developer"
              onChange={(e)=>{setTitle(e.target.value)}}
              value={title}
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Company</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Tech Corp"
              onChange={(e)=>{setCompany(e.target.value)}}
              value={company}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Location
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Remote / New York"
              onChange={(e)=>{setLocation(e.target.value)}}
              value={location}
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Salary</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. $100,000 - $150,000"
              onChange={(e)=>{setSalary(e.target.value)}}
              value={salary}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Required Skills
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. React, Node.js, MongoDB (comma separated)"
            onChange={(e)=>{setSkills(e.target.value)}}
            value={skills}
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-1 block">
            Job Description
          </label>
          <textarea
            className="input-field min-h-[100px] resize-y"
            placeholder="Describe the role, responsibilities, and requirements..."
            onChange={(e)=>{setDescription(e.target.value)}}
            value={description}
          ></textarea>
        </div>

        <button onClick={handleAddJob} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
          <Plus className="w-5 h-5" />
          Post Job
        </button>
      </form>
    </motion.div>
  );
};

export default AddJob;
