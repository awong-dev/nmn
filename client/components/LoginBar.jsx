import React from 'react'

class LoginBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logged_in: false };
  }


  render() {
    return (
      <header className="login-bar mdc-toolbar mdc-toolbar--fixed">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">Status</span>
          </section>
          <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
            <button className="login-button mdc-toolbar__icon">Login</button>
          </section>
        </div>
      </header>
    );
  }
}

export default LoginBar;
