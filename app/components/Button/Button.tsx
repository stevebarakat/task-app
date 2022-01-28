export const links = () => [{ rel: "stylesheet", href: styles }];

interface ButtonProps {
  children?: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className: string;
}

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button type="submit" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
