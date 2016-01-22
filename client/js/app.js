$(function(){
	var ds = deepstream( 'localhost:6020' );

	$( 'form' ).on( 'submit', function( event ){
		event.preventDefault();

		var authData = {
			username: $( 'form input[type="text"]' ).val(),
			password: $( 'form input[type="password"]' ).val()
		};
	
		ds.login( authData, function( success, errorEvent, errorMessage ) {
			if( success ) {
				new StickyNoteBoard( ds );
				new VideoChat( ds, authData.username );
				$( '.login' ).hide();
			} else {
				$( '.login-error' ).text( errorMessage ).show();
			}		
		});
	});
});