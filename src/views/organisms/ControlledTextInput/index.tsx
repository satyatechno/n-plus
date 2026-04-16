import React from 'react';
import { TextInputProps } from 'react-native';
import { UseControllerProps, useFormContext } from 'react-hook-form';

import CustomTextInput, { CustomTextInputProps } from '@src/views/molecules/CustomTextInput';

interface Props {
  name: string;
  setFormError: (error: boolean) => void;
}

/**
 * ControlledTextInput component that integrates with react-hook-form's form context.
 * It uses a custom text input component and passes down all received props.
 *
 * @param {string} name - The name of the input field used in the form.
 * @param {function} setFormError - Callback to notify if the form context or name is missing.
 * @param {...TextInputProps} props - All native TextInput props.
 * @param {...UseControllerProps} props - Props from react-hook-form for field control.
 * @param {...CustomTextInputProps} props - Custom props for the `CustomTextInput` component.
 *
 * @returns {JSX.Element | null} Rendered `CustomTextInput` if form context and name are valid; otherwise, returns null.
 */

const ControlledTextInput = (
  props: Props & TextInputProps & UseControllerProps & CustomTextInputProps
) => {
  const { name, setFormError } = props;
  const formContext = useFormContext();

  if (!formContext || !name) {
    setFormError(true);
    return null;
  }

  return <CustomTextInput {...props} />;
};

export default ControlledTextInput;
