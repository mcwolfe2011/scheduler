import React from "react";
import "components/InterviewerListItem.scss";
const classNames = require('classnames');

export default function InterviewerListItem(props) {

  let interviewerStyles = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  })

  let imageStyles = classNames("interviewewers__item-image", {
    "interviewers__item--selected-image ": props.selected,
  })

  return (
    <li 
    className={interviewerStyles} 
    onClick={() => props.setInterviewer(props.id)}
    >
      <img
        className={imageStyles}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
