import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const RepeatButton = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M3.58 5.16h13.84c1.66 0 3 1.34 3 3v3.32"
    />
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M6.74 2 3.58 5.16l3.16 3.16M20.42 18.84H6.58c-1.66 0-3-1.34-3-3v-3.32"
    />
    <Path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m17.26 22 3.16-3.16-3.16-3.16"
    />
  </Svg>
);

export default RepeatButton;
