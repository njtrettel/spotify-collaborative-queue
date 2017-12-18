import React from 'react';
import { connect } from 'react-redux';
import { getSongs } from '../../actions/songs';
import { playSong, playMultipleSongs, queueSong } from '../../actions/player';
import classnames from 'classnames';
import _ from 'lodash';
import { Table, Segment, Header, Button, Search } from 'semantic-ui-react';

const actions = {
  getSongs,
  playSong,
  playMultipleSongs,
  queueSong
};

const stateToProps = (state, ownProps) => {
  const songs = state.songs;
  return {
    songs
  };
};

const filterSongs = (songs, filter) => {
  if (!filter) {
    return songs;
  }
  return _.filter(songs, (song) => {
    const title = _.get(song, 'title', '').toLowerCase();
    const artists = _.get(song, 'artists', '').toLowerCase();
    const lowerCaseFilter = filter.toLowerCase();
    return (_.includes(title, lowerCaseFilter) || _.includes(artists, lowerCaseFilter));
  });
};

class Songs extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = {
      filter: ''
    };
  }

  componentWillMount() {
    if (_.isEmpty(_.get(this.props.songs, 'songs'))) {
      this.props.getSongs();
    }
  }

  onChange(e) {
    this.setState({ filter: e.target.value });
  }

  renderSongsTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <Header as='h1' className="songs__header">Songs</Header>
            <Button primary compact
              className="songs__shuffle-play"
              onClick={() => this.props.playMultipleSongs(this.props.deviceId,
                _.get(this.props.songs, 'songs', [])
              )}
            >
              Shuffle Play
            </Button>
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>
            <Search className="songs__filter" onSearchChange={this.onChange} open={false} size="big" />
          </Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
    );
  }

  renderSongsTable() {
    return (
      <Table basic='very' celled>
        {this.renderSongsTableHeader()}
        <Table.Body>
          {_.map(filterSongs(_.get(this.props.songs, 'songs', []), this.state.filter), (song, i) => (
            <Table.Row key={i} className="songs__song">
              <Table.Cell className="songs__song--title">
                <Header as='h4'>
                  <Header.Content className="songs__song--clickable" onClick={() => this.props.playSong(this.props.deviceId, song)}>
                      {_.get(song, 'title')}
                    <Header.Subheader>{_.get(song, 'artists')}</Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell className="songs__song--actions">
                <Button basic compact className="songs__action--queue" onClick={() => this.props.queueSong(song)}>
                  Queue
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  render() {
    const classes = classnames(this.props.className, 'songs');
    const deviceId = _.get(this.props, 'deviceId');
    const songs = _.get(this.props, 'songs', { error: 'Empty songs' });
    if (songs.loading) {
      return <Segment loading basic size="large" className="context__loading" />;
    }
    if (!!songs.error) {
      return <div>{songs.error.toString()}</div>;
    }
    return (
      <div className={classes}>
        {this.renderSongsTable()}
      </div>
    );
  }
}

export default connect(stateToProps, actions)(Songs);
