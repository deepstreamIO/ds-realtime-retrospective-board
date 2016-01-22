function StickyNoteBoard( ds ) {
	this.ds = ds;
	this.element = $( '.board' );

	// Similar to records, lists are identified by a unique name
	this.list = this.ds.record.getList( 'tutorial-board' );

	// Whenever an entry is added to the list, whether by this user or another
	this.list.on( 'entry-added', this.onStickyNoteAdded.bind( this ) );

	// Iterate through the existing stickynotes
	this.list.whenReady( this.onStickyNotesLoaded.bind( this ) );

	// This is what happens when a user clicks one of the small
	// stickynotes in the top right
	$( '.small-stickynote' ).click( this.createStickyNote.bind( this ) );
}

StickyNoteBoard.prototype.onStickyNotesLoaded = function() {
	// Call onStickyNoteAdded when the list loads initially
	this.list.getEntries().forEach( this.onStickyNoteAdded.bind( this ) );
};

StickyNoteBoard.prototype.onStickyNoteAdded = function( stickynoteID ) {
	new StickyNote( this.ds, stickynoteID, this.element );
};

StickyNoteBoard.prototype.createStickyNote = function( event ) {
	// We'll use a random unique id for each individual stickynote-record
	var stickynoteID = this.ds.getUid();
	var record = this.ds.record.getRecord( stickynoteID );

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
		this.list.addEntry( stickynoteID );
	}.bind( this ) );
};
