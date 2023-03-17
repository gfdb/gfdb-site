
function trim_url_domain(url_to_trim) {
	/* 
		Accepts a url and returns the url stripped of the http/domain_name
		since the body's texture is already loaded it has https://domain_name
		in it, so the following is to remove that before comparing strings
	*/
	if (url_to_trim === undefined)
		return url_to_trim
	if (!url_to_trim.includes('http'))
		return url_to_trim
	
	let tmp_url = window.location.href
	const tmp_path = window.location.pathname

	if (tmp_path === '/')
		// we are on the homepage (we remove the '/')
		tmp_url = tmp_url.slice(0, -1)
	else
		// we are somewhere else
		tmp_url = tmp_url.replace(tmp_path, '')

	return url_to_trim.replace(tmp_url, '') 
}

function load_image(url, return_image_obj = false) {
	/*  loads an image and returns the loaded url or optionally the
		image object
	*/
	let img = new Image()
	img.src = url
	if (return_image_obj)
		return img
	return img.src
}

const loadImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = url
		let imgObj = {}
		imgObj[url] =img
		img.onload = () => resolve(imgObj)
		img.onerror = () => reject(imgObj)
	})
}

function preload_sprites(arr_sprite_urls, return_img_obj = false) {
	/* Accepts an array of image paths and returns a dictionary with a
	   structure of {given_path:loaded_image_url}, optionally return_img_obj
	   can be passed to return loaded image objects in place of the url
	*/
	let loaded_sprites = {}
	if (return_img_obj)
		arr_sprite_urls.forEach(sprite_url => {
			loaded_sprites[sprite_url] = load_image(sprite_url, true)}
		)
	else
		arr_sprite_urls.forEach(sprite_url => loaded_sprites[sprite_url] = load_image(sprite_url))
	return loaded_sprites
}

const find_body_in_array = (body_label, array) => {
	// todo: optimize this lol
	if (!array) return undefined
	for (let i = 0; i < array.length; i++) {
		if (body_label === array[i].label)
			return array[i]
	}
	return undefined
}

export {trim_url_domain, preload_sprites, find_body_in_array, loadImage}