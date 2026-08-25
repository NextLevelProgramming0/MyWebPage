import React, { Component } from 'react';
import { variables } from './Variables';

export class Education extends Component {
  constructor(props) {
    super(props);
    this.state = {
      educations: [],
      modalTitle: '',
      EducationId: 0,
      Degree: '',
      DegreeImage: '',
      DegreeImageFile: null,
      DegreeFileType: '',
      Institution: '',
      YearOfCompletion: ''
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    fetch(variables.API_URL + 'education/')
      .then(res => res.json())
      .then(data => this.setState({ educations: data }));
  }

  changeDegree = (e) => { this.setState({ Degree: e.target.value }); };

  changeDegreeImage = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const preview = URL.createObjectURL(file);
      if (this.state.DegreeImage && this.state.DegreeImage.startsWith('blob:')) {
        URL.revokeObjectURL(this.state.DegreeImage);
      }
      this.setState({ DegreeImageFile: file, DegreeImage: preview, DegreeFileType: file.type });
    } else {
      this.setState({ DegreeImageFile: null, DegreeImage: '', DegreeFileType: '' });
    }
  };

  changeInstitution = (e) => { this.setState({ Institution: e.target.value }); };
  changeYearOfCompletion = (e) => { this.setState({ YearOfCompletion: e.target.value }); };

  addClick() {
    this.setState({ modalTitle: 'Add Education', EducationId: 0, Degree: '', DegreeImage: '', DegreeImageFile: null, DegreeFileType: '', Institution: '', YearOfCompletion: '' }, () => {
      const modalEl = document.getElementById('educationModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(ed) {
    this.setState({
      modalTitle: 'Edit Education',
      EducationId: ed.EducationId,
      Degree: ed.Degree,
      DegreeImage: ed.DegreeImage,
      DegreeImageFile: null,
      DegreeFileType: ed.DegreeImage && ed.DegreeImage.toLowerCase().endsWith('.pdf') ? 'application/pdf' : '',
      Institution: ed.Institution,
      YearOfCompletion: ed.YearOfCompletion
    }, () => {
      const modalEl = document.getElementById('educationModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    if (this.state.DegreeImageFile) {
      const fd = new FormData();
      fd.append('Degree', this.state.Degree);
      fd.append('Institution', this.state.Institution);
      fd.append('YearOfCompletion', this.state.YearOfCompletion);
      fd.append('DegreeImage', this.state.DegreeImageFile);

      fetch(variables.API_URL + 'education/', { method: 'POST', body: fd })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Create failed'); });
    } else {
      fetch(variables.API_URL + 'education/', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ Degree: this.state.Degree, Institution: this.state.Institution, YearOfCompletion: this.state.YearOfCompletion }) })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Create failed'); });
    }
  }

  updateClick() {
    if (this.state.DegreeImageFile) {
      const fd = new FormData();
      fd.append('EducationId', this.state.EducationId);
      fd.append('Degree', this.state.Degree);
      fd.append('Institution', this.state.Institution);
      fd.append('YearOfCompletion', this.state.YearOfCompletion);
      fd.append('DegreeImage', this.state.DegreeImageFile);

      fetch(variables.API_URL + 'education/', { method: 'PUT', body: fd })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Update failed'); });
    } else {
      fetch(variables.API_URL + 'education/', { method: 'PUT', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ EducationId: this.state.EducationId, Degree: this.state.Degree, Institution: this.state.Institution, YearOfCompletion: this.state.YearOfCompletion }) })
        .then(res => res.json())
        .then((result) => {
          this.refreshList();
          const modalEl = document.getElementById('educationModal');
          if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
        }, (error) => { console.error(error); alert('Update failed'); });
    }
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      fetch(variables.API_URL + 'education/?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  deleteDegreeFile(educationId) {
    if (!educationId || !window.confirm('Delete this degree file?')) {
      return;
    }

    fetch(variables.API_URL + 'education/' + educationId + '/file/', {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
        return res.json();
      })
      .then(() => {
        if (this.state.EducationId === educationId) {
          if (this.state.DegreeImage && this.state.DegreeImage.startsWith('blob:')) {
            URL.revokeObjectURL(this.state.DegreeImage);
          }
          this.setState({ DegreeImage: '', DegreeImageFile: null, DegreeFileType: '' });
        }
        this.refreshList();
      })
      .catch(error => {
        console.error(error);
        alert(error.error || 'File deletion failed');
      });
  }

  downloadDegreeFile = async (education) => {
    try {
      const response = await fetch(variables.API_URL + 'education/' + education.EducationId + '/download/');
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = education.DegreeImage.split('/').pop() || 'degree-file';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  render() {
    const { educations, modalTitle, EducationId, Degree, DegreeImage, DegreeFileType, Institution, YearOfCompletion } = this.state;

    return (
      <div className="Education">
        <h2>My Education</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Education</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Degree</th>
              <th>Institution</th>
              <th>Year</th>
              <th>Degree File</th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            {educations.map(ed => (
              <tr key={ed.EducationId}>
                <td>{ed.Degree}</td>
                <td>{ed.Institution}</td>
                <td>{ed.YearOfCompletion}</td>
                <td>
                  {ed.DegreeImage ? (
                    <>
                      <a href={new URL(ed.DegreeImage, variables.API_URL).href} target="_blank" rel="noreferrer">
                        View
                      </a>
                      {' | '}
                      <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => this.downloadDegreeFile(ed)}>
                        Download
                      </button>
                      {' | '}
                      <button
                        type="button"
                        className="btn btn-link link-danger p-0 align-baseline"
                        onClick={() => this.deleteDegreeFile(ed.EducationId)}
                      >
                        Delete
                      </button>
                    </>
                  ) : 'No file'}
                </td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(ed)} aria-label="Edit Education">
                    Edit Education
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(ed.EducationId)} aria-label="Delete Education">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="educationModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Degree</span>
                  <input type="text" className="form-control" value={Degree} onChange={this.changeDegree} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Degree file</span>
                  <input type="file" className="form-control" accept="application/pdf,image/*" onChange={this.changeDegreeImage} />
                </div>

                {DegreeImage && DegreeFileType === 'application/pdf' ? (
                  <div className="mb-3">
                    <a href={DegreeImage} target="_blank" rel="noreferrer">View selected PDF</a>
                  </div>
                ) : DegreeImage ? (
                  <div className="mb-3">
                    <img src={DegreeImage} alt="Degree" style={{ maxWidth: '150px' }} />
                  </div>
                ) : null}

                <div className="input-group mb-3">
                  <span className="input-group-text">Institution</span>
                  <input type="text" className="form-control" value={Institution} onChange={this.changeInstitution} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Year</span>
                  <input type="text" className="form-control" value={YearOfCompletion} onChange={this.changeYearOfCompletion} />
                </div>

                {EducationId === 0 ? (
                  <button type="button" className="btn btn-primary float-start" onClick={() => this.createClick()}>Create</button>
                ) : (
                  <button type="button" className="btn btn-primary float-start" onClick={() => this.updateClick()}>Update</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
} 
