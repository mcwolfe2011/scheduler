import React, { useState, useEffect } from "react";
import Axios from "axios";

import "./Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";

//import { useApplicationData } from "hooks/useApplicationData";

import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    bookInterview: { bookInterview },
    cancelInterview: { cancelInterview }
  });

  const appointments = getAppointmentsForDay(state, state.day);
  const setDay = day => setState({ ...state, day });
  //const setDays = days => setState(prev => ({ ...prev, days}));

  //Working on this today April 24
  function bookInterview(id, interview) {
    setState({ ...state, appointments });
    //console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return Axios.put(`/api/appointmnets/${id}`, {
      interview
    }).then(() => {
      setState({ ...state, appointments: appointments });
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Axios.delete(`api/appointments/${id}`).then(() => {
      setState({ ...state, appointments: appointments });
    });
  }

  useEffect(() => {
    Promise.all([
      Axios.get("api/days"),
      Axios.get("api/appointments"),
      Axios.get("api/interviewers")
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);

  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
