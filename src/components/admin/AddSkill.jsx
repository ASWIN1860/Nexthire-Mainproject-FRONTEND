import { Plus, Code } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { useState } from "react";
import { addSkillsApi } from "../../services/allApis";

const AddSkill = () => {
  const [skill, setSkill] = useState("");
  const [aliases, setAliases] = useState("");
  const [category, setCategory] = useState("");

  // =========================
  // ADD SKILL
  // =========================

  const handleAddSkill = async (e) => {
    e.preventDefault();

    // VALIDATION

    if (!skill || !aliases || !category) {
      toast.warning("Please fill all fields");

      return;
    }

    try {
      const body = {
        skill,

        aliases,

        category,
      };

      const result = await addSkillsApi(body);

      console.log(result);

      if (result.status === 200) {
        toast.success("Skill added successfully");

        // CLEAR INPUTS

        setSkill("");

        setAliases("");

        setCategory("");
      }
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
          <Code className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Add New Skill</h2>
          <p className="text-sm text-slate-400">
            Add a new skill to the platform's database
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-sm text-slate-400 mb-6 block">Skill</label>
          <input type="text" className="input-field" placeholder="e.g. React" onChange={(e)=>{setSkill(e.target.value)}} value={skill} />
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-6 block">Aliases</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. React.js, ReactJS (comma separated)"
            onChange={(e)=>{setAliases(e.target.value)}}
            value={aliases}
          />
        </div>
       <div>
          <label className="text-sm text-slate-400 mb-6 block">Aliases</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Frontend"
            onChange={(e)=>{setCategory(e.target.value)}}
            value={category}
          />
        </div>
        <button
          onClick={handleAddSkill}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-14"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </form>
    </motion.div>
  );
};

export default AddSkill;
