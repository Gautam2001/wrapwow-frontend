import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../HeaderFooters/Admin/AdminFooter";
import { FaArrowRight, FaUser, FaUserShield } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdCategory } from "react-icons/md";
import AxiosInstance from "../../api/AxiosInstance";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./AdminDashboard.css";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../GlobalFunctions/GlobalLoader/LoadingContext";

Chart.register(...registerables);

const Card = ({ icon, title, description, to }) => (
  <Link to={to} className="admin-dash-card">
    <div className="admin-dash-card-icon">{icon}</div>
    <h3 className="admin-dash-card-title">{title}</h3>
    <p className="admin-dash-card-description">{description}</p>
  </Link>
);

const AdminInfoCard = ({ stats }) => (
  <div className="admin-dash-info-wrapper">
    <h2 className="admin-dash-info-title">Website Status Overview</h2>
    <div className="admin-dash-info-content">
      <div className="admin-dash-info-column">
        <div className="admin-dash-info-heading">Products</div>
        <div className="admin-dash-info">
          <div className="admin-dash-info-section">
            <div className="admin-dash-info-label">Out of Stock</div>
            <div className="admin-dash-info-value">{stats.outOfStockQty}</div>
          </div>
          <div className="admin-dash-info-section">
            <div className="admin-dash-info-label">Low on Stock</div>
            <div className="admin-dash-info-value">{stats.lowStockQty}</div>
          </div>
        </div>
      </div>
      <div className="admin-dash-info-column">
        <div className="admin-dash-info-heading">Members</div>
        <div className="admin-dash-info">
          <div className="admin-dash-info-section">
            <div className="admin-dash-info-label">Inactive Users</div>
            <div className="admin-dash-info-value">{stats.inactiveUsers}</div>
          </div>
          <div className="admin-dash-info-section">
            <div className="admin-dash-info-label">Inactive Admins</div>
            <div className="admin-dash-info-value">{stats.inactiveAdmins}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [alertStats, setAlertStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [graphs, setGraphs] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthlyData = (dataArray, key) => {
    const result = Array(12).fill(0);
    dataArray?.forEach((item) => {
      const monthIdx = item.month - 1;
      result[monthIdx] = item[key];
    });
    return result;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      showLoader();
      try {
        const [alertRes, summaryRes, graphsRes] = await Promise.all([
          AxiosInstance.get("/admin/getAlertData"),
          AxiosInstance.get("/admin/analytics/summary"),
          AxiosInstance.get("/admin/analytics/graphs"),
        ]);

        const alertData = alertRes.data.resultString;
        if (alertData.resultStatus === "0") {
          showPopup(alertData.result || "Unable to fetch alert data.", "error");
        } else {
          setAlertStats({
            outOfStockQty: alertData.outOfStockQty || 0,
            lowStockQty: alertData.lowStockQty || 0,
            inactiveUsers: alertData.inactiveUsers || 0,
            inactiveAdmins: alertData.inactiveAdmins || 0,
          });
        }

        const summaryData = summaryRes.data.resultString;
        const graphData = graphsRes.data.resultString;

        if (
          summaryData.resultStatus === "0" ||
          graphData.resultStatus === "0"
        ) {
          showPopup("Failed to fetch analytics data.", "error");
        } else {
          setSummary(summaryData);
          setGraphs(graphData);
        }
      } catch (err) {
        showPopup(
          err.response
            ? "Fetching dashboard data failed. Please try again."
            : "An error occurred. Please check your connection.",
          "error"
        );
      } finally {
        hideLoader();
      }
    };

    fetchDashboardData();
  }, [showPopup]);

  const AdminAnalyticsCard = () => (
    <>
      {(summary || graphs) && (
        <div className="admin-dash-analytics-wrapper">
          <h2 className="admin-dash-analytics-title">
            Website Analytics Overview
          </h2>

          {summary && (
            <div className="admin-dash-summary-cards">
              <div className="admin-dash-summary-card">
                <div className="label">Lifetime Revenue</div>
                <div className="value">
                  ₹{summary.totalRevenue?.toLocaleString()}
                </div>
              </div>

              <div className="admin-dash-summary-card">
                <div className="label">Avg Order Value</div>
                <div className="value">
                  ₹{summary.averageOrderValue?.toFixed(2)}
                </div>
              </div>

              <div className="admin-dash-summary-card">
                <div className="label">Products Sold</div>
                <div className="value">{summary.totalProductsSold}</div>
              </div>
            </div>
          )}

          {graphs && (
            <>
              <h3
                className="admin-dash-analytics-title"
                style={{ fontSize: "1.4rem", marginTop: "2rem" }}
              >
                Monthly Trends
              </h3>
              <div className="admin-dash-graphs-container">
                <div className="admin-dash-graph">
                  <h3>Monthly Revenue</h3>
                  <Line
                    data={{
                      labels: monthNames,
                      datasets: [
                        {
                          label: "Revenue (₹)",
                          data: getMonthlyData(
                            graphs.monthlyRevenue,
                            "revenue"
                          ),
                          backgroundColor: "rgba(75,192,192,0.4)",
                          borderColor: "teal",
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                  />
                </div>

                <div className="admin-dash-graph">
                  <h3>Products Sold per Month</h3>
                  <Bar
                    data={{
                      labels: monthNames,
                      datasets: [
                        {
                          label: "Products Sold",
                          data: getMonthlyData(
                            graphs.monthlyProductsSold,
                            "productsSold"
                          ),
                          backgroundColor: "#ffa726",
                        },
                      ],
                    }}
                  />
                </div>

                <div className="admin-dash-graph">
                  <h3>Users Onboarded Monthly</h3>
                  <Bar
                    data={{
                      labels: monthNames,
                      datasets: [
                        {
                          label: "Users",
                          data: getMonthlyData(
                            graphs.monthlyUserOnboarded,
                            "userCount"
                          ),
                          backgroundColor: "#66bb6a",
                        },
                      ],
                    }}
                  />
                </div>

                <div className="admin-dash-graph">
                  <h3>Products per Category</h3>
                  <Bar
                    data={{
                      labels: graphs.productsPerCategory.map(
                        (cat) => cat.category
                      ),
                      datasets: [
                        {
                          label: "Products",
                          data: graphs.productsPerCategory.map(
                            (cat) => cat.count
                          ),
                          backgroundColor: "#42a5f5",
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="admin-dash-page">
      <AdminHeader />

      <div className="admin-dash-container">
        {alertStats && <AdminInfoCard stats={alertStats} />}

        <div className="admin-dash-cards">
          <Card
            icon={<AiFillProduct />}
            title="Products"
            description="update, change status, remove an existing product"
            to="/manage-products"
          />
          <Card
            icon={<MdCategory />}
            title="Categories"
            description="add/update categories"
            to="/manage-categories"
          />
          <Card
            icon={<FaUser />}
            title="Users"
            description="activate/deactivate users"
            to="/manage-users"
          />
          <Card
            icon={<FaUserShield />}
            title="Admins"
            description="validate an admin"
            to="/manage-admins"
          />
        </div>

        <div className="admin-dash-product">
          <div className="admin-dash-product-heading">
            <h2 className="admin-dash-product-heading-title">New Product</h2>
            <p className="admin-dash-product-heading-desc">
              Want to add a new product?
            </p>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="admin-dash-product-button"
          >
            Click Here <FaArrowRight />
          </button>
        </div>

        <AdminAnalyticsCard />
      </div>

      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
