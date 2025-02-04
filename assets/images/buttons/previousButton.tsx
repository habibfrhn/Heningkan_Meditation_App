// previousButton.tsx
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const PreviousButton = (props: SvgProps) => (
  <Svg viewBox="0 0 512 512" {...props}>
    <Path
      transform="scale(-1,1) translate(-512,0)"
      d="M480 0c-11.776 0-21.333 9.557-21.333 21.333v210.325L42.283 2.645c-6.613-3.627-14.656-3.52-21.141.32a21.346 21.346 0 0 0-10.475 18.368v469.333a21.344 21.344 0 0 0 10.475 18.368A21.265 21.265 0 0 0 32 512c3.541 0 7.083-.875 10.283-2.645l416.384-229.013v210.325c0 11.776 9.557 21.333 21.333 21.333s21.333-9.557 21.333-21.333V21.333C501.333 9.557 491.776 0 480 0z"
    />
  </Svg>
);

export default PreviousButton;
