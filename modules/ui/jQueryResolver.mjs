
if(!window.$) {
    try {
        window.$ = window.jQuery = (await import('jquery')).default;
    }catch (e) {
        console.error('jQuery not found');
    }
}

let jq = window.$;
if(window.fpageJquery) {
    jq = window.fpageJquery;
}


export default jq;
