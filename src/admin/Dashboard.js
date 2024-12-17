import React, { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [totalStudent, setTotalStudent] = useState("");
  const [totalTrainer, setTotalTrainer] = useState("");
  const navigate = useNavigate();

  const logoutAdmin = () => {
    navigate("/");
  };

  const fetchData = async (queryType) => {
    try {
      const response = await fetch(
        "https://www.globalschoolofyoga.com/grade/api/admin/adminDashboard.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({ queryType }), // Send the queryType in the body
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const studentData = await fetchData("student");
      const trainerData = await fetchData("trainer");

      if (studentData && studentData.status === 1) {
        setTotalStudent(studentData.total_student);
      }
      if (trainerData && trainerData.status === 1) {
        setTotalTrainer(trainerData.total_trainer);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="d-md-flex justify-content-between mb-5">
        <h2>Admin Dashboard</h2>
        <div>
        <a href=""  data-bs-toggle="modal" data-bs-target="#exampleModal">
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
              <button type="button" class="btn btn-primary" onClick={logoutAdmin}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-box">
        <div className="total-members">
          <h3>Total Students</h3>
          <h1 className="fs-1">{totalStudent}</h1>
        </div>
        <div className="total-members">
          <h3>Total Trainers</h3>
          <h1 className="fs-1">{totalTrainer}</h1>
        </div>
      </div>
    </div>
  );
}
