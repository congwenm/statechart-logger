import React, { Component } from 'react';
import StateChart, {State, RoutableState, router} from 'statechartjs';
import logger from './logger';

window.State = State;
window.RoutableState = RoutableState;
window.router = router;

// router
window.routeObject = {};

// route1 test - basic 
// router.start({window: window});
// routeObject.foosRoute = router.define('/foos', (a)=> console.log('foos reached', a));
// routeObject.barsRoute = router.define('/bars', (a)=> console.log('bars reached', a));
 // router.define('/nope', function() { return false; });
// router.unknown((a) => console.log('unknown route', a));
// router._handleLocationChange('/foos');
// router._handleLocationChange('/bars');
// router._handleLocationChange('/baz'); // unknown route

// route2 test - named, splat
// routeObject.foosRoute = router.define('/foos/:id/*splat', (a) => 
//   console.log('entered "foos" with context', a)
// );
// router._handleLocationChange('/foos/99/df/dsf/asdf')

// route2 test - splat, named
routeObject.foosRoute = router.define('/foos/*splat/:id', (a) => 
  console.log('entered "foos" with context', a)
);
router._handleLocationChange('/foos/99/df/dsf/asdf')

// word statechart
window.word = RoutableState.define({concurrent: true}, function() {
  this.state('bold', function() {
    this.state('off', function() {
      this.event('toggleBold', function() { this.goto('../on'); });
      this.canExit = function() {
        console.log('can exit');
      }
    });

    this.state('on', function() {
      this.event('toggleBold', function() { this.goto('../off'); });
    });
  });

  this.state('underline', function() {
    this.state('off', function() {
      this.event('toggleUnderline', function() { this.goto('../on'); });
    });

    this.state('on', function() {
      this.event('toggleUnderline', function() { this.goto('../off'); });
    });
  });

  this.state('align', function() {
    this.state('left');
    this.state('right');
    this.state('center');
    this.state('justify');

    this.event('leftClicked', function() { this.goto('./left');});
    this.event('rightClicked', function() { this.goto('./right');});
    this.event('centerClicked', function() { this.goto('./center');});
    this.event('justifyClicked', function() { this.goto('./justify');});
  });

  this.state('bullets', function() {
    this.state('none', function() {
      this.event('regularClicked', function() { this.goto('../regular'); })
      this.event('numberClicked', function() { this.goto('../number'); })
    });

    this.state('regular', function() {
      this.event('regularClicked', function() { this.goto('../none'); })
      this.event('numberClicked', function() { this.goto('../number'); })
    });

    this.state('number', function() {
      this.event('regularClicked', function() { this.goto('../regular'); })
      this.event('numberClicked', function() { this.goto('../none'); })
    });
  });

  this.event('resetClicked', function() { this.goto(); });
});

word.trace = true;
State.logger = logger;


//mock data
window.CMM = {
  seeds: {
    currentUser: {
      id: 'current user id'
    }
  }
}

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Hdello, world.</h1>
        <button onClick={this.triggerEvents}>Call some events</button>
      </div>
    );
  }

  triggerEvents() {
    word.goto();
    word.current(); // => ['/bold/off', '/underline/off', '/align/left', '/bullets/none']

    word.send('toggleBold');
    word.current(); // => ['/bold/on', '/underline/off', '/align/left', '/bullets/none']

    word.send('toggleUnderline');
    word.current(); // => ['/bold/on', '/underline/on', '/align/left', '/bullets/none']

    word.send('rightClicked');
    word.current(); // => ['/bold/on', '/underline/on', '/align/right', '/bullets/none']

    word.send('justifyClicked');
    word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/none']

    word.send('regularClicked');
    word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/regular']

    word.send('regularClicked');
    word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/none']

    word.send('numberClicked');
    word.current(); // => ['/bold/on', '/underline/on', '/align/justify', '/bullets/number']

    word.send('resetClicked');
    word.current(); // => ['/bold/off', '/underline/off', '/align/left', '/bullets/none']
  }
}
