/**
 * 把ArrayBuffer转化为Json
 * @param {ArrayBuffer}buffer
 * @param {String}charset
 */
cc.w.util.parseJsonFromArrayBuffer = function(buffer,charset){
    if(charset==null){
        charset = 'utf-8';
    }
    return JSON.parse(new TextDecoder(charset).decode(buffer));
};