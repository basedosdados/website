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
  let { data: schema = {}, isLoading } = useQuery(
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



  //// Geo stuff

  const uiSchema = {
      spatial_coverage:{
          items: {
          'ui:field' : 'geo_tree'
          }
      }
  }
  const fields = {geo_tree: (props) => geo_tree(props, schema)}

  /////

  if (schema.schema === undefined) schema = {schema: schema} // TODO: remove this after changing all endpoints
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
            schema={schema.schema}
            formData={_data}
            onChange={(e) => setData(e.formData)}
            noValidate={true}
            uiSchema={uiSchema}
            fields={fields}
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

function geo_tree(props, schema) {
    const n_levels = 5
    let [chosen_levels, set_chosen_levels] = useState(Array(n_levels).fill('', 0));

    let tree = Object.values(schema.spatial_coverage_tree)
    tree.forEach(x => {x.level = x.id.split('.').length - 1})

    let selects = []
    const update_chosen_levels = (level) => (e) => {
        let new_chosen_levels = Array(n_levels).fill('', 0)
        for(let i=0; i<level; i++) new_chosen_levels[i] = chosen_levels[i]
        new_chosen_levels[level] = e.target.value
        set_chosen_levels(new_chosen_levels)
    }

    for (let i=0; i<n_levels; i++){
        let options = tree.filter(x => x.level === i && (i === 0 || (chosen_levels[i-1] !== '' && x.id.startsWith(chosen_levels[i-1]))))
        options = options.map(x => <option key={x.id} value={x.id}>{x.label.pt}</option>)
        options.unshift(<option key={'empty'} value={''}>{'--'}</option>)
        selects.push(
            <select class="form-control" onChange={update_chosen_levels(i)} value={chosen_levels[i]}>
                {options}
            </select>
        )
    }

    const formid = props.idSchema['$id']

    function build_id() {
        let lvls = chosen_levels.filter(w => w !== '')
        if (lvls.length === 0) return ''
        return lvls.slice(-1)[0]
    }

    return (
        <div>
            <label> </label>
            {selects}
            <input readOnly className="form-control" id={formid} name={formid} label="spatial_coverage_hidden_field" placeholder="" type="text" hidden={false} value={build_id()}></input>
        </div>
    )
  }
