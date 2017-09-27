import '/js/zen-observable.js'

const listen = (element, eventName) => {

  return new Observable(observer => {

    // Create an event handler which sends data to the sink
    let handler = event => observer.next(event);

    // Attach the event handler
    element.addEventListener(eventName, handler, true);

    // Return a cleanup function which will cancel the event stream
    return () => {
      // Detach the event handler from the element
      element.removeEventListener(eventName, handler, true);
    };

  });

}

export default listen