// homeIcon.tsx
import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const HomeIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M21.71 12.71a1 1 0 0 1-1.42 0l-.29-.29v7.88a1.77 1.77 0 0 1-1.83 1.7H16a1 1 0 0 1-1-1v-5.9a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V21a1 1 0 0 1-1 1H5.83A1.77 1.77 0 0 1 4 20.3v-7.88l-.29.29a1 1 0 0 1-1.42 0 1 1 0 0 1 0-1.42l9-9a1 1 0 0 1 1.42 0l9 9a1 1 0 0 1 0 1.42Z" />
  </Svg>
);

export default HomeIcon;
