import { Switch } from "@chakra-ui/react";
import styles from "../../styles/toggle.module.css";

export default function Toggle({ value, onChange }) {
  return (
    <Switch
      className={styles.toggle}
      value={value}
      onChange={onChange}
    />
  )
}