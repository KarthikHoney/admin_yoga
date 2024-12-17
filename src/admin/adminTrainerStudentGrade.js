import axios from "axios";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { FaArrowLeft, FaCloudDownloadAlt, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminTrainerStudentGrade() {
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };
  const studentAdmin = () => {
    navigate("/admin/trainer");
  };
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [show, setShow] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [certificateImage,setCertificateImage]=useState(null)
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleShowTrainerModal = () => setShowTrainerModal(true);
  const handleCloseTrainerModal = () => setShowTrainerModal(false);

  const handleShowCertificateModal = () => setShowCertificateModal(true);
  const handleCloseCertificateModal = () => setShowCertificateModal(false);
  

  const fetchCertificate = (studentId, gradeId) => {
    const HallTicketData = new FormData();
    HallTicketData.append("action", "generateCertificate");
    HallTicketData.append("studentId", studentId);
    HallTicketData.append("gradeId", gradeId);

    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/certificates.php", HallTicketData)
      .then((res) => {
        if (res.data && res.data.status === 1) {
          console.log(res.data.certificate);
          setCertificateImage(res.data.certificate);
          setSelectedGradeId(gradeId);
        } else {
          alert(
            "Failed to generate certificate: " +
              (res.data.message || "Unknown error")
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching certificate:", err);
        alert(
          "An error occurred while fetching the certificate. Please try again."
        );
      });
  };

  const fetchHallTicket = (studentId, gradeId) => {
    const HallTicketData = new FormData();
    HallTicketData.append("action", "generateHallTicket");
    HallTicketData.append("studentId", studentId);
    HallTicketData.append("gradeId", gradeId);

    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/hallTicket.php", HallTicketData)
      .then((res) => {
        if (res.data && res.data.status === 1) {
          console.log(res.data.hallTicket);
          setCertificateImage(res.data.hallTicket);
          setSelectedGradeId(gradeId);
        } else {
          alert(
            "Failed to generate certificate: " +
              (res.data.message || "Unknown error")
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching certificate:", err);
        alert(
          "An error occurred while fetching the certificate. Please try again."
        );
      });
  };

  const initialFormData = {
    grade: "",
    payment: "",
  };

  const handleGrade = () => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getGrade");
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/gradePrice.php", dataToSend)
      .then((res) => {
        if (res.data) {
          const data = res.data.grade;
          const payment = data.reduce((acc, item) => {
            acc[item.id] = item.TrainerPrice;
            return acc;
          }, {});
          setPaymentAmounts(payment);
        }
      });
  };

  const location = useLocation();
  const studentId = location.state?.studentId || localStorage.getItem("studId");
  useEffect(() => {
    if (location.state?.studentId) {
      localStorage.setItem("studId", location.state.studentId);
    }
    handleGrade();
  }, [location.state]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);
  const [gradeView, setGradeView] = useState(false);
  const [markGradeEdit, setMarkGradeEdit] = useState({});
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "grade") {
      const payment = paymentAmounts[value] || "";
      setFormData({ ...formData, grade: value, payment: payment });
    }

    if (value) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.grade) tempErrors.grade = "Grade is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setMarkGradeEdit({ ...markGradeEdit, [name]: value });
  };
  const updatingGradeMark = (id) => {
    const dataToSend = {
      action: "updateMark",
      gradeId: id,
      ...markGradeEdit,
    };
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/adminViewStudGrade.php", dataToSend)
      .then((res) => {
        if (res.data.status === 1) {
          setEditId(null);
          const updatedData = res.data.markGrade;
          setGrades((prev) =>
            prev.map((itemEach) =>
              itemEach.id === id ? updatedData : itemEach
            )
          );
        }
      })
      .catch((error) => {
        console.log("ErrorMessage:", error);
      });
  };

  const GettingGradeMark = (id) => {
    const dataToSend = {
      action: "GetGrades",
      gradeId: id,
    };
    axios
      .post("https://www.globalschoolofyoga.com/grade/api/admin/adminViewStudGrade.php", dataToSend)
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.status === 1) {
          const data = res.data.grade;
          setMarkGradeEdit(data);
          setEditId(id);
        }
      })
      .catch((error) => {
        console.log("Error_Message:", error);
      });
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const dataToSend = {
        action: "grade",
        grade: formData.grade,
        payment: formData.payment,
        studentId: studentId,
      };

      axios
        .post(
          "https://www.globalschoolofyoga.com/grade/api/admin/adminViewStudGrade.php",
          dataToSend
        )
        .then((response) => {
          if (response.data && response.data.status === 1) {
            toast.success("Grade Applied Successfully");
            setFormData(initialFormData);

            const gradeData = response.data.data;
            console.log(gradeData);
            if (gradeData) {
              setGrades((previousData) => [...previousData, gradeData]);
              setGradeView(true);
            }
          } else {
            toast.warn("Invalid data or no data returned");
          }
        })
        .catch((error) => {
          console.error("There was an error submitting the form!", error);
        });
    }
  };


  const AdminGradeView =()=>{
    if (studentId) {
      const metaGrade = {
        action: "fetchGrades",
        studentId,
      };
      axios
        .post(
          "https://www.globalschoolofyoga.com/grade/api/admin/adminViewStudGrade.php",
          metaGrade
        )
        .then((response) => {
          if (response.data && response.data.status === 1) {
            const getGrades = response.data.grades || [];
            const updateGrade = getGrades.map((item) => ({
              ...item,
              pending: item.mark === "" && item.gradeResult === "",
            }));
            setGrades(updateGrade);
          } else {
            console.log("No grades found or invalid data");
          }
        })
        .catch((error) => {
          console.error("Error fetching grades:", error);
        });
    }
  }

  useEffect(() => {
    AdminGradeView()
    GettingGradeMark()
  }, [studentId]);
  return (
    <div className="">
      <div className="d-md-flex justify-content-between">
        <div>
          <a href="#" onClick={studentAdmin}>
            <FaArrowLeft className="user-icon me-2 mb-3" />
          </a>
          <h2>Student Grade</h2>
        </div>
        <div className="align-self-center">
          <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>
      <p className="mb-5">You applied exam grade</p>
      <Button
        variant="primary shadow-none"
        onClick={handleShowTrainerModal}
        className="edit py-2 px-3 mb-4"
      >
        Apply Grade
      </Button>
      <Modal show={showTrainerModal} onHide={handleCloseTrainerModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Trainer</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Form
            autoComplete="off"
            className="add-trainer p-3"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-3">Register For Student</h2>
            <div className="row">
              <div className="col-12 form-controls">
                <label htmlFor="grade">Choose Exam Grade</label>
                <select
                  id="grade"
                  className="mb-2"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                >
                  <option value="">Select Grade</option>
                  {Object.keys(paymentAmounts)
                    .filter((grade) => {
                      // Ensure 'grades' is an array and has the necessary properties before filtering
                      return (
                        grades &&
                        Array.isArray(grades) &&
                        !grades.some(
                          (item) => item && item.grade === parseInt(grade)
                        )
                      );
                    })
                    .map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                </select>
                {errors.grade && <div className="error">{errors.grade}</div>}
              </div>
              <div className="col-12 form-controls">
                <label htmlFor="payment">Payment Amount</label>
                <input
                  type="text"
                  id="payment"
                  name="payment"
                  className="mb-2"
                  value={formData.payment}
                  readOnly
                />
              </div>
            </div>
            <button type="submit" className="mt-3 ht_btn">
              Submit
            </button>
          </Form>
          <ToastContainer />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTrainerModal}>
            Close
          </Button>
        </Modal.Footer>
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
                <button type="button" class="btn btn-primary" onClick={logout}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <div style={{ overflowX: "scroll" }}>
        <table class="table-fill">
          <thead>
            <tr>
              <th class="text-left">Applied Date</th>
              <th class="text-left">GradeNumber</th>
              <th class="text-left">Payment</th>
              <th class="text-left">Mark</th>
              <th class="text-left">Grade</th>
              <th class="text-left">Action</th>
              <th class="text-left">Hall Ticket</th>
              <th class="text-left">Certificate</th>
            </tr>
          </thead>
          <tbody className="table-hover">
            {grades.map((eachMark) =>
              editId === eachMark.id ? (
                <tr key={eachMark.id}>
                  <td className="text-left">{eachMark.date}</td>
                  <td className="text-left">{eachMark.grade}</td>
                  <td className="text-left">{eachMark.payment}</td>
                  <td>
                    <Form.Control
                      type="text"
                      name="mark"
                      value={markGradeEdit.mark || ""}
                      onChange={handleChangeData}
                    />
                  </td>
                  <td>
                  
                    <select
                      name="gradeResult"
                      onChange={handleChangeData}
                      value={markGradeEdit.gradeResult || ""}
                    >
                      <option value="A">A</option>
                      <option value="A+">A+</option>
                      <option value="A++">A++</option>
                      <option value="B">B</option>
                      <option value="B+">B+</option>
                      <option value="C">C</option>
                      <option value="N">N</option>
                    </select>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="outline-success"
                        onClick={() => updatingGradeMark(eachMark.id)}
                        className="m-1"
                      >
                        Save
                      </Button>
                      <Button variant="outline-danger" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </td>
                  <td className="text-left">
                    <ButtonGroup>
                      <Button
                        variant="outline-success shadow-none"
                        className="delete"
                      >
                        View Hall Ticket
                      </Button>
                    </ButtonGroup>
                  </td>
                  <td className="text-left">
                    {eachMark.pending ? (
                      "Processing..."
                    ) : (
                      <Button
                        variant="outline-info shadow-none"
                        className="delete"
                      >
                        View Certificate
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={eachMark.id}>
                  <td className="text-left">{eachMark.date}</td>
                  <td className="text-left">{eachMark.grade}</td>
                  <td className="text-left">{eachMark.payment}</td>
                  <td className="text-left">
                    {eachMark.pending ? "Pending..." : eachMark.mark}
                  </td>
                  <td className="text-left">
                    {eachMark.pending ? "Pending..." : eachMark.gradeResult}
                  </td>
                  <td>
                    <Button
                      variant="outline-success shadow-none"
                      className="delete"
                      onClick={() => GettingGradeMark(eachMark.id)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td className="text-left">
                    <ButtonGroup>
                      <Button
                        variant="outline-success shadow-none"
                        className="delete"
                        onClick={() => {
                          fetchHallTicket(studentId, eachMark.id);
                          handleShowCertificateModal();
                        }}
                      >
                        View Hall Ticket
                      </Button>
                    </ButtonGroup>
                  </td>
                  <td className="text-left">
                    {eachMark.pending ? (
                      "Processing..."
                    ) : (
                      <div>
                        <Button onClick={() => {
                            fetchCertificate(studentId, eachMark.id);
                            handleShowCertificateModal();
                          }}>
                          View Certificate
                        </Button>
                        
                      </div>
                    )}
                  </td>
                  {/* Modal for displaying certificate */}
                  <Modal
                    show={showCertificateModal}
                    onHide={handleCloseCertificateModal}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Certificate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {certificateImage ? (
                        <img
                          src={certificateImage}
                          alt="Certificate"
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : (
                        <p>Loading certificate...</p>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="warning"
                        className="d-flex align-self-center "
                        
                      >
                        <a style={{color:'black'}} href={certificateImage} download>Download </a><FaCloudDownloadAlt style={{fontSize:'23px',paddingLeft:'3px'}} />
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
