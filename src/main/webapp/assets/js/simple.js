$(document).ready(function() {
	var socketServerUrl = 'ws://192.168.1.222:8080/newcollweb/uploadfile'
	var files = [];
	
	if( !WebSocketFileTransfer.supported() ) {
		alert('WebSocketFileTransfer is not fully supported by your browser');
		return;		
	}
	
	// Get the files selected by the user
	$('input[type=file]').change(function(event) {
		files = event.target.files;
	});
	
	// Upload the files when user submit the form
	$('form').submit(function() {
		
		// Checks user has selected one or more files
		if( files.length == 0 ) {
			alert('select files first !');
			return false;
		}
		
		for(var i=0; i < files.length; i++) {
			
			var $transfer = $('<div />').addClass('transfer');
			var $progress = $('<div />').addClass('progress')
			var $progressBar = $('<div />').addClass('progressBar');
			$progressBar.append($progress);
			
			$transfer.append($progressBar);
			
			$('#progresses').append($transfer);
			
			// Creates the transfer
			var transfer = Object.create(WebSocketFileTransfer);
			transfer.initialize({
				url: socketServerUrl,
				file: files[i],
				blockSize: 1024,
				type: 'binary',
				$progress: $progress,
				progress: function(event) {
					this.$progress.css('width', event.percentage+'%');
				},
				success: function(event) {
					this.$progress.addClass('finished');					
				}
			});
		
			// Starts the transfer
			transfer.start();
			
		}
		
		return false;
	});

});