import type { BaseFieldProps, GenericObject } from 'vee-validate';

export type InputType = 'text' | 'date' | 'number' | 'tel' | 'email';

export type InputProps = {
  id: string;
  label: string;
  type: InputType;
  attrsVee: BaseFieldProps & GenericObject;
  attrs?: Record<string, unknown>;
  errors?: string;
  optional?: boolean;
  required?: boolean;
};

export type SelectOption = {
  label: string;
  value: string | number;
};

export type SelectProps = {
  id: string;
  label: string;
  options: SelectOption[];
  attrsVee: BaseFieldProps & GenericObject;
  attrs?: Record<string, unknown>;
  errors?: string;
  required?: boolean;
  placeholder?: string;
};

export type FileInputProps = {
  id: string;
  label: string;
  attrsVee?: BaseFieldProps & GenericObject;
  attrs?: Record<string, unknown>;
  errors?: string;
  required?: boolean;
  preview?: string | null; // URL de imagen existente (útil al editar)
};
