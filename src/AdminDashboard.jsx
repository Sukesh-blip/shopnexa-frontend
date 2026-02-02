import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import Logo from "./Logo";
import "./assets/styles.css";
import CustomModal from "./CustomModal";
import api from "./services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null); // State to manage modal visibility and type
  const [modalData, setModalData] = useState(null); // State to store data passed to modal (if needed)
  const [response, setResponse] = useState(null); // State to store API responses

  // Centralized card data
  const cardData = [
    {
      title: "Add Product",
      description: "Create and manage new product listings with validation",
      team: "Product Management",
      modalType: "addProduct",
    },
    {
      title: "Delete Product",
      description: "Remove products from inventory system",
      team: "Product Management",
      modalType: "deleteProduct",
    },
    {
      title: "Modify User",
      description: "Update user details and manage roles",
      team: "User Management",
      modalType: "modifyUser",
    },
    {
      title: "View User Details",
      description: "Fetch and display details of a specific user",
      team: "User Management",
      modalType: "viewUser",
    },
    {
      title: "Monthly Business",
      description: "View revenue metrics for specific months",
      team: "Analytics",
      modalType: "monthlyBusiness",
    },
    {
      title: "Day Business",
      description: "Track daily revenue and transactions",
      team: "Analytics",
      modalType: "dailyBusiness",
    },
    {
      title: "Yearly Business",
      description: "Analyze annual revenue performance",
      team: "Analytics",
      modalType: "yearlyBusiness",
    },
    {
      title: "Overall Business",
      description: "View total revenue since inception",
      team: "Analytics",
      modalType: "overallBusiness",
    },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout').catch(() => { });
      console.log("User successfully logged out");
      localStorage.clear();
      navigate("/admin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Handlers for each modal action
  const handleAddProductSubmit = async (productData) => {
    try {
      const resp = await api.post('/api/admin/products/add', productData);
      setResponse({ product: resp.data, imageUrl: productData.imageUrl });
      setModalType("addProduct");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProductSubmit = async ({ productId }) => {
    try {
      const resp = await api.delete('/api/admin/products/delete', {
        data: { productId }
      });
      console.log("response", resp);
      // Handle response logic
      if (resp.status === 200 || resp.status === 204) {
        setResponse({ message: "Delete Success" });
      } else {
        setResponse({ message: `Error: ${resp.data?.message || 'Delete failed'}` });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
    }
  };

  const handleViewUserSubmit = async ({ userId }) => {
    try {
      const resp = await api.post('/api/admin/user/getbyid', { userId });
      setResponse({ user: resp.data });
      setModalType("response");
    } catch (error) {
      console.error("Error fetching user details:", error);
      setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
      setModalType("response");
    }
  };

  const handleModifyUserSubmit = async (data) => {
    if (!data.username) {
      // Fetch user details
      try {
        console.log("Fetching user details for ID:", data.userId); // Debugging
        const resp = await api.post('/api/admin/user/getbyid', { userId: data.userId });
        setResponse({ user: resp.data });
        setModalType("modifyUser");
      } catch (error) {
        console.error("Error fetching user details:", error);
        setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
        setModalType("response");
      }
    } else {
      // Update user details
      try {
        console.log("Updating user details:", data); // Debugging
        const resp = await api.put('/api/admin/user/modify', data);
        setResponse({ user: resp.data });
        setModalType("response");
      } catch (error) {
        console.error("Error updating user details:", error);
        setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
        setModalType("response");
      }
    }
  };

  const handleMonthlyBusiness = async (data) => {
    try {
      const resp = await api.get('/api/admin/business/monthly', {
        params: { month: data?.month, year: data?.year }
      });
      setResponse({ monthlyBusiness: resp.data });
      setModalType("monthlyBusiness");
    } catch (error) {
      console.error("Error fetching monthly business:", error);
      setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
      setModalType("monthlyBusiness");
    }
  };

  const handleDailyBusiness = async (data) => {
    try {
      const resp = await api.get('/api/admin/business/daily', {
        params: { date: data?.date }
      });
      setResponse({ dailyBusiness: resp.data });
      setModalType("dailyBusiness");
    } catch (error) {
      console.error("Error fetching daily business:", error);
      setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
      setModalType("dailyBusiness");
    }
  };

  const handleYearlyBusiness = async (data) => {
    try {
      const resp = await api.get('/api/admin/business/yearly', {
        params: { year: data?.year }
      });
      setResponse({ yearlyBusiness: resp.data });
      setModalType("yearlyBusiness");
    } catch (error) {
      console.error("Error fetching yearly business:", error);
      setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
      setModalType("yearlyBusiness");
    }
  };

  const handleOverallBusiness = async () => {
    try {
      const resp = await api.get('/api/admin/business/overall');
      setResponse({ overallBusiness: resp.data });
      setModalType("overallBusiness");
    } catch (error) {
      console.error("Error fetching overall business:", error);
      setResponse({ message: `Error: ${error.response?.data?.message || error.message}` });
      setModalType("overallBusiness");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Logo />
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span className="username" style={{ fontWeight: 700, color: '#64748b' }}>Admin</span>
            <button
              onClick={handleLogout}
              style={{
                background: '#f1f5f9',
                color: '#64748b',
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="cards-grid">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => {
                setModalType(card.modalType);
                setModalData(null); // Clear any previous data
              }}
            >
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-team">Team: {card.team}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      {modalType && (
        <CustomModal
          modalType={modalType}
          onClose={() => {
            setModalType(null);
            setResponse(null);
          }}
          onSubmit={(data) => {
            switch (modalType) {
              case "addProduct":
                handleAddProductSubmit(data);
                break;
              case "deleteProduct":
                handleDeleteProductSubmit(data);
                break;
              case "viewUser":
                handleViewUserSubmit(data);
                break;
              case "modifyUser":
                handleModifyUserSubmit(data);
                break;
              case "monthlyBusiness":
                handleMonthlyBusiness(data);
                break;
              case "dailyBusiness":
                handleDailyBusiness(data);
                break;
              case "yearlyBusiness":
                handleYearlyBusiness(data);
                break;
              case "overallBusiness":
                handleOverallBusiness();
                break;

              // Add more cases here as needed
              default:
                break;
            }
          }}
          response={response}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
