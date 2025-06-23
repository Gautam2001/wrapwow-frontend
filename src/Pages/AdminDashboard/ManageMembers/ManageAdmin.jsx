import React, { useCallback, useEffect, useState } from "react";
import "./ManageAdmin.css";
import AxiosInstance from "../../../api/AxiosInstance";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import { FaSort } from "react-icons/fa";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const ManageAdmin = () => {
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  const fetchAdmins = useCallback(async () => {
    showLoader();
    try {
      const response = await AxiosInstance.get("/admin/getAdmins");
      const result = response.data.resultString;
      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        const data = result.Admins;
        if (Array.isArray(data)) {
          setAdmins(data);
          setFilteredAdmins(data);
        }
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Fetching admins failed. Please try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    } finally {
      hideLoader();
    }
  }, [showPopup]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const toggleSort = (field) => {
    setSortAsc(field === sortField ? !sortAsc : true);
    setSortField(field);
  };

  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField]?.toString().toLowerCase();
    const valB = b[sortField]?.toString().toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const handleSelect = (id) => {
    setSelectedAdmins((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const updateAdminStatus = async (ids) => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.email;

    try {
      const response = await AxiosInstance.post("/admin/updateAdminsStatus", {
        email,
        ids,
      });
      const result = response.data.resultString;

      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        showPopup("Status updated successfully", "success");
        fetchAdmins();
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Updating admin status failed, try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    }
  };

  const handleActiveDeact = (id) => {
    updateAdminStatus([id]);
  };

  const handleMulActiveDeact = () => {
    if (selectedAdmins.length === 0) {
      showPopup("Please select at least one admin", "error");
      return;
    }
    updateAdminStatus(selectedAdmins);
  };

  return (
    <div className="ma-page">
      <AdminHeader />
      <div className="ma-container">
        <Breadcrumbs
          labelMap={{
            "manage-users": "Users",
          }}
        />
        <div className="ma-title">Manage Admins</div>
        <div className="ma-searchbar-container">
          <input
            type="text"
            className="ma-searchbar"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ma-buttons">
          <button className="ma-top-btn" onClick={handleMulActiveDeact}>
            Activate/Deactivate
          </button>
        </div>
        <div className="ma-admin-header">
          <div className="ma-checkbox">
            <input
              type="checkbox"
              checked={
                filteredAdmins.length > 0 &&
                filteredAdmins.every((admin) =>
                  selectedAdmins.includes(admin.id)
                )
              }
              onChange={(e) =>
                e.target.checked
                  ? setSelectedAdmins([
                      ...new Set([
                        ...selectedAdmins,
                        ...filteredAdmins.map((a) => a.id),
                      ]),
                    ])
                  : setSelectedAdmins(
                      selectedAdmins.filter(
                        (id) => !filteredAdmins.some((a) => a.id === id)
                      )
                    )
              }
            />
          </div>
          <div className="ma-header-name" onClick={() => toggleSort("name")}>
            Name{" "}
            <FaSort
              className={`ma-sort-icon ${sortField === "name" ? "active" : ""}`}
            />
          </div>
          <div className="ma-header-email" onClick={() => toggleSort("email")}>
            Email{" "}
            <FaSort
              className={`ma-sort-icon ${
                sortField === "email" ? "active" : ""
              }`}
            />
          </div>
          <div className="ma-header-dob" onClick={() => toggleSort("dob")}>
            DOB{" "}
            <FaSort
              className={`ma-sort-icon ${sortField === "dob" ? "active" : ""}`}
            />
          </div>
          <div
            className="ma-header-status"
            onClick={() => toggleSort("accountStatus")}
          >
            Status{" "}
            <FaSort
              className={`ma-sort-icon ${
                sortField === "accountStatus" ? "active" : ""
              }`}
            />
          </div>
          <div className="ma-header-action">Action</div>
        </div>

        {sortedAdmins.map((admin) => (
          <div key={admin.id} className="ma-admin-card">
            <div className="ma-checkbox">
              <input
                type="checkbox"
                checked={selectedAdmins.includes(admin.id)}
                onChange={() => handleSelect(admin.id)}
              />
            </div>
            <div className="ma-admin-name">{admin.name}</div>
            <div className="ma-admin-email">{admin.email}</div>
            <div className="ma-admin-dob">{admin.dob}</div>
            <div className="ma-admin-status">{admin.accountStatus}</div>
            <div className="ma-admin-action">
              <button
                className="ma-action-btn"
                onClick={() => handleActiveDeact(admin.id)}
              >
                {admin.accountStatus === "ACTIVE" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <AdminFooter />
    </div>
  );
};

export default ManageAdmin;
