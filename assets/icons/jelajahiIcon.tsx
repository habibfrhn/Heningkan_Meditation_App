// assets/icons/jelajahiIcon.tsx
import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const JelajahiIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path
      fillRule="evenodd"
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm5.984 5.39c.215-.745-.487-1.446-1.233-1.232l-.102.035L9.58 9.02l-.106.05a1 1 0 0 0-.39.382l-.062.125-2.828 7.071-.035.102c-.214.746.487 1.448 1.233 1.233l.102-.035 7.07-2.828.106-.05a1 1 0 0 0 .391-.381l.06-.126 2.83-7.071.034-.102ZM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
    />
  </Svg>
);

export default JelajahiIcon;
