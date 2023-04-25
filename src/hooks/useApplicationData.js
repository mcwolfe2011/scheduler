import { useEffect, useState } from "react";
import axios from "axios";

export function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      setState(prev => ({ ...prev, days, appointments, interviewers }));
    });
  }, []);

  const setDay = day => setState({ ...state, day });

  // UPDATE AVAILABLE SPOTS ------------------------------------------------------
  function updateSpots(newAppointments) {
    return state.days.map(day => {
      let freeSpots = 0;

      for (const id of day.appointments) {
        if (!newAppointments[id].interview) {
          freeSpots++;
        }
      }

      return { ...day, spots: freeSpots };
    });
  }

  // CREATE/EDIT THE INTERVIEW --------------------------------------------------
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      setState({ ...state, appointments, days: updateSpots(appointments) });
    });
  }

  // DELETE THE INTERVIEW ---------------------------------------------------------
  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, { interview }).then(() => {
      setState({ ...state, appointments, days: updateSpots(appointments) });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
