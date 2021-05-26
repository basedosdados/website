"use strict";


function clear_debug() {
    var h_in_debug_screen = $('#flDebugTemplatePanel-content div.scroll tr td').filter( function (){ return $(this).text() === 'h' });
    h_in_debug_screen.siblings().html('') // TODO: create a collapsible instead of killing all content
};
setTimeout(clear_debug, 3000)
