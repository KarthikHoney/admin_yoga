import React, { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultCredentials = {
    name: 'admin',
    upassword: 'password'
  };

  const initialFormData = {
    name: '',
    upassword: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.upassword) tempErrors.upassword = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (formData.name === defaultCredentials.name && formData.upassword === defaultCredentials.upassword) {
        toast.success("Login Successfully", { autoClose: 2000 });
        setFormData(initialFormData);
        onLogin();
        navigate('/admin/dashboard');
      } else {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <div className='login-page d-flex justify-content-center align-items-center min-vh-100'>
      <Form autoComplete='off' onSubmit={handleSubmit}>
        <h2 className="text-center my-3">Admin Login</h2>
        <div className="col-12 form-controls">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className='mb-2'
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="col-12 form-controls">
          <label htmlFor="upassword">Password</label>
          <div className='input-group mb-2'>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="upassword"
              name="upassword"
              value={formData.upassword}
              onChange={handleChange}
              className='form-control'
            />
            <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
            </span>
          </div>
          {errors.upassword && <div className="error">{errors.upassword}</div>}
        </div>
        <button type='submit' className='mt-3 ht_btn'>Submit</button>
      </Form>
      <ToastContainer />
    </div>
  );
}
