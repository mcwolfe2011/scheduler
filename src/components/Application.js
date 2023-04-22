import React, { useState, useEffect } from "react";
import Axios from "axios";
import "components/Application.scss";
import "components/Appointment";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

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
        {dailyAppointments.map((appointment) => {
          return <Appointment key={appointment.id} {...appointment} />;
        })}
      </section>
    </main>
  );
}