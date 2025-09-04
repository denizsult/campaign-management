export const RenderIf = ({ condition, children }: { condition?: any, children: React.ReactNode }) => {
  if (!condition) return null;
  return children;
};