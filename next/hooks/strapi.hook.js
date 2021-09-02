import { getStrapiPages } from "../pages/api/strapi";

export async function withStrapiPages(staticProps = null) {
  let { data: strapiPages } = await getStrapiPages();

  if (staticProps == null) {
    staticProps = {
      props: {},
      revalidate: 30,
    };
  }

  if (staticProps.props == null) {
    staticProps.props = {};
  }

  staticProps.props.strapiPages = strapiPages;

  return staticProps;
}
