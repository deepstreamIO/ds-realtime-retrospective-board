var template = 
	'<div class="postit large-postit">' +
	  '<div class="postit-header">' +
	  '</div>' +
	  '<div class="postit-inner">' +
	    '<textarea class="postit-copy"></textarea>' +
	  '</div>' +
	'</div>';

function Postit( ds, recordID, parentElement ) {
	this.ds = ds;
	this.record = this.ds.record.getRecord( recordID );
	this.parentElement = parentElement;
	this.element = $( template );

	this.textArea = this.element.find( '.postit-copy' );
	this.record.whenReady( this.initialise.bind( this ) );
}

Postit.prototype.initialise = function() {

	// Set the type to sad, mad or glad
	this.element.attr( 'data-type', this.record.get( 'type' ) );
	
	// Subscribe to incoming changes to the postit-text
	this.record.subscribe( 'content', function( value ) {
		this.textArea.val( value );
	}.bind( this ), true );

	// Store and propagate changes to the postit-text made by this user
	this.textArea.keyup( function() {
		this.record.set( 'content', this.textArea.val() );
	}.bind( this ) );

	// Update the record's position on screen whenever it is dragged
	this.record.subscribe( 'position', function( position ) {
		this.element.css( position );
	}.bind( this ), true );

	// Make this record draggable using jQuery UI
	this.element.draggable({
		handle: ".postit-header",
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