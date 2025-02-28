import { useState } from "react";

export function GeoTree(props, schema) {
  const n_levels = 5;
  let [chosen_levels, set_chosen_levels] = useState(
    _id_to_levels(props.formData, n_levels),
  );

  let tree = Object.values(schema);
  tree.forEach((x) => {
    x.level = x.id.split(".").length - 1;
  });

  let selects = [];

  const update_chosen_levels = (level) => (e) => {
    let new_chosen_levels = Array(n_levels).fill("", 0);
    for (let i = 0; i < level; i++) new_chosen_levels[i] = chosen_levels[i];
    new_chosen_levels[level] = e.target.value;
    set_chosen_levels(new_chosen_levels);
    props.onChange(_build_id(new_chosen_levels));
  };

  for (let i = 0; i < n_levels; i++) {
    let options = tree.filter(
      (x) =>
        x.level === i &&
        (i === 0 ||
          (chosen_levels[i - 1] !== "" &&
            x.id.startsWith(chosen_levels[i - 1]))),
    );
    options = options.map((x) => (
      <option key={x.id} value={x.id}>
        {x.label.pt}
      </option>
    ));
    options.unshift(
      <option key={"empty"} value={""}>
        {"--"}
      </option>,
    );
    selects.push(
      <select
        className="form-control"
        onChange={update_chosen_levels(i)}
        value={chosen_levels[i]}
      >
        {options}
      </select>,
    );
  }

  const formid = props.idSchema["$id"];

  return (
    <div>
      <label> </label>
      {selects}
      <input
        readOnly
        className={props.classNames}
        name={formid}
        label="spatial_coverage_hidden_field"
        type="text"
        hidden={false}
        value={props.formData}
      ></input>
    </div>
  );
}

function _build_id(levels) {
  let lvls = levels.filter((w) => w !== "");
  if (lvls.length === 0) return "";
  return lvls.slice(-1)[0];
}

function _id_to_levels(id, n_levels) {
  if (id === undefined || id === null) return Array(n_levels).fill("");
  let out = [];
  for (let i = 0; i < id.length; i++)
    if (id[i] === ".") out.push(id.slice(0, i));
  out.push(id);
  while (out.length < n_levels) out.push("");
  return out;
}
