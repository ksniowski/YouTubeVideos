chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.action === 'GET_VIDEOS') {
		sendVideos();
	}
})

function sendVideos(){
	let elements = document.querySelectorAll('a#video-title');
	let videos = {
		"total" : elements.length,
		"content" : []
	}

	elements.forEach(item => {
		let href = item.href.split('=').pop();
		videos.content.push({title: item.innerHTML = item.innerText || item.textContent, id: href})
	})

	chrome.runtime.sendMessage({ action: "SEND_VIDEOS", object: videos}, function (response) { });
}