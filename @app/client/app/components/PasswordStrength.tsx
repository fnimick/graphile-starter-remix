import classNames from "classnames";
import { IoInformationCircleOutline } from "react-icons/io5";

export interface PasswordStrengthProps {
  passwordStrength: number; // 0-4
  suggestions: string[];
  isDirty: boolean;
}

export function PasswordStrength({
  passwordStrength,
  suggestions = [
    "Use a few words, avoid common phrases",
    "No need for symbols, digits, or uppercase letters",
  ],
  isDirty = false,
}: PasswordStrengthProps) {
  if (!isDirty) return null;

  return (
    <div className="flex flex-row justify-between">
      <div className="basis-3/4">
        <progress
          className={classNames(
            ["progress progress-primary my-2 w-full"],
            passwordStrength < 2 ? "progress-error" : "progress-success"
          )}
          value={passwordStrength + 1}
          max="5"
        ></progress>
      </div>
      {suggestions.length > 0 && (
        <div className="dropdown dropdown-end dropdown-hover">
          <label
            tabIndex={0}
            className="btn btn-circle btn-ghost btn-xs text-info cursor-default text-lg"
          >
            <IoInformationCircleOutline />
          </label>
          <div
            tabIndex={0}
            className="card compact dropdown-content bg-base-100 rounded-box w-80 shadow"
          >
            <div className="card-body">
              <h2 className="card-title">Password Suggestions</h2>
              <ul className="list-inside list-disc">
                {suggestions.map((suggestion, key) => {
                  return <li key={key}>{suggestion}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
