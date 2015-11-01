function PostitBoard( ds ) {
	this.ds = ds;
	this.element = $( '.board' );

	// Similar to records, lists are identified by a unique name
	this.list = this.ds.record.getList( 'tutorial-board' );

	// Whenever an entry is added to the list, whether by this user or another
	this.list.on( 'entry-added', this.onPostitAdded.bind( this ) );

	// Iterate through the existing postits
	this.list.whenReady( this.onPostitsLoaded.bind( this ) );

	// This is what happens when a user clicks one of the small
	// postits in the top right
	$( '.small-postit' ).click( this.createPostit.bind( this ) );
}

PostitBoard.prototype.onPostitsLoaded = function() {
	// Call onPostitAdded when the list loads initially
	this.list.getEntries().forEach( this.onPostitAdded.bind( this ) );
};

PostitBoard.prototype.onPostitAdded = function( postitID ) {
	new Postit( this.ds, postitID, this.element );
};

PostitBoard.prototype.createPostit = function( event ) {
	// We'll use a random unique id for each individual postit-record
	var postitID = this.ds.getUid();
	var record = this.ds.record.getRecord( postitID );

	// Set the record's initial value
	record.set({
		// 'glad', 'sad' or 'mad'
		type: $( event.currentTarget ).data( 'type' ),
		// the content will be added later by the user
		content: '',
		//let's start with a random position close ot the center of the board
		position: {
			left: ( $(window).width() / 2 - 100 ) + ( Math.random() * 200 ),
			top: ( $(window).height() / 2 - 100 ) + ( Math.random() * 200 ),
		}
	});

	//ok, so much for our record. Once it's initialised, we'll add it
	//to the list
	record.whenReady(function(){
		this.list.addEntry( postitID );
	}.bind( this ) );
};
