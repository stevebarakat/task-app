export default function Button({ children, onClick, className }: any) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
