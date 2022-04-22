import { Button } from "antd";
import { useIsSubmitting } from "remix-validated-form";

interface SubmitButtonProps {
  label: string;
}

export const SubmitButton = ({ label }: SubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button
      htmlType="submit"
      type="primary"
      disabled={isSubmitting}
      loading={isSubmitting}
    >
      {label}
    </Button>
  );
};
