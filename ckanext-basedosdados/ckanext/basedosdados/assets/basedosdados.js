"use strict";


function clear_debug() {
    var h_in_debug_screen = $('div.scroll tr td').filter( function (){ return $(this).text() === 'h' });
    h_in_debug_screen.siblings().html('') // TODO: create a collapsible instead
};
setTimeout(clear_debug, 1000)

