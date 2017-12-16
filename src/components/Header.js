import React from 'react';
import classnames from 'classnames';

const Header = (props) => {
  const classes = classnames(props.className, 'header');
  return (
    <div className={classes}>
      Spotify Collaborative Queue
    </div>
  );
};

export default Header;
