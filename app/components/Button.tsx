export default function Button({ children, onClick, className }: any) {
  return (
    <button type="submit" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
