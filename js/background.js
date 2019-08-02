chrome.extension.onRequest.addListener(function (message, sender, sendResponse) { 
	if (message.title === 'SHOW_RESPONSE'){
		$.ajax({ 
			type: 'GET', 
			url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+message.video_id+'&fields=items/snippet/description,items/snippet/thumbnails&key=AIzaSyBxfC2fV7Zfi9jhNU3uco-CF32vmx8NIMU'
		}).done(function (success) {
			sendResponse(success);
		}).fail(function () {
			sendMessage(error);
		});
	}
})