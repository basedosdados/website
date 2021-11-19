import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Form from "@rjsf/core";
import { CircularProgress } from "@chakra-ui/progress";
import { Center, VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import Head from "next/head";

export function SchemaForm({
  data,
  loadSchemaFunction,
  updateFunction,
  onSuccess = null,
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
    onSuccess({ data }) {
      toast({
        title: `${schemaName} Atualizado(a)!`,
        description: `${schemaName} atualizado(a), agora é seguro sair do formulário.`,
        status: "success",
      });
      if (onSuccess) onSuccess(data);
      else window.location.reload();
    },
    onError(error) {
      const data = error.response.data.error;
      const errorStr = data.message
        .map((m) => {
          let message = m.msg;

          if (m.loc) {
            message = m.loc[3] + " " + message;
          }

          return message;
        })
        .join(",");

      toast({
        title: "Erro",
        description: errorStr,
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
          <Head>
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
              integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
              crossorigin="anonymous"
            />
          </Head>
          <Form
            schema={schema}
            formData={_data}
            onChange={(e) => setData(e.formData)}
            noValidate={true}
            onSubmit={() => {
              updateMutation.mutate(
                prepareData({
                  ..._data,
                })
              );
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
