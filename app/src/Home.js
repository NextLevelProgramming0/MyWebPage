import React, { Component } from "react";
import headerImage from "./assets/header.jpg";

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h2>Welcome to MyWebPage!</h2>
        <p>This is the home page of the MyWebPage application.</p>

        {/* Centered header image */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={headerImage}
            alt="Header"
            style={{ maxWidth: "25%", height: "auto" }}
          />
        </div>
      </div>
    );
  }
}

export default Home;