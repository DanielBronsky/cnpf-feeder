import { forwardRef } from 'react';

interface HiddenFileInputProps {
  accept?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HiddenFileInput = forwardRef<HTMLInputElement, HiddenFileInputProps>(
  ({ accept, multiple, onChange }, ref) => {
    return (
      <input
        ref={ref}
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        style={{ display: 'none' }}
      />
    );
  }
);

HiddenFileInput.displayName = 'HiddenFileInput';
