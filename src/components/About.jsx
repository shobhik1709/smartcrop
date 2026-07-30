import React from "react";
import Navbar from "./Navbar";
import "./About.css";

function About() {
  return (
    <div>
      <Navbar />

      <div className="about-page">
        <div className="about-container">
          <h1>About SmartCrop</h1>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              SmartCrop is dedicated to helping farmers and agriculturists make informed decisions
              by providing real-time crop suggestions, weather monitoring, and a community platform
              to share knowledge.
            </p>
          </section>

          <section className="about-section">
            <h2>Why SmartCrop?</h2>
            <p>
              Agriculture is constantly evolving. SmartCrop bridges the gap between traditional farming
              and modern technology by providing personalized crop recommendations, soil insights,
              and a community to connect with experts.
            </p>
          </section>

          <section className="about-section">
            <h2>Developer & Team</h2>
            <p>
              Developed by Shobhik R, a passionate full-stack developer with a focus on agricultural
              technology solutions. Our team aims to empower farmers with accessible and actionable insights.
            </p>
          </section>

          <section className="about-section">
            <h2>Contact & Feedback</h2>
            <p>
              We value your feedback! Reach out to us via our Contact page for suggestions, queries, or
              support. Your input helps us improve SmartCrop.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
