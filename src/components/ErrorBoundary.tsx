"use client";
import { Component, ReactNode } from "react";

interface Props {
  message: string;
  compact?: boolean;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.compact) {
        return <p className="text-xs text-[#636366]">{this.props.message}</p>;
      }
      return (
        <div className="rounded-lg px-6 py-16 text-center border" style={{ background: "#18181a", borderColor: "#2f2f31" }}>
          <p className="text-[#636366] text-base">{this.props.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
