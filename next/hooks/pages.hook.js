import { getPages } from "../pages/api/pages";

export async function withPages(staticProps = null) {
  let { data: pages } = await getPages();

  if (staticProps == null) {
    staticProps = {
      props: {},
      revalidate: 30,
    };
  }

  if (staticProps.props == null) {
    staticProps.props = {};
  }

  staticProps.props.pages = pages;

  return staticProps;
}
