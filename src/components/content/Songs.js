import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import { Table, Segment, Header } from 'semantic-ui-react';
import { playSong } from '../../actions/player';

const actions = {
  playSong
};

const renderSongsTable = (props) => (
  <Table basic='very' celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell><Header as='h1'>Songs</Header></Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {_.map(props.songs.data, (song, i) => (
        <Table.Row key={i} className="songs__song">
          <Table.Cell>
            <Header as='h4'>
              <Header.Content className="songs__song--title songs__song--clickable" onClick={() => props.playSong(props.deviceId, song)}>
                  {_.get(song, 'title')}
                <Header.Subheader>{_.get(song, 'artists')}</Header.Subheader>
              </Header.Content>
            </Header>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const Songs = (props) => {
  const classes = classnames(props.className, 'songs');
  const deviceId = _.get(props, 'deviceId');
  const songs = _.get(props, 'songs', { error: 'Empty songs' });
  if (songs.loading) {
    return <Segment loading />;
  }
  if (!!songs.error) {
    return <div>{songs.error.toString()}</div>;
  }
  return (
    <div className={classes}>
      {renderSongsTable(props)}
    </div>
  );
};

export default connect(null, actions)(Songs);
