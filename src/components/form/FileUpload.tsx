"use client";

import Upload from "./Upload";

interface Props {
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export default function FileUpload({
  value,
  onChange,
}: Props) {
  return (
    <Upload
      value={value}
      onChange={onChange}
      accept={{
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          [".xlsx"],
      }}
    />
  );
}