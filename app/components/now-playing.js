import Ember from "ember";

var NowPlayingComponent = Ember.Component.extend({
  classNames: ["now-playing-wrapper", "container"],
  player: null,
  playing: false,
  api: "http://radio.weeabros.com/api/",
  playlist: Ember.A(),
  lastSong: null,
  currentSong: null,

  didInsertElement: function(){
    this.createPlayer();
    this.advancePlaylist();
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
    this.advancePlaylist();
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
  advancePlaylist: function(){
    var lastSong = this.get("playlist").shiftObject();
    while(lastSong.songId == this.get("lastSong.songId")){
      lastSong = this.get("playlist").shiftObject();
    }
    this.set("lastSong", lastSong);
    this.updatePlaylist();
  },
  updatePlaylist: function(){
    var endpoint = this.get("api") + "playlist";
    var store = this.get("store");
    var playlist = this.get("playlist");
    var self = this;
    playlist.clear();

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
        if(k == 0){
          self.set("currentSong", song)
        }
      });
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

