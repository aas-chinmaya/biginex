"use client";

import Upload from "./Upload";

interface Props {
  value?: File | null;
  onChange?: (file: File | null) => void;
  maxSize?: number;
}

export default function ImageUpload({
  value,
  onChange,
  maxSize,
}: Props) {
  return (
    <Upload
      preview
      value={value}
      onChange={onChange}
      maxSize={maxSize}
      accept={{
        "image/*": [],
      }}
    />
  );
}
