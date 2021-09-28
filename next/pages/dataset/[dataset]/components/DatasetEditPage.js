import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getSchema } from "../../../api/schemas";
import { BaseResourcePage } from "./BaseResourcePage";
import Form from "@rjsf/core";
import Head from "next/head";
import { CircularProgress } from "@chakra-ui/progress";
import { Center, VStack } from "@chakra-ui/layout";
import { updateDataset } from "../../../api/datasets";
import { useToast } from "@chakra-ui/toast";

export function DatasetEditPage({ dataset }) {
  const toast = useToast();
  const { data: schema = {}, isLoading } = useQuery("schema", getSchema);
  const updateMutation = useMutation(updateDataset, {
    onSuccess() {
      toast({
        title: "Dataset Atualizado!",
        description: "Dataset atualizado, agora é seguro sair do formulário.",
        status: "success",
      });
    },
    onError() {
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao atualizar dataset, por favor entre em contato com a equipe de tecnologia.",
        status: "error",
      });
    },
  });
  const [data, setData] = useState({});

  useEffect(() => {
    console.log(dataset);
    setData({
      ...dataset,
      bdm_tables: dataset.resources.filter(
        (r) => r.resource_type === "bdm_table"
      ),
      external_links: dataset.resources.filter(
        (r) => r.resource_type === "external_link"
      ),
    });
  }, [dataset]);

  return (
    <BaseResourcePage title={`Editando ${dataset.name}`}>
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
          integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
          crossorigin="anonymous"
        />
      </Head>
      {isLoading ? (
        <Center width="100%" height="100%">
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <VStack width="100%">
          <Form
            schema={schema}
            formData={data}
            onChange={(e) => setData(e.formData)}
            onSubmit={() => {
              updateMutation.mutate({
                ...data,
                resources: [...data["bdm_tables"], ...data["external_links"]],
              });
              toast({
                title: "Salvando...",
                description: "Atualizando o dataset, por favor aguarde.",
                status: "warning",
              });
            }}
          />
        </VStack>
      )}
    </BaseResourcePage>
  );
}
