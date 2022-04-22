import { Form, Input, InputProps } from "antd";
import { useField } from "remix-validated-form";

type FormInputProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
};

export const FormInput = ({
  name,
  label,
  isRequired,
  ...rest
}: FormInputProps & InputProps) => {
  const { getInputProps, error } = useField(name);

  return (
    <>
      <Form.Item
        validateStatus={error ? "error" : ""}
        help={error}
        label={label}
        name={name}
      >
        <Input {...getInputProps({ id: name, ...rest })} />
      </Form.Item>
    </>
  );

  // return (
  //   <>
  //     <FormControl isInvalid={!!error} isRequired={isRequired}>
  //       <FormLabel htmlFor={name}>{label}</FormLabel>
  //       <Input
  //         {...getInputProps({
  //           id: name,
  //           ...rest,
  //         })}
  //       />
  //       {error && <FormErrorMessage>{error}</FormErrorMessage>}
  //     </FormControl>
  //   </>
  // );
};
