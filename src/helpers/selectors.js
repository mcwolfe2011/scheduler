export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.find(obj => {
    return obj.name === day;
  });

  if (!dayObj || state.days.length === 0) {
    return [];
  }

  const appointmentIds = dayObj.appointments;

  const appointments = appointmentIds.map(id => {
    return state.appointments[id];
  });

  return appointments;
}

export function getInterviewersForDay(state, day) {
  const dayObj = state.days.find(obj => {
    return obj.name === day;
  });

  if (!dayObj || state.days.length === 0) {
    return [];
  }

  const interviewersArr = dayObj.interviewers;

  const interviewers = interviewersArr.map(id => {
    return state.interviewers[id];
  });

  return interviewers;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const id = interview.interviewer;
  const interviewer = state.interviewers[id];

  return { ...interview, interviewer };
}
