import React from 'react';
import classnames from 'classnames';

const Header = (props) => {
  const classes = classnames(props.className, 'header');
  return (
    <div className={classes}>
      Hello World!!
    </div>
  );
};

export default Header;
