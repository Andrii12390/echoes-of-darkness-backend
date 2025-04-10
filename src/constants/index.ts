const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  maxAge: 3600 * 1000,
  sameSite: 'lax' as 'lax',
  path: '/',
};

const COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as 'lax',
  path: '/',
};

export { 
  COOKIE_OPTIONS,
  COOKIE_CLEAR_OPTIONS 
};
