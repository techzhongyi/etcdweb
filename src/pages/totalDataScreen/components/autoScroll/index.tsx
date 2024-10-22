import React, { useRef, useEffect } from 'react';

const AutoScroll = ({ duration }) => {
  const scrollContainerRef = useRef(null);
  let startTime = null;

  const scroll = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = timeElapsed / duration;
    if (progress >= 1) {
      scrollContainerRef.current.scrollTop += 1;
      return;
    }
    scrollContainerRef.current.scrollTop =
      progress *
      (scrollContainerRef.current.scrollHeight -
        scrollContainerRef.current.clientHeight);
    window.requestAnimationFrame((currentTime) => scroll(currentTime));
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      window.requestAnimationFrame((currentTime) => scroll(currentTime));
    }
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      style={{ overflowY: 'scroll', height: '247px' }}
    >
      {/* Your scrollable content here */}
    </div>
  );
};

export default AutoScroll;
