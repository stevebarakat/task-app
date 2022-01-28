interface ButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: unknown;
}

export function Button({ children, onClick, className, style }: ButtonProps) {
  return (
    <button type="submit" onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}
