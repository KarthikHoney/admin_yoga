import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, InputGroup, Modal } from "react-bootstrap";
import { FaEdit, FaSearch } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Trainer() {
  const navigate = useNavigate();
  const logoutAdmin = () => {
    navigate("/");
  };
  const tstudent = () => {
    navigate("/admin/tstudent");
  };

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const initialFormData = {
    name: "",
    studio: "",
    gmail: "",
    number: "",
    wnumber: "",
    address: "",
    password: "",
    cpassword: "",
    timage: null,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [deleteTrainerId, setDeleteTrainerId] = useState(null);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [adminTrainer, setAdminTrainer] = useState([]);
  const [editTrainerId, setEditTrainerId] = useState(null);
  const [edited, setEdited] = useState(false);
  const [trainerList, setTrainerList] = useState([]);
  const [del, setDel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [add, setAdd] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "timage" && files.length > 0) {
      setFormData({ ...formData, timage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    const re = /^(?=.[A-Z])(?=.[\W]).{8,}$/;
    return re.test(password);
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = "Please Enter Your Name";
    } else if (formData.name.length < 3) {
      tempErrors.name = "Name atleast have 3 characters";
    }
    if (!formData.studio) {
      tempErrors.studio = "Please Enter Your Studio Name";
    } else if (formData.studio.length < 3) {
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

  const handleGet = (trainer) => {

    const TrainerData = new FormData()
    TrainerData.append('action','getTrainer')
    TrainerData.append('trainerId',trainer)
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/adminEdit&deleteTrain.php", TrainerData)
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data = res.data.student;
          console.log(data);
          setFormData({
            name: data.name,
            studio: data.studio,
            gmail: data.gmail,
            dob: data.dob,
            number: data.number,
            wnumber: data.wnumber,
            address: data.address,
            timage:data.timage || null,
            password: "",
            cpassword: "",
          });
          setShow(true);
          setIsEdit(true);
          setEditTrainerId(trainer);
        }
      })
      .catch((error) => {
        console.log("catch error", error);
      });
  };

  const handleShowDeleteModal = (id) => {
    setDeleteTrainerId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    const deleteDatas = {
      action: "delete",
      trainerId: deleteTrainerId,
    };
    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/adminEdit&deleteTrain.php",
        deleteDatas
      )
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.status === 1) {
          toast.success("Successfully student Deleted");
          setTrainerList((prev) =>
            prev.filter((trainer) => trainer.id !== deleteTrainerId)
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
  const handleTrainerStudent = async (trainer) => {
    const idtosend = new FormData()
    idtosend.append('trainerId',trainer)
    idtosend.append('action','grade')
  
    await axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/adminViewTrainerStud.php", idtosend)
      .then((res) => {
        console.log(res.data);
        navigate("/admin/tstudent", {
          state: { trainerId: trainer },
        });
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSend = new FormData();
      formDataToSend.append("action", isEdit ? "update" : "create");
      formDataToSend.append("trainerId", isEdit ? editTrainerId : null);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("studio", formData.studio);
      formDataToSend.append("gmail", formData.gmail);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("number", formData.number);
      formDataToSend.append("wnumber", formData.wnumber);
      formDataToSend.append("address", formData.address);


      if(formData.timage instanceof File){
        formDataToSend.append("timage", formData.timage);

      }else if(isEdit){
        formDataToSend.append('exitingImage',formData.timage)
      }

      const url = isEdit
        ? "https://www.globalschoolofyoga.com/grade/api/admin/adminEdit&deleteTrain.php"
        : "https://www.globalschoolofyoga.com/grade/api/admin/adminRegTrainer.php";

      axios
        .post(url, formDataToSend)
        .then((response) => {
          console.log(response.data);
          if (response.data && response.data.status === 1) {
            if (isEdit) {
              setAdminTrainer((prev) =>
                prev.map((trainer) =>
                  trainer.id === editTrainerId ? response.data : trainer
                )
              );
              toast.success("trainer updated successfully");
              setEdited(true);
            } else {
              setAdminTrainer((prev) => [...prev, response.data.newTrainer]);
              toast.success("trainer added successfully");
            }
            setFormData(initialFormData);
            setShow(false);
            setIsEdit(false);
            setAdd(true);
          } else {
            toast.warn("Failed to submit: " + response.data.message);
          }
        })
        .catch((error) => {
          toast.error("Submission failed: " + error.message);
        });
    }
  };

  useEffect(() => {
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/listTrainer.php", {
        action: "listTrainer",
      })
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data = res.data.listTrainer;
          setAdminTrainer(data);
        }
      })
      .catch((error) => {
        console.log("catch error", error);
      });
  }, [del, add, edited]);

  return (
    <div>
      <div className="d-md-flex justify-content-between mb-5">
        <h2>Trainer Management</h2>
        <div>
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
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
          <Button
            variant="danger"
            onClick={() => {
              handleDelete();
              setShowDeleteModal(false);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Update Existing Trainer" : "Add New Trainer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around p-0">
          <Form
            autoComplete="off"
            className="add-trainer p-3"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-3">
              {isEdit ? "Update Trainer" : "Register For Trainer"}
            </h2>
            <div className="row">
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
                  className="mb-2 w-100"
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
                {errors.wnumber && (
                  <div className="error">{errors.wnumber}</div>
                )}
              </div>
              <div className="col-lg-6 form-controls">
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
                {errors.address && (
                  <div className="error">{errors.address}</div>
                )}
              </div>
              <div className="col-lg-6 ">
                <label htmlFor="timage">Address</label>
                <input
                  name="timage"
                  type="file"
                  id="timage"
                  onChange={handleChange}
                  className="mb-2"
                ></input>
                {errors.address && (
                  <div className="error">{errors.address}</div>
                )}
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-3 ht_btn"
            >
              {isEdit ? "Update" : "Submit"}
            </button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
        Add Trainer
      </Button>
      <div className="table-scroll">
        <table className="table-fill" striped bordered hover>
          <thead>
            <tr>
              <th>S.NO</th>
              <th>PROFILE</th>
              <th>TRAINER NAME</th>
              <th>STUDIO NAME</th>
              <th>GMAIL</th>
              <th>PASSWORD</th>
              <th>NUMBER</th>
              <th>OPERATIONS</th>
            </tr>
          </thead>
          <tbody>
            {adminTrainer
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.name.toLowerCase().includes(search) ||
                      item.studio.toLowerCase().includes(search);
              })
              .map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`https://www.globalschoolofyoga.com/grade/api/${item.timage}`}
                      alt="profile"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.studio}</td>
                  <td>{item.gmail}</td>
                  <td>{item.password}</td>
                  <td>{item.number}</td>

                  <td>
                    <ButtonGroup>
                      <Button
                        variant="outline-success shadow-none"
                        className="edit py-2 px-3"
                        onClick={() => {
                          handleGet(item.id);
                        }}
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
                        className=""
                        onClick={() => {
                          handleTrainerStudent(item.id);
                        }}
                      >
                        VIEW STUDENT <MdDeleteOutline />
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
