export const restRouterTmpl = () => `import express, {Router} from 'express';
import expressRateLimit from 'express-rate-limit';

const limiter = expressRateLimit({
  windowMs: 5 * 1000, // 5 sec
  max: 5 * 5, // Limit each IP to 25 requests per 'window' (here, per 5 sec)
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});

const restRouter: Router = express.Router();

restRouter.use(limiter);

// restRouter.get('/test', (_, res) => {
//   res.send('Hello World!');
// });

export default restRouter;
`
