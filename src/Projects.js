import React, { Component } from 'react';
import { variables } from './Variables';
import { authFetch } from './Auth';

export class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      modalTitle: '',
      ProjectId: 0,
      ProjectName: '',
      ProjectDescription: '',
      ProjectLink: ''
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    authFetch(variables.API_URL + 'projects/')
      .then(response => response.json())
      .then(data => { this.setState({ projects: data }); });
  }

  changeProjectName = (e) => { this.setState({ ProjectName: e.target.value }); };
  changeProjectDescription = (e) => { this.setState({ ProjectDescription: e.target.value }); };
  changeProjectLink = (e) => { this.setState({ ProjectLink: e.target.value }); };

  addClick() {
    this.setState({ modalTitle: 'Add Project', ProjectId: 0, ProjectName: '', ProjectDescription: '', ProjectLink: '' }, () => {
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(project) {
    this.setState({
      modalTitle: 'Edit Project',
      ProjectId: project.ProjectId,
      ProjectName: project.ProjectName,
      ProjectDescription: project.ProjectDescription,
      ProjectLink: project.ProjectLink
    }, () => {
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    authFetch(variables.API_URL + 'projects/', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ProjectName: this.state.ProjectName, ProjectDescription: this.state.ProjectDescription, ProjectLink: this.state.ProjectLink })
    })
    .then(res => res.json())
    .then((result) => {
      this.refreshList();
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modal.hide();
      }
    }, (error) => { console.error(error); alert('Create failed'); });
  }

  updateClick() {
    authFetch(variables.API_URL + 'projects/', {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ProjectId: this.state.ProjectId, ProjectName: this.state.ProjectName, ProjectDescription: this.state.ProjectDescription, ProjectLink: this.state.ProjectLink })
    })
    .then(res => res.json())
    .then((result) => {
      this.refreshList();
      const modalEl = document.getElementById('projectModal');
      if (window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        modal.hide();
      }
    }, (error) => { console.error(error); alert('Update failed'); });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      authFetch(variables.API_URL + 'projects/?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  render() {
    const { projects, modalTitle, ProjectId, ProjectName, ProjectDescription, ProjectLink } = this.state;

    return (
      <div className="Projects">
        <h2>My Projects</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Project</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Link</th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            {projects.map(proj => (
              <tr key={proj.ProjectId}>
                <td>{proj.ProjectName}</td>
                <td>{proj.ProjectDescription}</td>
                <td><a href={proj.ProjectLink} target="_blank" rel="noreferrer">{proj.ProjectLink}</a></td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(proj)} aria-label="Edit Project">
                    Edit Project
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(proj.ProjectId)} aria-label="Delete Project">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="projectModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Project Name</span>
                  <input type="text" className="form-control" value={ProjectName} onChange={this.changeProjectName} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Description</span>
                  <input type="text" className="form-control" value={ProjectDescription} onChange={this.changeProjectDescription} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Link</span>
                  <input type="text" className="form-control" value={ProjectLink} onChange={this.changeProjectLink} />
                </div>

                {ProjectId === 0 ? (
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
