import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";

interface RenderProbeProps {
  id: string;
  onRender: ProfilerOnRenderCallback;
  children: ReactNode;
}

/**
 * Wraps children in a <Profiler> so a {@link createRenderCounter} can tally
 * their commits. Test-only.
 */
export function RenderProbe({ id, onRender, children }: RenderProbeProps) {
  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}
