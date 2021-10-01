import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getBdmTableSchema, getSchema } from "../../pages/api/schemas";
import { BaseResourcePage } from "./BaseResourcePage";
import Form from "@rjsf/core";
import { CircularProgress } from "@chakra-ui/progress";
import { Center, VStack } from "@chakra-ui/layout";
import { updateDataset, updateResource } from "../../pages/api/datasets";
import { useToast } from "@chakra-ui/toast";

export function SchemaForm({
  data,
  loadSchemaFunction,
  updateFunction,
  schemaName,
  prepareData = (data) => {
    return data;
  },
}) {
  const toast = useToast();
  const { data: schema = {}, isLoading } = useQuery(
    "schema",
    loadSchemaFunction
  );
  const updateMutation = useMutation(updateFunction, {
    onSuccess() {
      toast({
        title: `${schemaName} Atualizado(a)!`,
        description: `${schemaName} atualizado(a), agora é seguro sair do formulário.`,
        status: "success",
      });
    },
    onError() {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao atualizar o(a) ${schemaName}, por favor entre em contato com a equipe de tecnologia.`,
        status: "error",
      });
    },
  });
  const [_data, setData] = useState({});

  useEffect(() => {
    setData(prepareData({ ...data }));
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Center width="100%" height="100%">
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <VStack width="100%">
          <Form
            schema={schema}
            formData={_data}
            onChange={(e) => setData(e.formData)}
            onSubmit={() => {
              updateMutation.mutate({
                ..._data,
              });
              toast({
                title: "Salvando...",
                description: `Atualizando o(a) ${schemaName}, por favor aguarde.`,
                status: "warning",
              });
            }}
          />
        </VStack>
      )}
    </>
  );
}
