import React from 'react'
import AnimatedCursor from "react-animated-cursor"



function AnimCursor() {
  return (
    <div className="App">
    <AnimatedCursor
      innerSize={15}
      outerSize={20}
      color="255,255,255"
      outerAlpha={0.2}
      innerScale={1.7}
      outerScale={5.9}
      clickables={[
        "a",
        'input[type="text"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        "label[for]",
        "select",
        "textarea",
        "button",
        ".link",
      ]}
   
    />
    </div>
  );
}

export default AnimCursor