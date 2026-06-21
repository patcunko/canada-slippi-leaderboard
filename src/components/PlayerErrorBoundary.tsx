"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class PlayerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg px-6 py-16 text-center bg-[#2c2c2e] border border-[#48484a]">
          <p className="text-[#636366] text-base">
            Could not load player data. The Slippi API may be temporarily unavailable.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
