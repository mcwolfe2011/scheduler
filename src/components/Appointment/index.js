import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Error from "./Error";
import Confirm from "./Confirm";

import "components/Appointment/styles.scss";

import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";

const CREATE = "CREATE";
const SAVE = "SAVE";

const CONFIRM = "CONFIRM";
const DELETING = "DELETE";

const EDIT = "EDIT";

const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { id, interview, interviewers, bookInterview, cancelInterview } = props;

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  const onAdd = function () {
    transition(CREATE);
  };

  // CREATE AN INTERVIEW
  function onSave(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE); // LOADING SCREEN FOR SAVE

    bookInterview(id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(err => {
        transition(ERROR_SAVE, true);
        console.log(err.message);
      });
  }

  // WHEN YOU WANT TO EDIT INTERVIEW
  function onEdit(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVE);

    bookInterview(id, interview).then(() => {
      transition(SHOW);
    });
  }

  // WHEN YOU WANT TO DELETE INTERVIEW

  function onConfirm() {
    transition(DELETING, true); // LOADING SCREEN FOR DELETE

    cancelInterview(id, interview)
      .then(() => {
        transition(EMPTY);
      })
      .catch(err => {
        transition(ERROR_DELETE, true);
        console.log(err.message);
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => onAdd()} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => {
            transition(CONFIRM);
          }}
          onEdit={() => {
            transition(EDIT);
          }}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={onSave}
        />
      )}
      {mode === SAVE && <Status message="Saving..." />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={onConfirm}
          onCancel={back}
        />
      )}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === EDIT && (
        <Form
          name={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onSave={onEdit}
          onCancel={back}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment" onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete appointment" onClose={back} />
      )}
    </article>
  );
}
