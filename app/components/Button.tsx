export default function Button({
  children,
  onClick,
  onSubmit,
  className,
}: any) {
  return (
    <button
      type="submit"
      onClick={onClick}
      onSubmit={onSubmit}
      className={className}
    >
      {children}
    </button>
  );
}
