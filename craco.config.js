module.exports = {
  babel: {
    presets: [
      [
        "@babel/preset-typescript",
        {
          allowDeclareFields: true,
        },
      ],
    ],
  },
  webpack: {
    configure: {
      entry: "./src/index.tsx",
      resolve: {
        extensions: [".tsx", ".ts", "..."],
      },
    },
  },
};
