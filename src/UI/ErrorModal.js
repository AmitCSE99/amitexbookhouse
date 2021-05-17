import React from 'react';

import Modal from './Modal';
import classes from './ErrorModal.module.css'

const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<button className={classes.errorButton} onClick={props.onClear}>Okay</button>}>
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
