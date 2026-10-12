import React from "react";
import "./AboutUs.css";
import Card from "../Components/Card";
import parthAvatar from "../assets/parth.jpg";

const AboutUs = () => {
  return (
    <div className="aboutCon1">
      <div className="aboutDiv1">
        <h1 className="here_1">Meet The</h1>
        <h1 className="here_1">
          <span className="silver-gradient">Creator & </span>
          <span className="green-gradient">Architect</span>
        </h1>

        <p className="DescriptionAbout_1">
          Designed and engineered by Parth Pandey — Full-Stack Developer & Cybersecurity Specialist. Built with a modern MERN stack to deliver seamless, secure, and intuitive personal financial management with enterprise-grade application security standards.
        </p>
      </div>

      <div className="aboutDiv2">
        <div className="box_1">
          <Card className="grayGradient">
            <div className="box1_Up">
              <div className="box_1_up_left">
                <img
                  src={parthAvatar}
                  alt="Parth Pandey"
                  className="logo_1"
                  style={{
                    borderRadius: "50%",
                    width: "65px",
                    height: "65px",
                    objectFit: "cover",
                    border: "2px solid #00FF66",
                    boxShadow: "0 0 12px rgba(0, 255, 102, 0.35)",
                  }}
                />
              </div>

              <div className="box_1_up_right">
                <div className="box_1_up_right_1">
                  <span className="createrNameinAbout">Parth Pandey</span>
                </div>

                <div className="box_1_up_right_2">
                  <span style={{ fontSize: "12px", color: "#00FF66", fontWeight: "600", letterSpacing: "0.5px" }}>Lead Developer & Architect</span>
                </div>
              </div>
            </div>

            <div className="box1_Down">
              <span className="CreaterDescription">
                Full-Stack & Security Engineering
                <br /> MERN Architecture & Secure Systems
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
