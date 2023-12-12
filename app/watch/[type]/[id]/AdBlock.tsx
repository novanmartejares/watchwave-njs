import React, { useEffect, useState } from "react";

const DetectAdBlock = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  const detectAdBlocker = () => {
    const head = document.getElementsByTagName("head")[0];

    const noAdBlockDetected = () => {
      setAdBlockDetected(false);
    };

    const adBlockDetected = () => {
      setAdBlockDetected(true);
    };

    // clean up stale bait
    const oldScript = document.getElementById("adblock-detection");
    if (oldScript) {
      head.removeChild(oldScript);
    }

    // we will dynamically generate some 'bait'.
    const script = document.createElement("script");
    script.id = "adblock-detection";
    script.type = "text/javascript";
    script.src = "/adframe.js"; // changed name of bait; seems ads.js was considered safe.
    script.onload = noAdBlockDetected;
    script.onerror = adBlockDetected;
    head.appendChild(script);
  };

  useEffect(() => {
    detectAdBlocker();
  }, []);

  const noticeContentJSX = () => (
    <div id="adblock-notice">
      <div className="message">
        <h3>Hey, you!</h3>
        <p>Your adblocker is on again.</p>
        <button onClick={detectAdBlocker}>Check for Adblocker again</button>
      </div>
    </div>
  );

  return (
    <div id="adblock-wrapper">
      {adBlockDetected ? noticeContentJSX() : "No adblocker here..."}
    </div>
  );
};

export default DetectAdBlock;
