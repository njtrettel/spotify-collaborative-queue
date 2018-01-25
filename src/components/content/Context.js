import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { Table, Segment, Header } from 'semantic-ui-react';

const stateToProps = (state, ownProps) => {
  const context = state.context;
  const nowPlaying = state.nowPlaying;
  return {
    context, nowPlaying
  };
};

const renderSong = (song) => (
  <Header as='h4'>
    <Header.Content className="context__song--title">
        {_.get(song, 'title')}
      <Header.Subheader>{_.get(song, 'artists')}</Header.Subheader>
    </Header.Content>
  </Header>
);

const renderSection = (contextSection) => {
  if (contextSection.loading) {
    return <Segment loading basic className="context__loading" />;
  }
  if (contextSection.error) {
    return <div>{contextSection.error}</div>;
  }
  return (
    <Table basic='very' celled>
      <Table.Body>
        {_.map(_.get(contextSection, 'songs', []), (song, i) => (
          <Table.Row key={i} className="context__song">
            <Table.Cell>
              {renderSong(song)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const renderNowPlaying = (props) => {

};

const Context = (props) => {
  const classes = classnames(props.className, 'context');
  const nowPlaying = _.get(props, 'nowPlaying', {});
  const queue = _.get(props.context, 'queue');
  const upNext = _.get(props.context, 'upNext');
  return (
    <div className={classes}>
      <Header as='h1' className="context__header">Now Playing</Header>
      {_.some(nowPlaying.song) ? renderSong(nowPlaying.song) : null}
      <Header as='h1' className="context__header">Queue</Header>
      {_.some(queue.songs) ? renderSection(queue) : null}
      <Header as='h1' className="context__header">Up Next</Header>
      {_.some(upNext.songs) ? renderSection(upNext) : null}
    </div>
  );
};

export default connect(stateToProps)(Context);
