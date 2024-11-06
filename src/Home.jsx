import React from "react";

const Home = () => {
  return (
    <div>
      <svg
        width="1269"
        height="630"
        viewBox="0 0 1469 830"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_3_433)">
          <path
            d="M100 167C100 127.788 131.788 96 171 96H1298C1337.21 96 1369 127.788 1369 167V426C1369 591.685 1234.69 726 1069 726H171C131.788 726 100 694.212 100 655V167Z"
            fill="url(#paint0_linear_3_433)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_3_433"
            x="0"
            y="0"
            width="1469"
            height="830"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="50" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0503125 0 0 0 0 0.123345 0 0 0 0 0.191667 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_3_433"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_3_433"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_3_433"
            x1="100"
            y1="96"
            x2="601.844"
            y2="1106.86"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#72EDF2" />
            <stop offset="1" stopColor="#5151E5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Home;
