var template = 
	'<div class="stickynote large-stickynote">' +
	  '<div class="stickynote-header">' +
	  '</div>' +
	  '<div class="stickynote-inner">' +
	    '<textarea class="stickynote-copy"></textarea>' +
	  '</div>' +
	'</div>';

function StickyNote( ds, recordID, parentElement ) {
	this.ds = ds;
	this.record = this.ds.record.getRecord( recordID );
	this.parentElement = parentElement;
	this.element = $( template );

	this.textArea = this.element.find( '.stickynote-copy' );
	this.record.whenReady( this.initialise.bind( this ) );
}

StickyNote.prototype.initialise = function() {

	// Set the type to sad, mad or glad
	this.element.attr( 'data-type', this.record.get( 'type' ) );
	
	// Subscribe to incoming changes to the stickynote-text
	this.record.subscribe( 'content', function( value ) {
		this.textArea.val( value );
	}.bind( this ), true );

	// Store and propagate changes to the stickynote-text made by this user
	this.textArea.keyup( function() {
		this.record.set( 'content', this.textArea.val() );
	}.bind( this ) );

	// Update the record's position on screen whenever it is dragged
	this.record.subscribe( 'position', function( position ) {
		this.element.css( position );
	}.bind( this ), true );

	// Make this record draggable using jQuery UI
	this.element.draggable({
		handle: ".stickynote-header",
		zIndex: 999,
		// Prevent jQuery draggable from updating the DOM position and
		// leave it to the record instead
		helper: function(){ return $( '<i></i>' ); },
		drag: function( event, ui ) {
			this.record.set( 'position', ui.position ); 		
		}.bind( this )
	});

	// Add the record to the board
	this.parentElement.append( this.element );
};