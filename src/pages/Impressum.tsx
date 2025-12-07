

import React from "react";
import styles from "./Impressum.module.css";
import { BackButton } from "../components/ui";

const Impressum: React.FC = () => (
  <div className={styles.impressumWrapper}>
    <div className={styles.impressumContent}>
      <span className={styles.impressumBackBtn}>
        <BackButton iconOnly />
      </span>
      <h1>Impressum</h1>
      <p>
        Luca Steinhagen<br />
        Am Frettholz 4<br />
        59929 Brilon<br />
        E-Mail: info@lu2adevelopment.de
      </p>
    </div>
  </div>
);

export default Impressum;
