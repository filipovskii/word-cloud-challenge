/** @jsx React.DOM */

var React = require('react/addons'),
    Topic = require('./topic');

var TopicCloud = React.createClass({

  getInitialState: function() {
    return {selectedTopic: this.props.topics[0]};
  },


  selectTopic: function(topicData) {
    return function() {
      this.setState({selectedTopic: topicData});
    }.bind(this);
  },


  render: function() {
    var topicNodes;

    topicNodes = this.props.topics.map(function(topicData) {
      var isSelected = this.state.selectedTopic === topicData;
      return <Topic
          key={topicData.id}
          onClick={this.selectTopic(topicData)}
          selected={isSelected}
          label={topicData.label}
          sentimentScore={topicData.senimentScore} />
    }.bind(this));

    return (
        <div>
          {topicNodes}
        </div>
    );
  }

});

module.exports = TopicCloud;
