import React, { useEffect, useState } from "react";
import "./assets/modalStyles.css";
import api from "./services/api";

const CustomModal = ({ modalType, onClose, onSubmit, response }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const [inputValue, setInputValue] = useState(""); // Generalized input for all cases

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeneralInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (modalType) {
      case "addProduct": {
        const processedData = {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: parseInt(formData.categoryId, 10),
        };
        onSubmit(processedData);
        break;
      }
      case "deleteProduct": {
        const productId = parseInt(inputValue, 10);
        onSubmit({ productId });
        break;
      }
      case "viewUser": {
        const userId = parseInt(inputValue, 10);
        onSubmit({ userId });
        break;
      }
      case "modifyUser": {
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const email = formData.get("email");
        const role = formData.get("role");
        const userId = parseInt(inputValue, 10);
        onSubmit(userId);
        break;
      }
      case "monthlyBusiness": {
        onSubmit({ month: formData.month, year: formData.year });
        break;
      }
      case "dailyBusiness": {
        onSubmit({ date: formData.date });
        break;
      }
      case "yearlyBusiness": {
        onSubmit({ year: formData.year });
        break;
      }
      case "overallBusiness": {
        onSubmit();
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Add Product Form */}
        {modalType === "addProduct" &&
          (!response ? (
            <>
              <h2>Add Product</h2>
              <form className="modal-form">
                <div className="modal-form-item">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="price">Price:</label>
                  <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="stock">Stock:</label>
                  <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="categoryId">Category ID:</label>
                  <input type="number" id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="imageUrl">Image URL:</label>
                  <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="description">Description:</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
              </form>
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={onClose}>Cancel</button>
            </>
          ) : (
            <>
              <h2>Product Details</h2>
              <div className="product-info-display">
                <p><strong>Name:</strong> {response.product?.name}</p>
                <p><strong>Price:</strong> ₹{response.product?.price}</p>
                <button onClick={onClose}>Close</button>
              </div>
            </>
          ))}

        {/* Delete Product */}
        {modalType === "deleteProduct" && (
          <>
            <h2>Delete Product</h2>
            {!response ? (
              <>
                <input type="number" placeholder="Enter Product ID" value={inputValue} onChange={handleGeneralInputChange} />
                <button onClick={handleSubmit}>Delete</button>
              </>
            ) : (
              <p>{response.message}</p>
            )}
            <button onClick={onClose}>Close</button>
          </>
        )}

        {/* View User */}
        {modalType === "viewUser" && (
          <>
            <h2>View User Details</h2>
            {!response ? (
              <>
                <input type="number" placeholder="User ID" value={inputValue} onChange={handleGeneralInputChange} />
                <button onClick={handleSubmit}>Submit</button>
              </>
            ) : response.user ? (
              <div className="user-details">
                <p><strong>Username:</strong> {response.user.username}</p>
                <p><strong>Email:</strong> {response.user.email}</p>
                <p><strong>Role:</strong> {response.user.role}</p>
              </div>
            ) : <p>{response.message}</p>}
            <button onClick={onClose}>Close</button>
          </>
        )}

        {/* Business Metrics */}
        {(modalType === "monthlyBusiness" || modalType === "dailyBusiness" || modalType === "yearlyBusiness" || modalType === "overallBusiness") && (
          <>
            <h2>Business Report</h2>
            {!response ? (
              <form className="modal-form">
                {modalType === "monthlyBusiness" && (
                  <>
                    <input type="number" name="month" placeholder="Month (1-12)" onChange={handleInputChange} />
                    <input type="number" name="year" placeholder="Year" onChange={handleInputChange} />
                  </>
                )}
                {modalType === "dailyBusiness" && <input type="text" name="date" placeholder="YYYY-MM-DD" onChange={handleInputChange} />}
                {modalType === "yearlyBusiness" && <input type="number" name="year" placeholder="Year" onChange={handleInputChange} />}
                <button onClick={handleSubmit}>Get Report</button>
              </form>
            ) : (
              <div className="business-results">
                <p><strong>Total Business:</strong> ₹{response.monthlyBusiness?.totalBusiness || response.dailyBusiness?.totalBusiness || response.yearlyBusiness?.totalBusiness || response.overallBusiness?.totalBusiness || 0}</p>
              </div>
            )}
            <button onClick={onClose}>Close</button>
          </>
        )}

        {modalType === "modifyUser" && (
          <ModifyUserFormComponent onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default CustomModal;

const ModifyUserFormComponent = ({ onClose }) => {
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [updated, setUpdated] = useState(false);

  const handleFetchUser = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.post('/api/admin/user/getbyid', { userId });
      setUserDetails(resp.data);
    } catch (error) {
      alert("Error fetching user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const resp = await api.put('/api/admin/user/modify', {
        userId: +userId,
        username: formData.get("username"),
        email: formData.get("email"),
        role: formData.get("role"),
      });
      setUserDetails(resp.data);
      setUpdated(true);
    } catch (error) {
      alert("Error updating user");
    }
  };

  if (!userDetails) {
    return (
      <form onSubmit={handleFetchUser}>
        <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button type="submit">Get User</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleUpdateUser} className="modal-form">
      <h3>{updated ? "User Updated" : "Modify User"}</h3>
      <input name="username" defaultValue={userDetails.username} placeholder="Username" />
      <input name="email" defaultValue={userDetails.email} placeholder="Email" />
      <input name="role" defaultValue={userDetails.role} placeholder="Role" />
      {!updated && <button type="submit">Save Changes</button>}
      <button onClick={onClose}>Close</button>
    </form>
  );
};
