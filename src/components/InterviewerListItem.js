import React from "react";

import classnames from "classnames";

import "components/InterviewerListItem.scss";


export default function InterviewerListItem(props) {
  const { name, avatar, setInterviewer, selected } = props;

  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected": selected
  });

  const handleClick = () => {
    console.log(props.id)
    setInterviewer(props.id)
  }

  return (
    <li className={interviewerClass} onClick={handleClick} >
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  );
}