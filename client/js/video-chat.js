function VideoChat( ds, username ) {
	this.ds = ds;
	this.username = username;
	this.outerElement = $( '.video-chat' );
	this.localStream = null;

	navigator.mediaDevices.getUserMedia({
		video: { width: 160, height: 120 },
		audio: false
	})
	.then( this.onLocalStream.bind( this ) )
	.catch( this.onError.bind( this ) );
}

VideoChat.prototype.onIncomingCall = function( call, metaData ) {
	this.bindCallEvents( call, metaData.user );
	call.accept( this.localStream );
};

VideoChat.prototype.onCallees = function( callees ) {
	var call, i;

	for( i = 0; i < callees.length; i++ ) {
		if( callees[ i ] !== this.username ) {
			call = this.ds.webrtc.makeCall( callees[ i ], { user: this.username }, this.localStream );
			this.bindCallEvents( call, this.username );
		}
	}

	this.ds.webrtc.unlistenForCallees();
};

VideoChat.prototype.onLocalStream = function( localStream ) {
	this.localStream = localStream;
	this.addVideo( this.username, localStream, true );
	this.ds.webrtc.registerCallee( this.username, this.onIncomingCall.bind( this ) );
	this.ds.webrtc.listenForCallees( this.onCallees.bind( this ) );
};

VideoChat.prototype.onError = function( error ) {
	alert( error.name || error );
};

VideoChat.prototype.bindCallEvents = function( call, username ) {
	call.once( 'established', this.addVideo.bind( this, username ) );
	call.once( 'ended', this.removeVideo.bind( this, username ) );
};

VideoChat.prototype.addVideo = function( username, stream, muted ) {
	var video = $( '<video></video>' ).attr({
		'width': '160px',
		'height': '120px',
		'autoplay': 'autoplay',
		'muted': muted,
		'data-username': username
	});
	video[0].srcObject = stream;
	this.outerElement.append( video );
};

VideoChat.prototype.removeVideo = function( username ) {
	this.outerElement.find( '[data-username="' + username + '"]').remove();
};