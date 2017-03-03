$(function(){
	var ds = deepstream('APP URL');

	$( 'form' ).on( 'submit', function( event ){
		event.preventDefault();

		var authData = {
			type: 'email',
			email: $( 'form input[type="text"]' ).val(),
			password: $( 'form input[type="password"]' ).val()
		};
		ds.login( authData, function( success, errorEvent, errorMessage ) {
			if( success ) {
				new StickyNoteBoard( ds );
				$( '.login' ).hide();
			} else {
				$( '.login-error' ).text( errorMessage ).show();
			}
		});
	});
});
