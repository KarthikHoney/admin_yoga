import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { IoIosPricetags } from 'react-icons/io';
import { PiStudentBold } from 'react-icons/pi';
import { RxDashboard } from 'react-icons/rx';
import { SiTrainerroad } from 'react-icons/si';
import { NavLink, Outlet } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <RxDashboard />
    },
    {
      path: '/admin/student',
      name: 'Student',
      icon: <PiStudentBold />
    },
    {
      path: '/admin/trainer',
      name: 'Trainer',
      icon: <SiTrainerroad />
    },
    {
      path: '/admin/student-price',
      name: 'Student Price',
      icon: <IoIosPricetags />
    },
    
  ];
  return (
    <div>
      <Container fluid className='flexbox p-0'>
        <div style={{ width: isOpen ? "auto" : "50px" }} className="sidebar">
          <div className="top_section">
            <div>
                <img
                    src={require("../assets/img/logo (1).png")}
                    style={{ display: isOpen ? "block" : "none", width: "60%" }}
                    className="logo"
                    alt='nice'
                />
            </div>            
            <div style={{ marginLeft: isOpen ? "auto" : "0px", cursor : "pointer" ,color :"#fff"}} className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          {menuItem.map((items, index) => (
            <NavLink to={items.path} key={index} className='link' activeclassname='active'>
              <div className="icon">{items.icon}</div>
              <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{items.name}</div>
            </NavLink>
          ))}
        </div>
        <main><Outlet /></main>
      </Container>
    </div>
  );
}
