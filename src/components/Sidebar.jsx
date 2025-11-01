import React, { useState } from "react";
import "./Sidebar.css";
import homeIcon from "../assets/home.png";
import focusIcon from "../assets/clock.png";
import logoutIcon from "../assets/user-logout.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

return (
    <div className="sidebar">
      <ul className="menu">
        <li>
          <a href="#home">
            <img src={homeIcon} alt="Home" className="icon" />
            Home
          </a>
        </li>
        <li>
          <a href="/focussession">
            <img src={focusIcon} alt="Focus" className="icon" />
            Focus
          </a>
        </li>
  
        <li>
          <a href="#logout">
            <img src={logoutIcon} alt="Logout" className="icon" />
            Log Out
          </a>
        </li>
      </ul>
    </div>
  );
}
