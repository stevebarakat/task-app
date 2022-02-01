interface ButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: any;
  disabled?: any;
}

export function Button({
  children,
  onClick,
  className,
  style,
  disabled,
}: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={className}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
