import React from 'react'
import "./Test.css";

function Test() {
  return (
    <>
      <section data-bgcolor="#bcb8ad" data-textcolor="#032f35">
        <div>
          <h1 data-scroll="" data-scroll-speed={1}>
            <span>Horizontal</span> <span>scroll</span> <span>section</span>
          </h1>
          <p data-scroll="" data-scroll-speed={2} data-scroll-delay="0.2">
            with GSAP ScrollTrigger &amp; Locomotive Scroll
          </p>
        </div>
      </section>
      <section id="sectionPin">
        <div className="pin-wrap">
          <h2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </h2>
          <img
            src="https://images.pexels.com/photos/5207262/pexels-photo-5207262.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=900"
            alt=""
          />
          <img
            src="https://images.pexels.com/photos/3371358/pexels-photo-3371358.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=900"
            alt=""
          />
          <img
            src="https://images.pexels.com/photos/3618545/pexels-photo-3618545.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=900"
            alt=""
          />
        </div>
      </section>
      <section data-bgcolor="#e3857a" data-textcolor="#f1dba7">
        <img
          src="https://images.pexels.com/photos/4791474/pexels-photo-4791474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt=""
        />
        <h2 data-scroll="" data-scroll-speed={1} className="credit">
          <a href="https://thisisadvantage.com" target="_blank">
            Made by Advantage
          </a>
        </h2>
      </section>
    </>
  );
}

export default Test