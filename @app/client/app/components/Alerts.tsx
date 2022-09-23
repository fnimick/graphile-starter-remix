import classNames from "classnames";
import type { IconType } from "react-icons";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

export interface AlertProps {
  title?: string;
  message?: string | null;
  code?: string | null;
  children?: React.ReactChild;
}

export function ErrorAlert(props: AlertProps) {
  return (
    <GenericAlert
      icon={IoCloseCircleOutline}
      className="alert-error"
      {...props}
    />
  );
}

export function WarningAlert(props: AlertProps) {
  return (
    <GenericAlert
      icon={IoAlertCircleOutline}
      className="alert-warning"
      {...props}
    />
  );
}

export function SuccessAlert(props: AlertProps) {
  return (
    <GenericAlert
      icon={IoCheckmarkCircleOutline}
      className="alert-success"
      {...props}
    />
  );
}

export interface GenericAlertProps extends AlertProps {
  icon?: IconType;
  className?: string;
}

export function GenericAlert({
  icon: Icon,
  className,
  title,
  message,
  code,
  children,
}: GenericAlertProps) {
  return (
    <div className={classNames("alert", className)}>
      <div>
        {!!Icon && (
          <span className="text-2xl">
            <Icon />
          </span>
        )}
        <div>
          {!!title && <h1 className="text-xl font-bold">{title}</h1>}
          <div>
            {children}
            {message}
            {!!code && (
              <span>
                {" "}
                (Error code: <code>ERR_{code}</code>)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
