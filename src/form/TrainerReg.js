import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TrainerReg() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/");
  };
  const initialFormData = {
    tname: "",
    studio: "",
    gmail: "",
    number: "",
    wnumber: "",
    address: "",
    password: "",
    cpassword: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (number) => {
    const re = /^\d{10}$/;
    return re.test(number);
  };
  const isNumeric = (value) => {
    return /^\d*$/.test(value);
  };
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[\W]).{8,}$/;
    return re.test(password);
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.tname) {
      tempErrors.tname = "Please Enter Your Name";
    } else if (formData.tname.length < 3) {
      tempErrors.tname = "Name atleast have 3 characters";
    }
    if (!formData.studio) {
      tempErrors.studio = "Please Enter Your Studio Name";
    } else if (formData.studio.length < 3) {
      tempErrors.studio = "Studio Name atleast have 3 characters";
    }
    if (!formData.gmail) {
      tempErrors.gmail = "Gmail is required";
    } else if (!validateEmail(formData.gmail)) {
      tempErrors.gmail = "Enter Valid Gmail";
    }
    if (!formData.number) {
      tempErrors.number = "Please enter your Number";
    } else if (!isNumeric(formData.number)) {
      tempErrors.number = "Please enter Numbers Only";
    } else if (!validatePhoneNumber(formData.number)) {
      tempErrors.number = "Number must be 10 digits";
    }
    if (!formData.wnumber) {
      tempErrors.wnumber = "Please enter your Whatsappp No";
    } else if (!isNumeric(formData.wnumber)) {
      tempErrors.wnumber = "Please enter Numbers Only";
    } else if (!validatePhoneNumber(formData.wnumber)) {
      tempErrors.wnumber = "Number Must be 10 digits";
    }
    if (!formData.address) {
      tempErrors.address = "Please Enter Your address";
    } else if (formData.address.length < 10) {
      tempErrors.address = "Address atleast 10 characters";
    }
    if (!formData.password) {
      tempErrors.password = "Please Enter Password";
    } else if (!validatePassword(formData.password)) {
      tempErrors.password =
        "Password must be at least 8 characters long, contain one uppercase letter and one symbol";
    }
    if (formData.password !== formData.cpassword)
      tempErrors.cpassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      validate() &&
      formData.tname &&
      formData.studio &&
      formData.gmail &&
      formData.password &&
      formData.number &&
      formData.wnumber &&
      formData.address
    ) {
      const url = "http://localhost/PHPFolder/registerTrainer.php";
      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };

      try {
        const response = await fetch(url, option);
        const data = await response.json();
        console.log(data);
        if (data.status === 200) {
          console.log("success");
        } else {
          toast("Submitted Successfully");
          navigate('/')
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      console.log("Form data is incomplete or invalid");
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <h2 className="text-center mb-3">Register For Trainer</h2>
        <div className="row">
          <div className="col-md-6 form-controls">
            <label htmlFor="tname">Name</label>
            <input
              type="text"
              id="tname"
              name="tname"
              value={formData.tname}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.tname && <div className="error">{errors.tname}</div>}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="studio" className="">
              Name Of Studio
            </label>
            <input
              type="text"
              id="studio"
              name="studio"
              value={formData.studio}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.studio && <div className="error">{errors.studio}</div>}
          </div>
          <div className="col-md-12 form-controls">
            <label htmlFor="gmail">Gmail</label>
            <input
              type="text"
              id="gmail"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.gmail && <div className="error">{errors.gmail}</div>}
          </div>
          <div className="col-md-6 form-controls password">
            <label htmlFor="password">Create Password</label>
            <div className="input-group mb-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
              <span
                className="input-group-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div className="col-md-6 form-controls ">
            <label htmlFor="cpassword">Confirm Password</label>
            <div className="input-group mb-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="cpassword"
                name="cpassword"
                value={formData.cpassword}
                onChange={handleChange}
                className="form-control"
              />
              <span
                className="input-group-text"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>
            {errors.cpassword && (
              <div className="error">{errors.cpassword}</div>
            )}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="number">Phone Number</label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.number && <div className="error">{errors.number}</div>}
          </div>
          <div className="col-md-6 form-controls">
            <label htmlFor="wnumber">WhatsApp Number</label>
            <input
              type="text"
              id="wnumber"
              name="wnumber"
              value={formData.wnumber}
              onChange={handleChange}
              className="mb-2"
            />
            {errors.wnumber && <div className="error">{errors.wnumber}</div>}
          </div>
          <div className="col-md-12 form-controls">
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              rows="3"
              cols="25"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="mb-2"
            ></textarea>
            {errors.address && <div className="error">{errors.address}</div>}
          </div>
        </div>
        <p
          style={{ cursor: "pointer" }}
          className="text-right"
          onClick={goToLogin}
        >
          Already Have an Account?
        </p>
        <button type="submit" onClick={handleSubmit} className="mt-3 ht_btn">
          Submit
        </button>
      </Form>
      <ToastContainer />
    </div>
  );
}