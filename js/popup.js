function openPage(pageName, element){
	let i, tabcontent, link;
	tabcontent = document.getElementsByClassName("action");
	link = document.getElementsByClassName("link");
	for (i = 0; i < tabcontent.length; i++) 
	{
		tabcontent[i].style.display = "none";
	}
	for (i = 0; i < tabcontent.length; i++)
	{
		link[i].classList.remove("active");
	}
	element.classList.add("active");
	document.getElementById(pageName).style.display = "block";
}

function setAction() {
	let id = this.getAttribute('data-id');
	chrome.extension.sendRequest({title: 'SHOW_RESPONSE', video_id: id}, 
		function (response) {
			showDetails(response);
		});
}

function buildVideos(videos){
	let list = document.getElementById('videos_list');
	let html = '<ul>';

	videos.content.forEach(item => {
		html += `<li class="yt_video" data-id="${item.id}">${item.title}</li>`;
	})

	html += '</ul>';

	list.innerHTML = "";
	list.insertAdjacentHTML('beforeend', html);

	let videos_li = document.querySelectorAll('.yt_video');

	for (i = 0; i < videos_li.length; i++) {
		videos_li[i].addEventListener('click', setAction, false);
	}
}

function showDetails(response) {
	let video_details = document.getElementById('video_details');
	let thumbnail = `<img src="${response.items[0].snippet.thumbnails.medium.url}"/>`;
	let description = `<div class="vid_desc">${response.items[0].snippet.description}</div>`;
	let details = thumbnail + description;

	video_details.innerHTML = "";
	video_details.insertAdjacentHTML('beforeend', details);
}

document.getElementById("show").style.display = "block";
document.getElementById("default_open").classList.add("active");

document.addEventListener('DOMContentLoaded', function() {
	const get = document.getElementById('get_videos');
	const info = document.getElementById('info_link');
	const show = document.getElementById('default_open');

	get.addEventListener('click', function() {
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			if (tabs.length > 0) {
				var url = tabs[0].url; 
				if(url.indexOf("www.youtube.com") > -1) {
					chrome.tabs.sendMessage(tabs[0].id, {
						action: "GET_VIDEOS"
					});
				} else {
					alert('You can only load videos while beign on YouTube site\nGo to www.youtube.com and try again.');
					window.close();
				}
			} else {
				alert('No window or tab selected');
				window.close();
			}
		});
	});

	info.addEventListener('click', function() {
		openPage('info', this);
	});		

	show.addEventListener('click', function() {
		openPage('show', this);
	});	
});

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.action === 'SEND_VIDEOS') {
		buildVideos(msg.object);
	}
	return true;
})