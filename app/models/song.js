import DS from "ember-data";

var Song = DS.Model.extend({
  songId: DS.attr('number'),
  title: DS.attr('string'),
  duration: DS.attr('number'),
  artist: DS.attr('string'),
  userRequested: DS.attr('boolean'),
  albumArt: function(){
    return "http://atran.net/static/album-art/" + this.get('songId') + ".jpg";
  }.property('songId')
});

export default Song;