import type { FC } from "react";
import "../styles/main.css";

interface Props {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  searchField?: boolean;
  placeholder?: string;
  buttonTitle?: string;
}

export const InputField: FC<Props> = ({
  value,
  setValue,
  onSubmit,
  // loading,
  searchField,
  placeholder,
  // buttonTitle = "Искать",
}) => (
  <div className="input-field">
    <input
      value={value}
      placeholder={placeholder}
      onChange={(event) => setValue(event.target.value)}
      className="text-input"
    />
    {searchField && (
      <div className="search-image">
        <input
          type="image"
          src="http://localhost:9000/stageimages/search-sign.svg"
          className="search-icon submit"
          onClick={onSubmit}
        />
      </div>
    )}
    {/*<Button disabled={loading} onClick={onSubmit}>
      {buttonTitle}
    </Button>*/}
  </div>
);
