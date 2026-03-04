
// Cluster.jsx
// horizontal rhythm container for spacing between elements
// how elements are grouped together horizontally, should wrap, etc
export default function Cluster({ children, ...rest }) {
  return <div className="cluster" {...rest}>{children}</div>;
}
