export const RenderIf = ({ condition, children }: { condition: boolean, children: React.ReactNode }) => {
  if (!condition) return null;
  return children;
};