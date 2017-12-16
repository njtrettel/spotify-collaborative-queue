import React from 'react';
import classnames from 'classnames';
import { Grid } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import Content from './Content';

const SpotifyContent = (props) => {
  const classes = classnames(props.className, 'spotify-content');
  return (
    <Grid columns={16} className={classes}>
      <Grid.Row className="spotify-content__wrapper">
        <Grid.Column width={3} className="spotify-content__column spotify-content__column--sidebar">
          <Sidebar />
        </Grid.Column>
        <Grid.Column width={13} className="spotify-content__column spotify-content__column--main">
          <Content />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SpotifyContent;
