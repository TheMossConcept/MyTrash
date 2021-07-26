declare module "react-native-progress-wheel" {
  import { Component } from "react";

  export interface ProgressWheelProps {
    progress?: number;
    animateFromValue?: number;
    width?: number;
    size?: number;
    color?: string;
    backgroundColor?: string;
    duration?: number;
  }

  // eslint-disable-next-line react/prefer-stateless-function
  export default class ProgressWheel extends Component<ProgressWheelProps> {}
}
