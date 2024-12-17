import React, { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

export default function GradePrice() {
  const [gradePrice, setGradePrice] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  const logoutAdmin = () => {
    navigate("/");
  };

  const handleGet = (id) => {
    const dataToSend = new FormData();
    dataToSend.append("action", "getGradeId");
    dataToSend.append("gradeId", id);

    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/gradePrice.php",
        dataToSend
      )
      .then((res) => {
        if (res.data && res.data.status === 1) {
          const data = res.data.grade;
          setEditData(data); // Set the data to be edited
          setEditRowId(id); // Enable edit mode for this row
        }
      })
      .catch((error) => {
        console.log("catch error", error);
      });
  };

  const handleSave = (id) => {
    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/gradePrice.php",
        {
          action: "updateGrade",
          gradeId: id,
          ...editData,
        }
      )
      .then((res) => {
        if (res.data.status === 1) {
          setEditRowId(null);
          const updatedData = res.data.data;
          setGradePrice((prev) =>
            prev.map((item) => (item.id === id ? updatedData : item))
          );
        }
      });
  };

  const handleCancel = () => {
    setEditRowId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const getGradesPrice = () => {
    const datas = new FormData();
    datas.append("action", "getGrade");
    axios
      .post(
        "https://www.globalschoolofyoga.com/grade/api/admin/gradePrice.php",
        datas
      )
      .then((res) => {
        if (res.data && res.data.status===1) {
          setGradePrice(res.data.grade);
        }
      });
  };

  useEffect(() => {
    getGradesPrice();
  }, []);

  return (
    <div>
      <div className="d-md-flex justify-content-between mb-5">
        <h2>Grade Price Details </h2>
        <div>
          <a href="nice" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <CiLogout className="user-icon" />
          </a>
        </div>
      </div>

      {/* Exit Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body text-center">Are You Want to Exit?</div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={logoutAdmin}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-table d-block ms-auto me-auto">
        <table className="mt-5 table-fill w-50">
          <thead>
            <tr>
              <th>Sno:</th>
              <th>Grade</th>
              <th>Student Price</th>
              <th>Trainer Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gradePrice.map((each, index) =>
              editRowId === each.id ? (
                <tr key={each.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Form.Control
                      type="text"
                      name="grade"
                      value={editData.grade || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="studentPrice"
                      value={editData.studentPrice || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      name="TrainerPrice"
                      value={editData.TrainerPrice || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="outline-success"
                        onClick={() => handleSave(each.id)}
                        className="m-1"
                      >
                        Save
                      </Button>
                      <Button variant="outline-danger" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ) : (
                <tr key={each.id}>
                  <td>{index + 1}</td>
                  <td>{each.grade}</td>
                  <td>{each.studentPrice}</td>
                  <td>{each.TrainerPrice}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        variant="outline-success"
                        onClick={() => handleGet(each.id)}
                      >
                        Edit <FaEdit />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
