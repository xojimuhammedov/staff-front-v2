import React from 'react';

function CheckMinus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g filter="url(#filter0_d_3585_7487)">
        <path
          d="M14.375 10H5.625"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          shape-rendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3585_7487"
          x="2.875"
          y="8.25"
          width="14.25"
          height="5.5"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.117647 0 0 0 0 0.227451 0 0 0 0 0.541176 0 0 0 0.6 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3585_7487" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3585_7487"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default CheckMinus;
