import React, { useState } from "react";

import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  const { interviewers, onSave, onCancel } = props;

  const [name, setName] = useState(props.name || "");

  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const [error, setError] = useState("");

  function reset() {
    setName("");
    setError("");
    setInterviewer(null);
  }

  function cancel() {
    reset();
    onCancel();
  }

  // Validate that the input does not include integers
  function numberInName(name) {
    const numRegEx = /\d/;
    const numInName = name.search(numRegEx);
    return !(numInName === -1);
  }

  function validate() {
    if (numberInName(name)) {
      setError("Your name must only contain letters");
      return;
    }

    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (!interviewer) {
      setError("Please select an interviewer");
      return;
    }

    setError("");
    onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Enter Student Name"
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
