import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/register", "./routes/auth/register.tsx"),
  route("/login", "./routes/auth/login.tsx"),
  layout("./routes/auth/AuthRoute.tsx", [
    route("/products", "./routes/products.tsx"),
  ]),
] satisfies RouteConfig;
