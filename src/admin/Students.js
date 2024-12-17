import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, InputGroup, Modal } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { FaEdit, FaSearch, FaUser } from "react-icons/fa";
import { GrUpgrade } from "react-icons/gr";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Students() {
  const navigate = useNavigate();
  const logoutAdmin = () => {
    navigate("/");
  };
  const [show, setShow] = useState(false);
  const [idEditorDelete, setIdEditorDelete] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [search, setSearch] = useState("");
  const [add, setAdd] = useState(false);

  const initialFormData = {
    name: "",
    parentname: "",
    dob: "",
    gmail: "",
    number: "",
    wnumber: "",
    address: "",
    password: "",
    cpassword: "",
    image: null,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null); // ID of the student being edited
  const [adminStudents, setAdminStudents] = useState([]);
  const [edited, setEdited] = useState(false);
  const [del, setDel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  const studentDashboard = () => {
    navigate("/admin/student-view-admin");
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = "Please Enter Your Name";
    } else if (formData.name.length < 3) {
      tempErrors.name = "Name atleast have 3 characters";
    }
    if (!formData.parentname) {
      tempErrors.parentname = "Please Enter Your Parent Name";
    } else if (formData.parentname.length < 3) {
      tempErrors.studio = "Studio Name atleast have 3 characters";
    }
    if (!formData.gmail) {
      tempErrors.gmail = "Gmail is required";
    }
    if (!formData.number) {
      tempErrors.number = "Please enter your Number";
    }
    if (!formData.wnumber) {
      tempErrors.wnumber = "Please enter your Whatsappp No";
    }
    if (!formData.address) {
      tempErrors.address = "Please Enter Your address";
    } else if (formData.address.length < 10) {
      tempErrors.address = "Address atleast 10 characters";
    }
    if (!formData.password) {
      tempErrors.password = "Please Enter Password";
    }
    if (formData.password !== formData.cpassword)
      tempErrors.cpassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [roll, setRollNumber] = useState("");
  const [enroll, setEnRollNumber] = useState("");

  const getRollAndEnroll = async () => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getNumbers");

    try {
      const res = await axios.post(
        "https://www.globalschoolofyoga.com/grade/api/register.php",
        dataToSend
      );

      console.log(res.data);

      if (res.data.status === 1) {
        setRollNumber(res.data.roll);
        setEnRollNumber(res.data.enroll);
      } else {
        console.log("Something went wrong:", res.data.message);
      }
    } catch (error) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleGet = (student) => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getStudent");
    dataToSend.append("studentId", student);
    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/adminEdit&deleteStud.php",
        dataToSend
      )
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data = res.data.student;
          console.log(data);
          setFormData({
            name: data.name,
            parentname: data.parentname,
            gmail: data.gmail,
            dob: data.dob,
            number: data.number,
            wnumber: data.wnumber,
            address: data.address,
            image: data.image || null,
            password: "",
            cpassword: "",
          });
          setShow(true);
          setIsEdit(true);
          setEditStudentId(student);
        }
      })
      .catch((error) => {
        console.log("catch error", error);
      });
  };
  const handleShowDeleteModal = (id) => {
    setDeleteStudentId(id);
    setShowDeleteModal(true);
  };
  const handleDelete = () => {
    const deleteDatas = new FormData();
    deleteDatas.append("action", "delete");
    deleteDatas.append("studentId", deleteStudentId);

    // action: "delete",
    //   studentId: deleteStudentId,
    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/adminEdit&deleteStud.php",
        deleteDatas
      )
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.status === 1) {
          toast.success("Successfully student Deleted");
          setStudentList((prev) =>
            prev.filter((student) => student.id !== deleteStudentId)
          );
          setDel(true);
          setShowDeleteModal(false);
        } else {
          toast.warn("something went worng");
          setShowDeleteModal(false);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while deleting the student", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSend = new FormData();

      formDataToSend.append("roll", roll);
      formDataToSend.append("enroll", enroll);
      formDataToSend.append("action", isEdit ? "update" : "create");
      formDataToSend.append("studentId", isEdit ? editStudentId : null);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("parentname", formData.parentname);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("gmail", formData.gmail);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("number", formData.number);
      formDataToSend.append("wnumber", formData.wnumber);
      formDataToSend.append("address", formData.address);

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      } else if (isEdit) {
        formDataToSend.append("exitingImage", formData.image);
      }

      const url = isEdit
        ? "https://www.globalschoolofyoga.com/grade/api/admin/adminEdit&deleteStud.php"
        : "https://www.globalschoolofyoga.com/grade/api/admin/adminRegStudents.php";

      axios
        .post(url, formDataToSend)
        .then((response) => {
          console.log(response.data);
          if (response.data && response.data.status === 1) {
            if (isEdit) {
              // Update the student list if editing
              setAdminStudents((prev) =>
                prev.map((student) =>
                  student.id === editStudentId ? response.data : student
                )
              );
              toast.success("Student updated successfully");
              setEdited(true);
            } else {
              // Add new student if creating
              setAdminStudents((prev) => [...prev, response.data.newStudent]);
              toast.success("Student added successfully");
            }
            setFormData(initialFormData); // Reset the form
            setShow(false); // Close the modal
            setIsEdit(false); // Reset the edit mode
            setAdd(true); // Trigger re-render after adding/editing
          } else {
            toast.warn("Failed to submit: " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("Submission failed: " + error.message);
        });
    }
  };
  const handleStudentGrade = async (student) => {
    const idToSend = {
      studentId: student,
      action: "grade",
    };
    await axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/adminViewStudGrade.php",
        idToSend
      )
      .then((res) => {
        console.log(res.data);
        navigate("/admin/student-view-admin", {
          state: { studentId: student },
        }); // Pass state
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  useEffect(() => {
    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/listStudent.php",
        {
          action: "listStudent",
        }
      )
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data = res.data.listStudent;
          setStudentList(data);
        }
      })
      .catch((error) => {
        console.log("catch error", error);
      });

    getRollAndEnroll();
  }, [add, edited]);
  return (
    <div className="student_section">
      <div className="d-md-flex justify-content-between mb-5">
        <h2>Students Management</h2>
        <div>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      <InputGroup className="search-input mb-5">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="shadow-none"
        />
      </InputGroup>
      <Button
        variant="primary shadow-none"
        onClick={handleShow}
        className="edit py-2 px-3 mb-4"
      >
        Add Student
      </Button>
      {/* exit modal */}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog ">
          <div class="modal-content">
            <div class="modal-body text-center">Are You Want to Exit?</div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={logoutAdmin}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* delete modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Body className="py-3 fs-5 text-center">
          Are you sure you want to delete this student?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Update Existing Student" : "Add New Student"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around p-0">
          <Form
            autoComplete="off"
            className="add-trainer p-3"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-3">
              {isEdit ? "Update student" : "Register For Student"}
            </h2>
            <div className="row">
              {!isEdit && (
                <>
                  <div className="col-md-6 form-controls">
                    <label htmlFor="roll">RollNo:</label>
                    <input
                      style={{ cursor: "not-allowed" }}
                      type="text"
                      id="roll"
                      name="roll"
                      value={roll}
                      readOnly
                      className="mb-2"
                    />
                  </div>
                  <div className="col-md-6 form-controls">
                    <label htmlFor="enroll">EnrollNo:</label>
                    <input
                      style={{ cursor: "not-allowed" }}
                      type="text"
                      id="enroll"
                      name="enroll"
                      value={enroll}
                      readOnly
                      className="mb-2"
                    />
                  </div>
                </>
              )}

              <div className="col-md-6 form-controls">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
              <div className="col-md-6 form-controls">
                <label htmlFor="parentname" className="parentname">
                  Father's/Husband's/Guardian's Name
                </label>
                <input
                  type="text"
                  id="parentname"
                  name="parentname"
                  value={formData.parentname}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors.parentname && (
                  <div className="error">{errors.parentname}</div>
                )}
              </div>
              <div className="col-md-6 form-controls">
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
              <div className="col-md-6 form-controls">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="mb-2"
                />
                {errors.dob && <div className="error">{errors.dob}</div>}
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
                {errors.password && (
                  <div className="error">{errors.password}</div>
                )}
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
                <label htmlFor="number">Number</label>
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
                {errors.wnumber && (
                  <div className="error">{errors.wnumber}</div>
                )}
              </div>
              <div className="col-lg-6 form-controls">
                <label htmlFor="address">Address</label>
                <textarea
                  name="address"
                  rows="2"
                  cols="25"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mb-2"
                ></textarea>
                {errors.address && (
                  <div className="error">{errors.address}</div>
                )}
              </div>
              <div className="col-lg-6 ">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleChange}
                  className="mb-2"
                ></input>
                {errors.image && <div className="error">{errors.image}</div>}
              </div>
            </div>
            <button type="submit" className="mt-3 ht_btn">
              {isEdit ? "Update" : "Submit"}
            </button>
          </Form>
          <ToastContainer />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="table-scroll">
        <table className="table-fill" striped bordered hover>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>PROFILE</th>
              <th>ROLLNO</th>
              <th>ENROLLNO</th>
              <th>NAME</th>
              {/* <th>EMAIL</th>
              <th>PHONE</th>
              <th>REGISTER BY</th> */}
              <th>CREATE DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {studentList
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.name.toLowerCase().includes(search) ||
                      item.registeredBy.toLowerCase().includes(search);
              })
              .map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`http://localhost/newyoga/${item.image}`}
                      alt="profile"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item.roll}</td>
                  <td>{item.enroll}</td>
                  <td>{item.name}</td>
                  {/*<td>{item.gmail}</td>
                  <td>{item.number}</td>
                  <td>{item.registeredBy}</td> */}
                  <td>{item.date}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="outline-success shadow-none"
                        className="edit py-2 px-3"
                        onClick={() => handleGet(item.id)}
                      >
                        EDIT <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger shadow-none"
                        className="delete"
                        onClick={() => {
                          handleShowDeleteModal(item.id);
                        }}
                      >
                        DELETE <MdDeleteOutline />
                      </Button>
                      <Button
                        variant="outline-warning shadow-none"
                        onClick={() => {
                          handleStudentGrade(item.id);
                        }}
                        className="grade"
                      >
                        VIEW GRADE <GrUpgrade />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
