import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const JoinRoom = (props) => {
  return (
    <div className="room">
      <Link to="/room/nick/songs"><Button>Join Room "nick"</Button></Link>
    </div>
  );
};

JoinRoom.propTypes = {
};

export default JoinRoom;
