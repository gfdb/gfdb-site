
function trim_url_domain(url_to_trim) {
    
    /* 
      since the body's texture is already loaded it has the https://domain_name
      in it, so the following is to remove that before we compare paths
    */
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

// urls have to be preloaded in matterjs
function load_image(url, onSuccess) {
    const img = new Image();
    img.onload = () => {
      onSuccess(img.src);
    };
    img.src = url;
}

export {trim_url_domain, load_image}