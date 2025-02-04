// pauseButton.tsx
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const PauseButton = (props: SvgProps) => (
  <Svg viewBox="0 0 512 512" {...props}>
    <Path
      d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256s256-114.626,256-256C512,114.625,397.375,0,256,0z M224,336h-64V176h64V336z M352,336h-64V176h64V336z"
      fill="#000"
    />
  </Svg>
);

export default PauseButton;
