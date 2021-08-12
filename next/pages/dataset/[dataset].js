import { listDatasets } from "../api/datasets";
import { getStrapiPages } from "../api/strapi";

export async function getStaticProps(context) {
  let { data: strapiPages } = await getStrapiPages();

  return {
    props: {
      strapiPages,
    },
    revalidate: 30, //TODO: Increase this timer
  };
}

export async function getStaticPaths(context) {
  let { data: datasets } = await listDatasets();

  return {
    paths: datasets.map((d) => ({
      params: { dataset: d },
    })),
    fallback: "blocking",
    revalidate: 30,
  };
}

export function DatasetPage()