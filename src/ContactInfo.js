import React, { Component } from 'react';
import { variables } from './Variables';

export class ContactInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      modalTitle: '',
      ContactId: 0,
      Email: '',
      PhoneNumber: '',
      Address: ''
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    fetch(variables.API_URL + 'contactinfo/')
      .then(res => res.json())
      .then(data => this.setState({ contacts: data }));
  }

  changeEmail = (e) => { this.setState({ Email: e.target.value }); };
  changePhoneNumber = (e) => { this.setState({ PhoneNumber: e.target.value }); };
  changeAddress = (e) => { this.setState({ Address: e.target.value }); };

  addClick() {
    this.setState({ modalTitle: 'Add Contact', ContactId: 0, Email: '', PhoneNumber: '', Address: '' }, () => {
      const modalEl = document.getElementById('contactModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  editClick(c) {
    this.setState({ modalTitle: 'Edit Contact', ContactId: c.ContactId, Email: c.Email, PhoneNumber: c.PhoneNumber, Address: c.Address }, () => {
      const modalEl = document.getElementById('contactModal');
      if (window.bootstrap) { new window.bootstrap.Modal(modalEl).show(); }
    });
  }

  createClick() {
    fetch(variables.API_URL + 'contactinfo/', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ Email: this.state.Email, PhoneNumber: this.state.PhoneNumber, Address: this.state.Address }) })
      .then(res => res.json())
      .then((result) => {
        this.refreshList();
        const modalEl = document.getElementById('contactModal');
        if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
      }, (error) => { console.error(error); alert('Create failed'); });
  }

  updateClick() {
    fetch(variables.API_URL + 'contactinfo/', { method: 'PUT', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ContactId: this.state.ContactId, Email: this.state.Email, PhoneNumber: this.state.PhoneNumber, Address: this.state.Address }) })
      .then(res => res.json())
      .then((result) => {
        this.refreshList();
        const modalEl = document.getElementById('contactModal');
        if (window.bootstrap) { const modal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl); modal.hide(); }
      }, (error) => { console.error(error); alert('Update failed'); });
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      fetch(variables.API_URL + 'contactinfo/?id=' + id, { method: 'DELETE', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then((result) => { this.refreshList(); }, (error) => { console.error(error); alert('Delete failed'); });
    }
  }

  render() {
    const { contacts, modalTitle, ContactId, Email, PhoneNumber, Address } = this.state;

    return (
      <div className="ContactInfo">
        <h2>Contact Information</h2>
        <button type="button" className="btn btn-primary m-2 float-end" onClick={() => this.addClick()}>Add Contact</button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Options</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map(c => (
              <tr key={c.ContactId}>
                <td>{c.Email}</td>
                <td>{c.PhoneNumber}</td>
                <td>{c.Address}</td>
                <td>
                  <button type="button" className="btn btn-light mr-1" onClick={() => this.editClick(c)} aria-label="Edit Contact">
                    Edit Contact
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                  </button>

                  <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(c.ContactId)} aria-label="Delete Contact">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="contactModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Email</span>
                  <input type="email" className="form-control" value={Email} onChange={this.changeEmail} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Phone</span>
                  <input type="text" className="form-control" value={PhoneNumber} onChange={this.changePhoneNumber} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Address</span>
                  <input type="text" className="form-control" value={Address} onChange={this.changeAddress} />
                </div>

                {ContactId === 0 ? (
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
