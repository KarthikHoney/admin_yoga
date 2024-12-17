import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const goToLogin = () =>{
        navigate('/')
    } 
    const initialFormData = {
        name: '',
        parentname: '',
        dob: '',
        number: '',
        wnumber: '',
        address: '',
        grade: '',
        password: '',
        cpassword: ''
    }
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if(value){
            setErrors({...errors, [name] : ""});
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.parentname) tempErrors.parentname = "Parent name is required";
        if (!formData.dob) tempErrors.dob = "Date of Birth is required";
        if (!formData.number) tempErrors.number = "Number is required";
        if (!formData.wnumber) tempErrors.wnumber = "WhatsApp Number is required";
        if (!formData.address) tempErrors.address = "Address is required";
        if (!formData.grade) tempErrors.grade = "Grade is required";
        if (!formData.password) tempErrors.password = "Password is required";
        if (formData.password !== formData.cpassword) tempErrors.cpassword = "Passwords do not match";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Submit form data
            // console.log("Form data submitted: ", formData);
            toast("Submitted Successfully");
            setFormData(initialFormData);
        }
    };

    return (
        <div className='login-page d-flex justify-content-center align-items-center min-vh-100'>
            <Form autoComplete='off' onSubmit={handleSubmit}>
                <h2 className='text-center mb-3'>Register For Student</h2>
                <div className="row">
                    <div className="col-md-6 form-controls">
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
                    <div className="col-md-6 form-controls">
                        <label htmlFor="parentname" className='parentname'>Father's/Husband's/Guardian's Name</label>
                        <input
                            type="text"
                            id="parentname"
                            name="parentname"
                            value={formData.parentname}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        {errors.parentname && <div className="error">{errors.parentname}</div>}
                    </div>
                    <div className="col-md-6 form-controls">
                        <label htmlFor="gmail">Gmail</label>
                        <input
                            type="text"
                            id="gmail"
                            name="gmail"
                            value={formData.gmail}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        {errors.gmail && <div className="error">{errors.gmail}</div>}
                    </div>
                    <div className="col-md-6 form-controls">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        {errors.dob && <div className="error">{errors.dob}</div>}
                    </div>
                    <div className="col-md-6 form-controls password">
                        <label htmlFor="password">Create Password</label>
                        <div className='input-group mb-2'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className='form-control'
                            />
                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </span>
                        </div>
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <div className="col-md-6 form-controls ">
                        <label htmlFor="cpassword">Confirm Password</label>
                        <div className='input-group mb-2'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="cpassword"
                                name="cpassword"
                                value={formData.cpassword}
                                onChange={handleChange}
                                className='form-control'
                            />
                            <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </span>
                        </div>
                        {errors.cpassword && <div className="error">{errors.cpassword}</div>}
                    </div>
                    <div className="col-md-6 form-controls">
                        <label htmlFor="number">Number</label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            className='mb-2'
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
                            className='mb-2'
                        />
                        {errors.wnumber && <div className="error">{errors.wnumber}</div>}
                    </div>
                    <div className="col-md-6 form-controls">
                        <label htmlFor="grade">Choose Exam Grade</label>
                        <select
                            id="grade"
                            className='mb-2'
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                        >
                            <option value="">Select Grade</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        {errors.grade && <div className="error">{errors.grade}</div>}
                    </div>
                <div className="col-md-6 form-controls">
                    <label htmlFor="address">Address</label>
                    <textarea
                        name="address"
                        rows="1"
                        cols="25"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className='mb-2'
                    ></textarea>
                    {errors.address && <div className="error">{errors.address}</div>}
                </div>
                </div>
                <a href="" className='text-right' onClick={goToLogin}>Already Have an Account?</a>
                <button type='submit' onClick={handleSubmit} className='mt-3 ht_btn'>Submit</button>
            </Form>
            <ToastContainer />
        </div>
    );
}
