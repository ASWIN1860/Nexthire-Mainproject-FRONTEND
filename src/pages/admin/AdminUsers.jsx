import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Ban, User } from "lucide-react";
import { editUserApi, getAllUsersApi, getResumeByUserIdApi,deleteUserApi } from "../../services/allApis";
import {toast}from 'react-toastify'

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    status: "",
    _id: "",
  });

  const handleEditClick = (user) => {
    setSelectedUser({
      username: user.username || "",
      status: user.status || "Active",
      _id: user._id,
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleUpdateUser=async()=>{
    const body={
      username:selectedUser.username,
      status:selectedUser.status
    }
    const result=await editUserApi(
      selectedUser._id,body
    )
    if(result.status===200){
      toast.success("User Updated")
      getUsers()
      setIsEditModalOpen(false)
    }
  }

  const handleDeleteUser=async(id)=>{
    const confirmDelete=window.confirm("Are you sure you want to delete this user ?")
    if(confirmDelete){
      const result=await deleteUserApi(id)
      if(result.status===200){
        toast.success("User Deleted Successfully")
        getUsers()
      }
      else{
        toast.error("Failed to delete user")
      }
    }
  }

  const getUsers = async () => {
    try {
      const result = await getAllUsersApi();
      if (result.status === 200) {
        setUsers(result.data);

        result.data.forEach(async (user) => {
          const resumeResult = await getResumeByUserIdApi(user._id);

          console.log("RESUME RESULT :", resumeResult);

          if (resumeResult.status === 200) {
            setScores((prev) => ({
              ...prev,
              [user._id]: resumeResult.data.resume?.score ?? "-",
            }));
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>

          <p className="text-slate-400 mt-1">View and manage platform users.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium text-yellow-500">Name</th>

                <th className="px-6 py-4 font-medium text-yellow-500">Role</th>

                <th className="px-6 py-4 font-medium text-yellow-500">
                  Status
                </th>

                <th className="px-6 py-4 font-medium text-yellow-500">
                  Joined
                </th>

                <th className="px-6 py-4 font-medium text-yellow-500">
                  Avg Score
                </th>

                <th className="px-6 py-4 font-medium text-right text-yellow-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-black shadow-lg">
                        {user.username?.charAt(0)}
                      </div>

                      <div>
                        <div className="text-slate-200 font-medium">
                          {user.username}
                        </div>

                        <div className="text-slate-500 text-sm">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 w-max ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        }`}
                      ></span>

                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-300 text-sm">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      : "No Date"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        scores[user._id] >= 90
                          ? "text-emerald-400"
                          : scores[user._id] >= 80
                            ? "text-blue-400"
                            : "text-slate-400"
                      }`}
                    >
                      {scores[user._id] ?? "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button onClick={()=>{handleDeleteUser(user._id)}} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-xl shadow-slate-950/50">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-100">Edit User</h2>

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
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Username
                </label>

                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
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
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">inactive</option>
                  <option value="Blocked">blocked</option>
                </select>
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
                onClick={handleUpdateUser}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
