import "react-markdown-editor-lite/lib/index.css";

import { HTMLProps, useState } from "react";
import MdEditor, { Plugins } from "react-markdown-editor-lite";

import AddPhoto from "@/assets/icons/add-photo.png";
import Clear from "@/assets/icons/times-circle-solid.png";
import MarkdownIt from "markdown-it";
import { PluginProps } from "react-markdown-editor-lite";
import { Text } from "./Text";
import cx from "classnames";
import edit from "@/assets/icons/edit.png";
import styles from "./Input.module.scss";

// import style manually

type InputProps = HTMLProps<HTMLInputElement> & {
  label?: string;
  error?: string;
  name?: string;
  onClear?: () => void;
  onBlur?: () => void;
};

export const Input = ({
  className,
  label,
  error,
  value,
  onClear,
  onBlur,
  ...restProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cx(styles.container, className)}>
      {label && <Text type="Body 2 Medium">{label}</Text>}
      <div
        className={cx(
          styles.inputWrapper,
          error !== undefined
            ? styles.errorBorder
            : isFocused
            ? styles.focusedBorder
            : styles.border
        )}
      >
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          value={value}
          {...restProps}
        />
        {Boolean(value) && onClear && <img src={Clear} onClick={onClear} />}
      </div>
      {error && (
        <Text type="Caption 1 Bold" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  );
};

type TextareaProps = HTMLProps<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  name?: string;
  onClear?: () => void;
  onBlur?: () => void;
};

export const TextArea = ({
  className,
  label,
  error,
  value,
  onClear,
  onBlur,
  ...restProps
}: TextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cx(styles.container, className)}>
      {label && (
        <Text type="Body 2 Medium" className={styles.label}>
          {label}
        </Text>
      )}
      <div
        className={cx(
          styles.textareaGrid,
          error !== undefined
            ? styles.errorBorder
            : isFocused
            ? styles.focusedBorder
            : styles.border
        )}
        data-value={value}
      >
        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          value={value}
          rows={1}
          {...restProps}
        />
        {value && onClear && (
          <img src={Clear} onClick={onClear} className={styles.clearIcon} />
        )}
      </div>
      {error && (
        <Text type="Caption 1 Bold" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  );
};

const EmptyLine = (props: PluginProps) => {
  return (
    <span
      className="button button-type-EmptyLine"
      title="EmptyLine"
      onClick={() => {
        props.editor.insertText("` `  ");
      }}
    >
      Empty Line
    </span>
  );
};
// Define default config if required
// EmptyLine.defaultConfig = {
//   start: 0
// }
EmptyLine.align = "left";
EmptyLine.pluginName = "EmptyLine";

const mdParser = new MarkdownIt({
  html: true,
});

type RichTextAreaProps = {
  label?: string;
  error?: string;
  name?: string;
  onClear?: () => void;
  onBlur?: () => void;
  className?: string;
  value?: string;
  onChange?: (text: string) => void;
  readOnly?: boolean;
};

MdEditor.unuse(Plugins.Image);
MdEditor.unuse(Plugins.Logger);
MdEditor.unuse(Plugins.Table);
MdEditor.unuse(Plugins.BlockQuote);
MdEditor.unuse(Plugins.FontStrikethrough);
MdEditor.unuse(Plugins.FontUnderline);
MdEditor.unuse(Plugins.BlockCodeBlock);
MdEditor.unuse(Plugins.BlockCodeInline);
MdEditor.unuse(Plugins.Link);

export const RichTextArea = ({
  className,
  label,
  error,
  value,
  onBlur,
  onChange,
  readOnly,
}: RichTextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  MdEditor.use(EmptyLine);

  return (
    <div className={cx(styles.container, className)}>
      {label && (
        <Text type="Body 2 Medium" className={styles.label}>
          {label}
        </Text>
      )}
      <div
        className={cx(
          styles.richTextArea,
          error !== undefined
            ? styles.errorBorder
            : isFocused
            ? styles.focusedBorder
            : styles.border
        )}
        data-value={value}
      >
        <MdEditor
          style={{ borderRadius: " 12px", overflow: "hidden" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={({ text }) => {
            onChange?.(text);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          value={value}
          readOnly={readOnly}
        />
      </div>
      {error && (
        <Text type="Caption 1 Bold" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  );
};

type ImageUploadProps = {
  label?: string;
  onSelected: (blob: Blob) => void;
  className?: string;
  imageURL?: string;
};

export const ImageUpload = ({
  label,
  className,
  onSelected,
  imageURL,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onSelected(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  return (
    <div className={className}>
      {label && <Text type="Body 2 Medium">{label}</Text>}
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />
      {!preview && !imageURL ? (
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <img src={AddPhoto} alt="Upload" className={styles.uploadIcon} />
        </label>
      ) : (
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          <img
            src={preview || imageURL}
            alt="Image Preview"
            className={styles.imagePreview}
          />
          <img src={edit} alt="Edit" className={styles.editIcon} />
        </label>
      )}
    </div>
  );
};
