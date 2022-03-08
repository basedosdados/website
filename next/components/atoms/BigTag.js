export function BigTag({ children, ...style }) {
  return (
    <Heading
      fontSize="16px"
      backgroundColor="#2B8C4D"
      borderRadius="15px"
      color="white"
      fontWeight="500"
      fontFamily="Ubuntu"
      letterSpacing="0.5px"
      padding="10px 15px"
      width="100%"
      {...style}
    >
      {children}
    </Heading>
  );
}
