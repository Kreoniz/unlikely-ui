export function stateClass<State>(
  base: string,
  className?: string | ((state: State) => string | undefined),
) {
  return (state: State) =>
    [base, typeof className === 'function' ? className(state) : className]
      .filter(Boolean)
      .join(' ');
}
