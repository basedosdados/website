import cookieParser from 'cookie-parser';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function(req, res, next) {
  cookieParser()(req, res, () => {});
  next();
}
