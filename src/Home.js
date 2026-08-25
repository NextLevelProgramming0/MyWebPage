import React, { Component } from "react";
import headerImage from "./assets/header.jpg";
import { variables } from './Variables';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { professionalPicture: null, useDefaultPicture: false, pictureLoaded: false, uploading: false };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    fetch(variables.API_URL + 'home/professional-picture/')
      .then(response => response.json())
      .then(data => {
        this.setState({
          professionalPicture: data.url || null,
          useDefaultPicture: Boolean(data.use_default),
          pictureLoaded: true
        });
      })
      .catch(error => {
        console.error('Could not load professional picture:', error);
        this.setState({ pictureLoaded: true });
      });
  }

  choosePicture = () => {
    this.fileInput.current.click();
  };

  uploadPicture = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    this.setState({ uploading: true });

    fetch(variables.API_URL + 'home/professional-picture/', {
      method: 'POST',
      body: formData
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed');
        return data;
      })
      .then(data => this.setState({
        professionalPicture: data.url + '?updated=' + Date.now(),
        useDefaultPicture: false,
        pictureLoaded: true,
        uploading: false
      }))
      .catch(error => {
        this.setState({ uploading: false });
        alert(error.message);
      });

    event.target.value = '';
  };

  render() {
    const { professionalPicture, useDefaultPicture, pictureLoaded, uploading } = this.state;
    const displayedPicture = professionalPicture || (useDefaultPicture ? headerImage : null);
    return (
      <div className="Home">
        <h2>Welcome to My Portfolio!</h2>
        <h4>Darius Quick - Software Developer</h4>
        <p><strong>Work Authorization:</strong> U.S. Citizen</p>
        <p>
          Baltimore, MD | <a href="tel:+14433374042">443-337-4042</a> |{' '}
          <a href="mailto:quickdarius1@gmail.com">quickdarius1@gmail.com</a> |{' '}
          <a href="mailto:quickdarius@yahoo.com">quickdarius@yahoo.com</a> |{' '}
          <a href="https://www.linkedin.com/in/darius-quick-a75726168/" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
        <section style={{ maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
          <h3>Professional Summary</h3>
          <p>
            Software engineer with experience building full-stack and backend applications using React,
            Django, Node.js, PostgreSQL, MongoDB, and AWS. Designed REST APIs, authentication systems,
            SQL automation pipelines, and serverless cloud services while collaborating in GitLab-based
            Agile engineering environments. Strong background in backend architecture, database design,
            API integration, cloud-native development, and end-to-end software delivery.
          </p>
        </section>

        {/* Centered header image */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            type="button"
            className="btn btn-link"
            onClick={this.choosePicture}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Your Professional Picture!'}
          </button>
          <input
            ref={this.fileInput}
            type="file"
            accept="image/*"
            onChange={this.uploadPicture}
            style={{ display: 'none' }}
          />
          <br />
          {pictureLoaded && displayedPicture ? (
            <img
              src={displayedPicture}
              alt="Professional"
              style={{ width: "25%", aspectRatio: "3 / 4", objectFit: "cover" }}
            />
          ) : pictureLoaded ? (
            <div
              aria-label="No professional picture uploaded"
              style={{ width: "25%", aspectRatio: "3 / 4", margin: "0 auto", background: "#f4f4f4", border: "2px dashed #c7c7c7" }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
