import React, { useCallback, useEffect, useState } from "react";
import "./ManageUser.css";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
//import AxiosInstance from "../../../api/AxiosInstance";
import { FaSort } from "react-icons/fa";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { useApiClients } from "../../../api/useApiClients";

const ManageUser = () => {
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = useCallback(async () => {
    showLoader();
    try {
      const response = await wrapwowApi.get("/admin/getUsers");
      const result = response.data;

      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        const data = result.Users;
        if (Array.isArray(data)) {
          setUsers(data);
          setFilteredUsers(data);
        }
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Fetching users failed. Please try again."
          : "Check your connection.",
        "error"
      );
    } finally {
      hideLoader();
    }
  }, [showPopup]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleSort = (field) => {
    setSortAsc(field === sortField ? !sortAsc : true);
    setSortField(field);
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField]?.toString().toLowerCase();
    const valB = b[sortField]?.toString().toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const handleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const updateUserStatus = async (ids) => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    try {
      const response = await wrapwowApi.post("/admin/updateUsersStatus", {
        email,
        ids,
      });
      const result = response.data;

      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        showPopup("Status updated successfully", "success");
        fetchUsers();
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Updating user status failed, try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    }
  };

  const handleActiveDeact = (id) => {
    updateUserStatus([id]);
  };

  const handleMulActiveDeact = () => {
    if (selectedUsers.length === 0) {
      showPopup("Please select at least one user", "error");
      return;
    }
    updateUserStatus(selectedUsers);
  };

  return (
    <div className="mu-page">
      <AdminHeader />
      <div className="mu-container">
        <Breadcrumbs
          labelMap={{
            "manage-users": "Users",
          }}
        />

        <div className="mu-title">Manage Users</div>
        <div className="mu-searchbar-container">
          <input
            type="text"
            className="mu-searchbar"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mu-buttons">
          <button className="mu-top-btn" onClick={handleMulActiveDeact}>
            Activate/Deactivate
          </button>
        </div>
        <div className="mu-user-header">
          <div className="mu-checkbox">
            <input
              type="checkbox"
              checked={
                filteredUsers.length > 0 &&
                filteredUsers.every((user) => selectedUsers.includes(user.id))
              }
              onChange={(e) =>
                e.target.checked
                  ? setSelectedUsers([
                      ...new Set([
                        ...selectedUsers,
                        ...filteredUsers.map((u) => u.id),
                      ]),
                    ])
                  : setSelectedUsers(
                      selectedUsers.filter(
                        (id) => !filteredUsers.some((u) => u.id === id)
                      )
                    )
              }
            />
          </div>
          <div className="mu-header-name" onClick={() => toggleSort("name")}>
            Name{" "}
            <FaSort
              className={`mu-sort-icon ${sortField === "name" ? "active" : ""}`}
            />
          </div>
          <div className="mu-header-email" onClick={() => toggleSort("email")}>
            Email{" "}
            <FaSort
              className={`mu-sort-icon ${
                sortField === "email" ? "active" : ""
              }`}
            />
          </div>
          <div className="mu-header-dob" onClick={() => toggleSort("dob")}>
            DOB{" "}
            <FaSort
              className={`mu-sort-icon ${sortField === "dob" ? "active" : ""}`}
            />
          </div>
          <div
            className="mu-header-status"
            onClick={() => toggleSort("accountStatus")}
          >
            Status{" "}
            <FaSort
              className={`mu-sort-icon ${
                sortField === "accountStatus" ? "active" : ""
              }`}
            />
          </div>
          <div className="mu-header-action">Action</div>
        </div>

        {sortedUsers.map((user) => (
          <div key={user.id} className="mu-user-card">
            <div className="mu-checkbox">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleSelect(user.id)}
              />
            </div>
            <div className="mu-user-name">{user.name}</div>
            <div className="mu-user-email">{user.email}</div>
            <div className="mu-user-dob">{user.dob}</div>
            <div className="mu-user-status">{user.accountStatus}</div>
            <div className="mu-user-action">
              <button
                className="mu-action-btn"
                onClick={() => handleActiveDeact(user.id)}
              >
                {user.accountStatus === "ACTIVE" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <AdminFooter />
    </div>
  );
};

export default ManageUser;
