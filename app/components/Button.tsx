interface ButtonProps {
  children?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button type="submit" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
