export async function withPages(staticProps = null) {
  if (staticProps == null) {
    staticProps = {
      props: {},
      revalidate: 30,
    };
  }

  if (staticProps.props == null) {
    staticProps.props = {};
  }

  return staticProps;
}
