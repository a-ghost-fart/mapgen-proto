import {Config} from './conf/Config';
import {LoadingState} from './states/LoadingState';
import {PlayState} from './states/PlayState';

/**
 * Bootstrap the game. For the purpose of
 * debugging, the game itself is applied
 * to the window object, but eventually
 * this will fall off and just sit within
 * it's own scope.
 */
window.onload = function () {
    'use strict';
    document.title = Config.TITLE + ' v' + Config.VERSION;
    window.g = new Phaser.Game(
        Config.WIDTH,
        Config.HEIGHT,
        Phaser.CANVAS,
        document.getElementById('viewport'),
        null,
        false,
        false
    );
    window.g.state.add('load', LoadingState);
    window.g.state.add('play', PlayState);
    window.g.state.start('load');
};
