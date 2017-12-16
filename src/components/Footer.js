import React from 'react';
import classnames from 'classnames';

const Footer = (props) => {
  const classes = classnames(props.className, 'footer');
  return (
    <div className={classes}>
      Hello World!!
    </div>
  );
};

export default Footer;
