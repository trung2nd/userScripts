// U have to run this script in DevTools of the browser, this can't use if add to the browser bookmark
// And...u have to provide permission to facebook at chrome://settings/content/popups too so this script can open the image in new tab for u ;)
new Promise((resolve, reject) => {
	// Get ID of Image, if ID not exists => Let User Fill form
	let url = document.URL, imgId;
	if (url.match(/photo.php/g) !== null) {
		imgId = url.match(/(?<=fbid=)\d+/g)[0];
	} else {
		imgId = window.prompt("Image ID:");
	}
	resolve({id: imgId});
}).then((data) => {
	// Automatic get facebook token at your profile page
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "https://www.facebook.com/me/", false);
		xhr.onreadystatechange = function() {
			let match = this.responseText.match(/(?<=access_token:")\w+/g);
			data.token = match[0];
			resolve(data);
		}
		xhr.send(null);
	});
}).then((data) => {
	// Call API => Open Largest Image in New tab
	fetch(`https://graph.facebook.com/v3.1/${data.id}?fields=images&access_token=${data.token}`).then((res) => res.json()).then((res) => {
		window.open(res.images[0].source, "_blank");
	});
});
