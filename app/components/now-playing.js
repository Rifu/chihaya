import Ember from "ember";

var NowPlayingComponent = Ember.Component.extend({
  classNames: ["now-playing-wrapper", "container"],
  player: null,
  playing: false,
  api: "http://radio.weeabros.com/api/",
  playlist: Ember.A(),

  didInsertElement: function(){
    this.createPlayer();
    this.updatePlaylist();
  },
  createPlayer: function(){ 
    var self = this;
    
    $('#now-playing').on('ended', function(){
      self.continuePlayback();
    });
    $('#now-playing').on('error', function(){
      self.continuePlayback();
    });

    this.set("player", $("#now-playing")[0]);
    this.playPlayer();
  },
  continuePlayback: function(){
    this.playPlayer();
    this.updatePlaylist();
  },
  playPlayer: function(){
    if(this.get("player")){
      this.set("playing", true);
      this.get("player").play();
    }else{
      this.createPlayer();
    }
  },
  pausePlayer: function(){
    this.set("playing", false);
    this.get("player").pause();
  },
  stopPlayer: function(){
    this.pausePlayer();
    this.set("player", null);
  },
  updatePlaylist: function(){
    var endpoint = this.get("api") + "playlist";
    var store = this.get("store");
    var playlist = this.get("playlist");

    $.get(endpoint)
    .done(function(response){
      $.each(response, function(k, songData){
        var song = store.createRecord('song', {
          songId: songData.song_id,
          title: songData.title,
          artist: songData.artist,
          duration: songData.duration,
          userRequested: songData.userRequested,
        });
        playlist.pushObject(song);
      })
    })
    .fail(function(response){
      //oops.wav
    })
  },

  actions: {
    play: function(){
      this.playPlayer();
    },
    pause: function(){
      this.pausePlayer();
    },
    stop: function(){
      this.stopPlayer();
    }
  }
});

export default NowPlayingComponent;

