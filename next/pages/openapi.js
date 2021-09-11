import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { getOpenApiSchema } from "./api/openapi";

export async function getStaticProps(context) {
  const openApiSchema = await getOpenApiSchema();

  return {
    props: {
      openApiSchema
    },
  }
}

export default function OpenApiPage({ openApiSchema }) {
  return <SwaggerUI spec={openApiSchema} />
}
