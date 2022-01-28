export default function Label({ children, name }: any) {
  return <label htmlFor={name}>{children}</label>;
}
