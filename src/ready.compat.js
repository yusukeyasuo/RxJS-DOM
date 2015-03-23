  /**
   * Creates an observable sequence when the DOM is loaded
   * @returns {Observable} An observable sequence fired when the DOM is loaded
   */
  dom.ready = function () {
    return new AnonymousObservable(function (observer) {
      function handler () {
        observer.onNext();
        observer.onCompleted();
      }

      function createListener() {
        if (document.addEventListener) {
          document.addEventListener( 'DOMContentLoaded', handler, false );
          root.addEventListener( 'load', handler, false );
          return function () {
            document.removeEventListener( 'DOMContentLoaded', handler, false );
            root.removeEventListener( 'load', handler, false );
          };
        } else if (document.attachEvent) {
          root.attachEvent( 'onload', handler );
          return function () { root.detachEvent( 'onload', handler ); };
        } else {
          document['onload'] = handler;
          return function () { document['onload'] = null; };
        }
      }

      var returnFn = noop;
      if (document.readyState === "complete") {
        setTimeout(handler, 0);
      } else {
        returnFn = createListener();
      }

      return returnFn;
    });
  };
