import type { BaseFieldProps, GenericObject } from 'vee-validate';

export type InputType = 'text' | 'date' | 'number' | 'tel';

export type InputProps = {
  id: string;
  label: string;
  type: InputType;
  attrsVee: BaseFieldProps & GenericObject;
  attrs?: Record<string, unknown>;
  errors?: string;
};
