import React, { Component } from 'react';
import { variables } from './Variables';
import { authFetch } from './Auth';

export class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: [],
      modalTitle: '',
      ExperienceId: 0,
      JobTitle: '',
      CompanyName: '',
      Duration: '',
      Description: ''
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    authFetch(variables.API_URL + 'experience/')
      .then(res => res.json())
      .then(data => this.setState({ experiences: data }));
  }

  changeJobTitle = (e) => { this.setState({ JobTitle: e.target.value }); };
  changeCompanyName = (e) => { this.setState({ CompanyName: e.target.value }); };
  changeDuration = (e) => { this.setState({ Duration: e.target.value }); };
  changeDescription = (e) => { this.setState({ Description: e.target.value }); };

  addClick() {
    this.setState({ modalTitle: 'Add Experience', ExperienceId: 0, JobTitle: '', CompanyName: '', Duration: '', Description: '' }, () => {
      const modalEl = document.getElementById('experienceModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(exp) {
    this.setState({
      modalTitle: 'Edit Experience',
      ExperienceId: exp.ExperienceId,
      JobTitle: exp.JobTitle,
      CompanyName: exp.CompanyName,
      Duration: exp.Duration,
      Description: exp.Description
    }, () => {
      const modalEl = document.getElementById('experienceModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    authFetch(variables.API_URL + 'experience/', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ JobTitle: this.state.JobTitle, CompanyName: this.state.CompanyName, Duration: this.state.Duration, Description: this.state.Description })
    })
      .then(res => res.json())
      .then((result) => {
        this.refreshList();
        const modalEl = document.getElementById('experienceModal');
        if (window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      }, (error) => { console.error(error); alert('Create failed'); });
  }

  updateClick() {
    authFetch(variables.API_URL + 'experience/', {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ExperienceId: this.state.ExperienceId, JobTitle: this.state.JobTitle, CompanyName: this.state.CompanyName, Duration: this.state.Duration, Description: this.state.Description })
    })
      .then(res => res.json())
      .then((result) => {
        this.refreshList();
        const modalEl = document.getElementById('experienceModal');
        if (window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      }, (error) => { console.error(error); alert('Update failed'); });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      authFetch(variables.API_URL + 'experience/?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  render() {
    const { experiences, modalTitle, ExperienceId, JobTitle, CompanyName, Duration, Description } = this.state;

    return (
      <div className="Experience">
        <h2>My Experience</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Experience</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            {experiences.map(exp => (
              <tr key={exp.ExperienceId}>
                <td>{exp.JobTitle}</td>
                <td>{exp.CompanyName}</td>
                <td>{exp.Duration}</td>
                <td>{exp.Description}</td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(exp)} aria-label="Edit Experience">
                    Edit Experience
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(exp.ExperienceId)} aria-label="Delete Experience">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="experienceModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Job Title</span>
                  <input type="text" className="form-control" value={JobTitle} onChange={this.changeJobTitle} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Company</span>
                  <input type="text" className="form-control" value={CompanyName} onChange={this.changeCompanyName} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Duration</span>
                  <input type="text" className="form-control" value={Duration} onChange={this.changeDuration} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Description</span>
                  <input type="text" className="form-control" value={Description} onChange={this.changeDescription} />
                </div>

                {ExperienceId === 0 ? (
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
