import { Switch } from "@chakra-ui/react";
import styles from "../../styles/toggle.module.css";

export default function Toggle({
  value,
  onChange,
  className = "toggle",
  ...props
}) {
  return (
    <Switch
      className={styles[className]}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
