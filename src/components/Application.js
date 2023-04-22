import React, { useState, useEffect } from "react";
import Axios from "axios";

import "./Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";

//import { useApplicationData } from "hooks/useApplicationData";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day)

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
  
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
      />
    );
  });

  const setDay = (day) => setState({ ...state, day });
  //const setDays = days => setState(prev => ({ ...prev, days}));

  useEffect(() => {
    Promise.all([
      Axios.get("api/days"), 
      Axios.get("api/appointments"), 
      Axios.get("api/interviewers")])
      .then(
        (all) => {
        console.log("Days", all[0]);
        console.log("Appointments", all[1]);
        console.log("Interviewers", all[2])
        //setDays(days.data);
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }));
      }
    );
  }, []);

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
