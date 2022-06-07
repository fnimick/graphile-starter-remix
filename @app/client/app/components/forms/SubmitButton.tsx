import type { ButtonProps } from "antd";
import { Button } from "antd";
import { useIsSubmitting } from "remix-validated-form";

interface SubmitButtonProps {
  label: string;
}

export const SubmitButton = ({
  label,
  ...rest
}: SubmitButtonProps & ButtonProps) => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button
      htmlType="submit"
      disabled={isSubmitting}
      loading={isSubmitting}
      {...rest}
    >
      {label}
    </Button>
  );
};
