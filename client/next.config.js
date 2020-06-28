module.exports = {
    webpackDevMiddleware : config => {
        config.watchOptions.poll = 300;
        return config;
    },
    env: {
        PAY_KEY: process.env.STRIPE_PUBLIC_KEY,
        INGRESS_END_POINT: process.env.INGRESS_SRV,
      },
}