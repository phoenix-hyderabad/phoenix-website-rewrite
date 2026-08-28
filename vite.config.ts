import path from "path";

// https://vitejs.dev/config/
export default {
  plugins: [],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
};
