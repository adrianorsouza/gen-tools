const filterCustom = {
  name: 'filterCustom',
  matcher: (token) => !['typography'].includes(token.type),
};

export default filterCustom;
