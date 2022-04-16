
function trim_url_domain(url_to_trim) {
    /* 
      since the body's texture is already loaded it has the https://domain_name
      in it, so the following is to remove that before we compare paths
    */
    if (url_to_trim === undefined)
        return url_to_trim
    if (!url_to_trim.includes("http"))
        return url_to_trim
    
    let tmp_url = window.location.href
    const tmp_path = window.location.pathname

    if (tmp_path === '/')
        // we are on the homepage
        tmp_url = tmp_url.slice(0, -1)
    else
        // we are somewhere else
        tmp_url = tmp_url.replace(tmp_path, '')

    return url_to_trim.replace(tmp_url, '') 
}

// urls have to be preloaded
function load_image(url) {
    var img = new Image()
    img.src = url
    return img.src
}

function preload_sprites(arr_sprite_urls) {
    let loaded_sprites = new Object()
    arr_sprite_urls.forEach(sprite_url => loaded_sprites[sprite_url] = load_image(sprite_url))
    return loaded_sprites
}

export {trim_url_domain, preload_sprites}