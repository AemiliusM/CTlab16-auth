module.exports = (req, res, next) => {
  console.log('COOKIES', req.cookies);
  const { userId } = req.cookies;
  if (!userId) {
    throw new Error('Please sign in to continue');
  }
  console.log('USERID', userId);
  req.userId = userId;
  next();
};
