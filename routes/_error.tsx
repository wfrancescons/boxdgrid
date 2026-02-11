import { PageProps } from "fresh";

export default function ErrorPage(props: PageProps) {
  const url = new URL(props.url);
  url.pathname = "/";
  return Response.redirect(url.toString(), 307);
}
