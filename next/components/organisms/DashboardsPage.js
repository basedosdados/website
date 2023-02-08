import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExpandableTable } from "../molecules/ExpandableTable";
import {
    filterOnlyValidValues,
    formatObjectsInArray,
    translate,
    unionArrays,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { SchemaForm } from "../molecules/SchemaForm";
import { deleteDataset, updateDataset } from "../../pages/api/datasets";
// import { getDatasetSchema } from "../../pages/api/schemas";

import {
  AspectRatio
} from "@chakra-ui/react";


export function DashboardsPage({
  dataset,
  availableOptionsTranslations,
}) {
  // useEffect(() => {
  //   const page = pages.filter((p) => p.id == pageId)[0];
  //   setRightColumnHtml(converter.makeHtml(page.right_column_markdown));
  //   setLeftColumnHtml(converter.makeHtml(page.left_column_markdown));
  //   setData(page);
  //   typeof hbspt != "undefined" ? (
  //     hbspt.forms.create({
  //     region: "na1",
  //     portalId: "9331013",
  //     formId: "08b23364-b41f-414e-bb1a-c21306f6b70b",
  //     target: "#form-hbspt",
  //     })
  //   ) : (
  //     <></>
  //   );
  // }, []);

  if (!dataset?.dataset_id === "br-ibge-ipca") // TODO: remove this hardcoded value
    return (
      <BaseResourcePage title="">
        <AspectRatio
          maxWidth="500px"
          ratio={1}
        >
          <iframe
            src="https://perguntas.basedosdados.org/public/dashboard/4f975de7-33f7-4c31-ac78-4de48938f17d"
            frameborder="0"
            width="800"
            height="600"
            title=""
            allowtransparency
          ></iframe>
        </AspectRatio>
      </BaseResourcePage>
    );
}
