export function getAppointmentsForDay(state, day) {

  const dayObj = state.days.find((obj) => {
    return obj.name === day;
  })

  if (!dayObj || state.days.length === 0) {
    return [];
  }

  const appointmentIds = dayObj.appointments;

  const appointments = appointmentIds.map((id) => {
    return state.appointments[id];
  })

  return appointments;
};






















